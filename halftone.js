/* ============================================================================
   The portrait, redrawn as a halftone screen.

   This replaced an ASCII renderer. ASCII was the wrong instrument for this
   photograph: the tonal range is narrow and the face is small in frame, so the
   character ramp spent most of its steps on a dark suit and the likeness never
   really arrived. A halftone has a continuous size variable rather than a
   dozen discrete glyphs, so it holds a face at this scale where type could not.

   It also belongs here. The site already speaks in dots: the ticker and the
   playground are set in Doto, and the rules under the hero and between the
   columns are dashed. The portrait resolving into a dot screen is the same
   idea at a different size.

   The screen is rotated 15 degrees, which is what stops the dots reading as a
   grid of pixels. At this pitch there are around twenty thousand of them, which
   is too many to lay down every frame, so the finished screen is baked once
   into an offscreen canvas. After that a frame is one drawImage plus a repaint
   of the few hundred dots under the pointer. Only the opening wave, which lasts
   just over a second, redraws the whole thing.
   ========================================================================== */
(function(){
  var wrap=document.getElementById('figDotWrap'),
      cv=document.getElementById('figDotCv'),
      figwrap=document.getElementById('figwrap'),
      svg=document.getElementById('figSvg');
  if(!wrap||!cv||!svg||!cv.getContext)return;

  var CELL=3.6;                       // dot pitch in CSS pixels
  var ANGLE=15*Math.PI/180;           // the classic screen angle
  var MAPW=460;                       // luminance map width

  var ctx=cv.getContext('2d');
  var img=new Image();
  var CW=cv.width,CH=cv.height,boxW=400,boxH=500,dpr=1;
  var cell=CELL,cosA=Math.cos(ANGLE),sinA=Math.sin(ANGLE);
  var map=null,mapW=0,mapH=0;
  var ready=false,t0=0,raf=null,visible=true,px=-1,py=-1,pOn=0,ink='#EFECE4';
  var off=null,octx=null,baked=false;

  /* The screen sits on a dark ground in both themes — the rect behind it is
     --panel-bg — so the dots take --panel-fg rather than the page ink. That
     keeps the inverted, light-on-dark reading in light mode as well, which is
     the version worth having.                                              */
  function readInk(){
    try{
      var v=getComputedStyle(document.documentElement).getPropertyValue('--panel-fg').trim();
      if(v)ink=v;
    }catch(e){}
  }

  /* The trail code rewrites the svg viewBox to the element's pixel size and
     resizes the image layers with it, so this layer has to follow. */
  function fit(W,H){
    if(!W||!H)return false;
    boxW=W;boxH=H;
    dpr=Math.min(2,(window.devicePixelRatio||1));
    cv.style.width=W+'px';cv.style.height=H+'px';
    CW=Math.round(W*dpr);CH=Math.round(H*dpr);
    if(cv.width!==CW)cv.width=CW;
    if(cv.height!==CH)cv.height=CH;
    cell=CELL*dpr;
    return true;
  }
  window.__portraitFit=function(W,H){       // the hook the trail code calls on resize
    if(!fit(W,H))return;
    baked=false;
    if(ready&&sample())kick();
  };
  function layout(){
    var r=svg.getBoundingClientRect();
    return fit(Math.round(r.width)||400,Math.round(r.height)||500);
  }

  /* One luminance map, sampled per dot. The photograph underneath is an <image>
     with preserveAspectRatio="xMidYMin slice", so this reproduces that crop
     exactly: centred across, anchored to the top.                          */
  function sample(){
    var iw=img.naturalWidth||img.width, ih=img.naturalHeight||img.height;
    if(!iw||!ih)return false;
    var k=Math.max(boxW/iw,boxH/ih);
    var sw=boxW/k, sh=boxH/k, sx=(iw-sw)/2, sy=0;
    mapW=MAPW;mapH=Math.max(8,Math.round(MAPW*boxH/boxW));
    var c=document.createElement('canvas');c.width=mapW;c.height=mapH;
    var x=c.getContext('2d',{willReadFrequently:true});
    x.drawImage(img,sx,sy,sw,sh,0,0,mapW,mapH);
    var d;
    try{d=x.getImageData(0,0,mapW,mapH).data;}catch(e){return false;}  // tainted
    map=new Float32Array(mapW*mapH);
    for(var n=0,m=map.length;n<m;n++){
      var j=n*4;
      map[n]=(d[j]*0.299+d[j+1]*0.587+d[j+2]*0.114)/255;
    }
    return true;
  }
  function lumAt(x,y){                  // x,y in backing-store pixels
    var u=(x/CW*mapW)|0, v=(y/CH*mapH)|0;
    if(u<0)u=0;else if(u>=mapW)u=mapW-1;
    if(v<0)v=0;else if(v>=mapH)v=mapH-1;
    return map[v*mapW+u];
  }

  /* Lay down the screen. bounds, when given, restricts the walk to a box, which
     is what makes the pointer repaint cheap.                               */
  function paint(c,intro,swell,bounds){
    var cosR=cosA,sinR=sinA;
    var maxR=cell*0.56;
    var diag=Math.sqrt(CW*CW+CH*CH)/2+cell*2;
    var cx=CW/2, cy=CH/2, u, v, x, y, dark, rad, rowT;
    var bx0=bounds?bounds[0]:-cell, by0=bounds?bounds[1]:-cell,
        bx1=bounds?bounds[2]:CW+cell, by1=bounds?bounds[3]:CH+cell;
    c.beginPath();
    for(v=-diag;v<=diag;v+=cell){
      for(u=-diag;u<=diag;u+=cell){
        x=cx+u*cosR-v*sinR; y=cy+u*sinR+v*cosR;
        if(x<bx0||y<by0||x>bx1||y>by1)continue;
        /* the wave develops the screen from the top down, once */
        rowT=y/CH;
        if(intro<1&&rowT>intro*1.25)continue;
        dark=1-lumAt(x,y);
        rad=maxR*Math.sqrt(dark<0?0:dark);
        if(intro<1)rad*=Math.min(1,(intro*1.25-rowT)*7);
        if(swell){
          var dx=x-swell[0],dy=y-swell[1],d2=dx*dx+dy*dy;
          if(d2<swell[2])rad*=1+(1-Math.sqrt(d2)/swell[3])*0.9*swell[4];
        }
        if(rad<0.22)continue;
        c.moveTo(x+rad,y);
        c.arc(x,y,rad,0,6.283185307179586);
      }
    }
    c.fill();
  }

  function bake(){
    if(!off){off=document.createElement('canvas');octx=off.getContext('2d');}
    if(off.width!==CW)off.width=CW;
    if(off.height!==CH)off.height=CH;
    octx.clearRect(0,0,CW,CH);
    octx.fillStyle=ink;
    paint(octx,1,null,null);
    baked=true;
  }

  function frame(now){
    raf=null;
    if(!ready||!visible)return;
    if(!t0)t0=now;
    var t=(now-t0)/1000, intro=Math.min(1,t/1.15);

    ctx.fillStyle=ink;

    if(intro<1){
      /* THE WAVE IS A WIPE, NOT A REDRAW.

         This used to call paint() every frame with a moving wavefront, which
         walks the whole dot grid — around thirty-three thousand arcs a frame,
         sixty frames a second, for the full 1.15s. And it was started by an
         IntersectionObserver, so it fired at exactly the moment someone was
         scrolling down into it: the heaviest thing on the page, running during
         the one action it could ruin.

         The finished screen is the same picture every frame. So bake it once
         and reveal it top-down with a bitmap copy and a soft-edged erase —
         two draw calls instead of thirty-three thousand arcs. */
      if(!baked)bake();
      ctx.clearRect(0,0,CW,CH);
      var hRev=Math.min(CH,intro*1.25*CH);
      if(hRev>0){
        ctx.drawImage(off,0,0,CW,hRev,0,0,CW,hRev);
        /* the wavefront: dots used to grow in over a few rows, so the edge is
           softened rather than cut straight across */
        var band=Math.min(cell*16,hRev);
        var g=ctx.createLinearGradient(0,hRev-band,0,hRev);
        g.addColorStop(0,'rgba(0,0,0,0)');
        g.addColorStop(1,'rgba(0,0,0,1)');
        ctx.globalCompositeOperation='destination-out';
        ctx.fillStyle=g;
        ctx.fillRect(0,hRev-band,CW,band);
        ctx.globalCompositeOperation='source-over';
        ctx.fillStyle=ink;
      }
      raf=requestAnimationFrame(frame);
      return;
    }
    if(!baked)bake();

    ctx.clearRect(0,0,CW,CH);
    ctx.drawImage(off,0,0);

    if(pOn>0){
      var r=svg.getBoundingClientRect();
      if(r.width){
        var pcx=(px-r.left)/r.width*CW, pcy=(py-r.top)/r.height*CH;
        var PR=cell*16;
        var b=[pcx-PR,pcy-PR,pcx+PR,pcy+PR];
        ctx.clearRect(b[0],b[1],PR*2,PR*2);
        paint(ctx,1,[pcx,pcy,PR*PR,PR,pOn],b);
      }
      pOn=Math.max(0,pOn-0.018);
      raf=requestAnimationFrame(frame);
      return;
    }
    /* nothing moving: stop asking for frames until something happens */
  }

  function kick(){if(!raf&&ready&&visible)raf=requestAnimationFrame(frame);}

  img.onload=function(){
    readInk();
    if(!layout()||!sample())return;
    baked=false;
    ready=true;
    wrap.classList.add('ready');
    kick();
  };
  img.crossOrigin='anonymous';
  img.src=window.PORTRAIT_SRC||'pfp.png';

  if(typeof IntersectionObserver!=='undefined'&&figwrap){
    /* Wait for the scrolling to stop before the wave begins. It is a one-off
       flourish that lasts just over a second; playing it while the page is
       still moving spends the frames nobody can spare and shows it to someone
       who is not looking yet. A beat after they arrive, they are. */
    var startT=null;
    function begin(){
      clearTimeout(startT);
      startT=setTimeout(function(){if(visible)kick();},140);
    }
    addEventListener('scroll',begin,{passive:true});
    new IntersectionObserver(function(es){
      visible=es[0].isIntersecting;
      if(visible)begin();
    },{threshold:0}).observe(figwrap);
  }
  if(figwrap){
    figwrap.addEventListener('pointermove',function(e){
      px=e.clientX;py=e.clientY;pOn=1;kick();
    },{passive:true});
    figwrap.addEventListener('pointerleave',function(){pOn=Math.min(pOn,0.4);});
  }
  var rt=null;
  addEventListener('resize',function(){
    clearTimeout(rt);
    rt=setTimeout(function(){baked=false;if(ready&&layout()&&sample())kick();},180);
  },{passive:true});
  if(typeof MutationObserver!=='undefined'){
    new MutationObserver(function(){readInk();baked=false;kick();})
      .observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  }
})();
