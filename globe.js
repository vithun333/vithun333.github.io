/* ============================================================================
   The dot-matrix earth that opens About.

   Why it is here: the page's argument is six countries, so a globe that turns
   to each of them is the argument rather than decoration. It is also the same
   language the rest of the site already speaks — the portrait is a halftone
   dot screen, the marquee and the playground are set in a dot-matrix face, the
   column rules are dashed — so an earth made of dots is that idea at another
   scale rather than a new one.

   How it draws: a square grid in SCREEN space, not on the sphere. For each
   cell inside the disc, un-project to a point on the sphere, undo the tilt and
   the spin, and look the latitude and longitude up in the land mask. That is
   what gives the rectilinear dot field rather than dots crowding at the poles,
   and it costs one pass over a fixed number of cells however far it has
   turned. Land and sea are two paths, each filled once, so a frame is two draw
   calls no matter how many thousand dots are in it.

   Scroll is read from the scroller's scrollTop against a cached header height,
   not from a rect per frame. A rect read is a forced layout, and forcing one
   every frame on a page this long is exactly the jank an eased scroll cannot
   survive.
   ========================================================================== */
(function(){
  var M=window.GLOBE_MASK;
  if(!M)return;

  /* unpack the mask once */
  var bits=null;
  function mask(){
    if(bits)return bits;
    var raw=atob(M.bits),n=raw.length,b=new Uint8Array(n),i;
    for(i=0;i<n;i++)b[i]=raw.charCodeAt(i);
    bits=b;return bits;
  }
  function isLand(mx,my){
    var i=my*M.w+mx;
    return (mask()[i>>3]>>(7-(i&7)))&1;
  }

  var PI=Math.PI;
  var MAXBACK=760;          // largest backing-store edge, device px

  function Globe(canvas,opt){
    opt=opt||{};
    this.cv=canvas;
    this.ctx=canvas.getContext('2d');
    /* A dot COUNT rather than a dot SIZE. Pitch in pixels means a bigger globe
       costs quadratically more arcs — the 840px version was drawing 4,800 of
       them per frame. Fixing the grid at ~62 cells across bounds the cost at
       any size, and keeps the dot density looking the same on every screen. */
    this.grid=opt.grid||62;
    this.pitch=opt.pitch||0;          // 0 = derive from grid
    this.fill=opt.fill||0.44;         // disc size as a fraction of the box
    this.lon=opt.lon||0;
    this.tilt=opt.tilt==null?18:opt.tilt;
    this.land='#FF6A00';
    this.sea='#12120F';
    this.paper='#EFECE4';
    /* The land mask is one cell per degree, so a rotation smaller than about
       half a degree flips no dots at all — redrawing on it is thousands of
       arcs for an identical picture. At the idle drift rate that is the
       difference between sixty redraws a second and about eight, which is the
       whole reason this can share a frame with an eased scroll. */
    this.step=opt.step||0.42;
    this.drawn=null;
    this.w=this.h=0;this.dpr=1;
    this.dpr0=Math.min(1.5,window.devicePixelRatio||1);
    this.base=null;
    this.readColours();
  }

  Globe.prototype.readColours=function(){
    try{
      var cs=getComputedStyle(document.documentElement);
      this.land=(cs.getPropertyValue('--accent')||'').trim()||this.land;
      this.sea=(cs.getPropertyValue('--ink')||'').trim()||this.sea;
      this.paper=(cs.getPropertyValue('--paper')||'').trim()||this.paper;
    }catch(e){}
  };

  /* Told its size, rather than asking. Asking means a getBoundingClientRect on
     every draw, and a rect read is a forced layout — up to thirty of them a
     second, during a scroll, on a long page. The CSS scale on the wrapper is a
     transform, so the LAYOUT size is stable and can be cached until something
     actually resizes. */
  Globe.prototype.setSize=function(w,h){
    if(!w||!h)return false;
    w=Math.round(w);h=Math.round(h);
    if(w===this.w&&h===this.h)return true;
    this.w=w;this.h=h;

    /* THE COST OF THIS THING IS AREA, NOT ARCS.

       At a device pixel ratio of 1.5 a 1091px globe is a 1636x1636 surface —
       2.7 megapixels to clear and fill on every frame. That, not the two and a
       half thousand circles, is what an eased scroll could not share a frame
       with. So the backing store is capped: it is a low-frequency field of soft
       dots on a flat ground, which is the one kind of image that survives being
       drawn small and scaled up. 760px caps it at 0.58 megapixels — a fifth of
       the work — for a 1.4x upscale whose only visible effect is slightly
       softer dot edges, which suits a halftone. */
    var scale=Math.min(this.dpr0,MAXBACK/Math.max(w,h));
    this.cv.width=Math.max(1,Math.round(w*scale));
    this.cv.height=Math.max(1,Math.round(h*scale));
    this.dpr=scale;
    this.base=null;                        // the cached ground layer is stale
    this.drawn=null;                       // and a resized canvas is a blank one
    return true;
  };

  Globe.prototype.resize=function(){
    if(this.w&&this.h)return true;                     // already known
    var r=this.cv.getBoundingClientRect();
    if(!r.width||!r.height)return false;
    return this.setSize(r.width,r.height);
  };

  /* rgb triplet from a hex or rgb() string, so dots can be mixed toward the
     paper for the limb without a second canvas */
  function rgb(c){
    c=String(c).trim();
    if(c.charAt(0)==='#'){
      if(c.length===4)c='#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3];
      var n=parseInt(c.slice(1),16);
      return [(n>>16)&255,(n>>8)&255,n&255];
    }
    var m=c.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    return m?[+m[1],+m[2],+m[3]]:[0,0,0];
  }

  Globe.prototype.P=function(){
    var W=this.cv.width,H=this.cv.height;
    return this.pitch?this.pitch*this.dpr:Math.max(3,Math.min(W,H)/this.grid);
  };

  /* THE SEA NEVER MOVES.

     The faint dots are a fixed grid over a fixed disc — which cell is water
     changes as the earth turns, but the GRID does not. So the whole field is
     drawn once into an offscreen canvas and blitted each frame, and the per
     frame path only has to carry the land. That is about 60% of the arcs and
     one of the two full-surface fills gone, for one bitmap copy that the GPU
     does for nothing.

     Land dots are drawn opaque and roughly twice the radius, so they cover the
     faint dot underneath them completely and the result is identical. */
  Globe.prototype.buildBase=function(){
    var W=this.cv.width,H=this.cv.height,P=this.P();
    var b;
    try{b=document.createElement('canvas');}catch(e){return null;}
    if(!b||!b.getContext){this.base=false;return null;}
    b.width=W;b.height=H;
    var c=b.getContext('2d'); if(!c){this.base=false;return null;}
    var R=Math.min(W,H)*this.fill,cx=W/2,cy=H/2,se=rgb(this.sea);
    var x,y,dx,dy,d2,z,r;
    c.beginPath();
    for(y=P/2;y<H;y+=P){
      for(x=P/2;x<W;x+=P){
        dx=(x-cx)/R;dy=(y-cy)/R;d2=dx*dx+dy*dy;
        if(d2>1)continue;
        z=Math.sqrt(1-d2);
        r=P*0.15*(0.45+0.55*z);
        if(r<0.35)continue;
        c.moveTo(x+r,y);c.arc(x,y,r,0,6.283185307179586);
      }
    }
    c.fillStyle='rgb('+se[0]+','+se[1]+','+se[2]+')';
    c.globalAlpha=0.26;c.fill();
    this.base=b;
    return b;
  };

  Globe.prototype.draw=function(){
    if(!this.resize())return;
    this.drawn=this.lon;
    var ctx=this.ctx,W=this.cv.width,H=this.cv.height;
    var P=this.P();
    var R=Math.min(W,H)*this.fill, cx=W/2, cy=H/2;
    var lo=-this.lon*PI/180, ti=this.tilt*PI/180;
    var ct=Math.cos(ti),st=Math.sin(ti),cl=Math.cos(lo),sl=Math.sin(lo);
    var mw=M.w,mh=M.h;
    var la=rgb(this.land);

    /* clearRect and a plain draw, NOT globalCompositeOperation='copy'. Copy
       saves a pass on paper, but it is one of the modes that can drop a canvas
       out of GPU acceleration — a saving that costs far more than it saves. */
    ctx.clearRect(0,0,W,H);
    var base=(ctx.drawImage&&this.base!==false)?(this.base||this.buildBase()):null;
    if(base){ctx.globalAlpha=1;ctx.drawImage(base,0,0);}

    /* one path, one fill, land only */
    var x,y,dx,dy,d2,z,X,Y,Z,Y2,Z2,X3,Z3,lat,lon,mx,my,r;
    ctx.beginPath();
    for(y=P/2;y<H;y+=P){
      for(x=P/2;x<W;x+=P){
        dx=(x-cx)/R;dy=(y-cy)/R;d2=dx*dx+dy*dy;
        if(d2>1)continue;
        z=Math.sqrt(1-d2);
        X=dx;Y=-dy;Z=z;
        Y2=Y*ct+Z*st; Z2=-Y*st+Z*ct;          // undo the tilt
        X3=X*cl-Z2*sl; Z3=X*sl+Z2*cl;         // undo the spin
        lat=Math.asin(Y2<-1?-1:Y2>1?1:Y2);
        lon=Math.atan2(X3,Z3);
        mx=((lon/PI*0.5+0.5)*mw)|0; if(mx<0)mx+=mw; if(mx>=mw)mx-=mw;
        my=((0.5-lat/PI)*mh)|0; if(my<0)my=0; else if(my>=mh)my=mh-1;
        if(!isLand(mx,my))continue;
        r=P*0.40*(0.5+0.5*z);
        if(r<0.35)continue;
        ctx.moveTo(x+r,y);
        ctx.arc(x,y,r,0,6.283185307179586);
      }
    }
    ctx.fillStyle='rgb('+la[0]+','+la[1]+','+la[2]+')';
    ctx.globalAlpha=1;
    ctx.fill();
  };

  Globe.prototype.setLon=function(v){
    this.lon=v;
    if(this.drawn!==null&&Math.abs(v-this.drawn)<this.step)return;   // nothing would move
    this.draw();
  };

  /* Longitude and tilt together: the tilt is what brings a city's latitude to
     the middle of the disc, so travelling from Chennai to Vancouver leans the
     earth over as well as turning it. */
  Globe.prototype.setView=function(lon,tilt){
    if(lon===this.lon&&tilt===this.tilt)return;
    this.lon=lon;this.tilt=tilt;this.draw();
  };

  window.Globe={
    make:function(canvas,opt){return new Globe(canvas,opt);}
  };
})();

/* ============================================================================
   The scene: the earth beside the About header.

   It turns on its own for as long as it is on screen, and scrolling adds to
   that turn rather than being the only thing that causes it. That distinction
   is the whole feel of the thing — a globe whose rotation is a pure function
   of scroll position stops dead the instant you stop moving, which reads as a
   picture being dragged rather than a planet that happens to be there.

   It also means the page scrolls at its own speed. The previous version pinned
   a 250vh section and mapped the rotation onto it, so getting past the header
   took two and a half screens of scrolling and the page felt stuck.

   Progress is read from the header's rect, deliberately: About is sometimes a
   document and sometimes an overlay pane fixed to the viewport, and a rect is
   measured against the viewport either way.
   ========================================================================== */
(function(){
  var START=80.3;          // Chennai, and westward from there
  var TILT=20;
  var DRIFT=3.2;           // degrees per second, unattended
  var SWEEP=200;           // extra degrees across the header's exit
  function clamp(v,a,b){return v<a?a:v>b?b:v;}

  window.mountGlobeScene=function(scope){
    if(!scope||!window.Globe)return null;
    /* There was a ?globe=off switch here while the scroll problem was being
       hunted. It did its job and is gone — a debug flag that can leave the
       feature silently dead is worse than no flag at all. Anyone who set it is
       cleared here. */
    try{localStorage.removeItem('v-globe');}catch(e){}
    var top=scope.querySelector('.globe-top'),
        cv=scope.querySelector('.globe-cv');
    if(!top||!cv)return null;

    var reduced=false;
    try{reduced=(window.MOTION_REDUCED!==undefined)?window.MOTION_REDUCED:matchMedia('(prefers-reduced-motion:reduce)').matches;}catch(e){}

    var wrap=cv.parentNode;
    var g=window.Globe.make(cv,{fill:0.46,lon:START,tilt:TILT});
    var lon=START,lastP=null,last=0,raf=null,live=false,dead=false,rt=null,io=null,mo=null;
    var lastDraw=0,DRAW_MS=30,inFrame=false;
    var IDLE_MS=90;      // 3.2 deg/s needs no more than eleven redraws a second

    /* Which box actually scrolls: the overlay pane when About is an overlay,
       the document when it is its own page. Found once. */
    var scr=null;
    (function(){
      var n=top.parentNode;
      while(n&&n.nodeType===1){
        try{
          var oy=getComputedStyle(n).overflowY;
          if(oy==='auto'||oy==='scroll'){scr=n;return;}
        }catch(e){}
        n=n.parentNode;
      }
    })();

    /* Measured, not read per frame. getBoundingClientRect in a rAF loop forces
       a synchronous layout of the whole pane every frame — with six chapters
       and their images in it, that is the entire frame budget, and it is what
       made the eased scroll stutter. */
    var hTop=0,hH=1;
    function measure(){
      hTop=top.offsetTop||0;
      hH=top.offsetHeight||1;
      g.setSize(wrap.clientWidth,wrap.clientHeight);
    }
    /* Prefer the eased scroller's own idea of where it is. Reading scrollTop
       from the DOM after this frame has written a custom property forces a
       synchronous layout, every frame, for the whole duration of a scroll —
       which is the one moment that matters. The number is already in memory. */
    function scrolled(){
      var soft=scr?scr.__soft:document.documentElement.__soft;
      if(soft&&soft.pos)return soft.pos();
      return scr?scr.scrollTop
                :(window.scrollY||document.documentElement.scrollTop||0);
    }
    function progress(){
      if(hH<=1)measure();                     // fonts may still have been loading
      return clamp((scrolled()-hTop)/hH,0,1);
    }

    /* The banked-rotation scheme that used to live here existed for one
       reason: the JS eased scroll and a live canvas could not share the main
       thread. Scrolling is the operating system's again, which runs below the
       main thread entirely, so the canvas is no longer competing with it and
       the scroll can turn the earth directly, as it should. */

    function gone(){
      return cv.isConnected===false||(cv.isConnected===undefined&&!document.body.contains(cv));
    }
    function teardown(){
      if(dead)return;dead=true;
      if(raf)cancelAnimationFrame(raf);raf=null;
      if(io)try{io.disconnect();}catch(e){}
      if(mo)try{mo.disconnect();}catch(e){}
      removeEventListener('resize',onResize);
      clearTimeout(rt);
    }

    function frame(ts){
      raf=null;inFrame=true;
      if(gone()){inFrame=false;return teardown();}
      var dt=last?(ts-last)/1000:0.016;last=ts;
      if(dt>0.06)dt=0.06;                     // a backgrounded tab should not lurch

      var p=progress();
      if(lastP===null)lastP=p;
      var dp=p-lastP;lastP=p;

      /* Two terms, added: a constant drift so it is alive when you are still,
         and the scroll — 200 degrees across the header, most of a hemisphere
         for one screen, enough that it clearly reads as you turning it. */
      lon-=DRIFT*dt+dp*SWEEP;
      if(lon<-180)lon+=360;else if(lon>180)lon-=360;

      /* 30fps while it is being turned, 11 while it is only drifting. Dot flips
         are quantised to whole degrees of the mask, so a slow drift changes the
         picture about eleven times a second however often it is redrawn. */
      var gap=Math.abs(dp)>0.0005?DRAW_MS:IDLE_MS;
      if(ts-lastDraw>=gap){lastDraw=ts;g.setLon(lon);}

      if(live)raf=requestAnimationFrame(frame);
      inFrame=false;
    }
    /* one chain only: a second one would double the drift rate */
    function kick(){if(!raf&&!inFrame&&live&&!dead)raf=requestAnimationFrame(frame);}

    /* it only computes while it is on screen */
    if(typeof IntersectionObserver!=='undefined'&&!reduced){
      io=new IntersectionObserver(function(es){
        live=es.some(function(e){return e.isIntersecting;});
        if(live){last=0;kick();}
      },{threshold:0});
      io.observe(top);
    }else if(!reduced){live=true;}

    function onResize(){
      clearTimeout(rt);
      rt=setTimeout(function(){
        if(gone())return teardown();
        g.w=g.h=0;                      // force the new box to be taken
        measure();
        g.drawn=null;g.draw();
      },160);
    }
    addEventListener('resize',onResize,{passive:true});

    /* the palette changes under it, so the dots have to be re-read */
    if(typeof MutationObserver!=='undefined'){
      mo=new MutationObserver(function(){
        if(gone())return teardown();
        g.readColours();g.base=null;g.drawn=null;g.draw();
      });
      mo.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
    }

    measure();
    g.draw();
    /* fonts and images settle after the first paint and move the header, so the
       cached height is taken again once things have stopped arriving */
    setTimeout(measure,400);
    if(typeof document.fonts!=='undefined'&&document.fonts.ready&&document.fonts.ready.then){
      document.fonts.ready.then(function(){if(!dead)measure();});
    }
    if(!reduced){live=true;kick();}
    return {redraw:function(){g.draw();},destroy:teardown};
  };
})();
