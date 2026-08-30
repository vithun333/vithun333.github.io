/* ============================================================================
   Smooth scrolling.

   The home page already eased the document itself. Everything else — the
   About and Work overlays, the case study panel, and the standalone documents
   — scrolled natively, so moving between them felt like two different sites.
   This is the same easing, packaged so any scroller can take it.

   It drives the real scroll position rather than transforming a wrapper, which
   is what keeps sticky sections, fixed elements, anchors and the browser's own
   find-on-page all working normally.

   Touch is left alone: a phone's momentum is better than anything done here,
   and fighting it produces the rubbery feel that gives smooth scroll a bad
   name. It is left alone for free, though — this only ever handles wheel
   events, which a finger does not generate. Reduced-motion is left alone for
   the obvious reason.
   ========================================================================== */
(function(){
  /* Gate on whether there is a WHEEL, not on whether there is a finger.

     This used to be `pointer:coarse`, which asks what the PRIMARY input is —
     and on a touchscreen laptop the answer can be "touch" even though the
     trackpad is what you are actually scrolling with. On that machine the
     eased scroll silently switched itself off everywhere, on every page, and
     no amount of tuning it would have made any difference.

     `any-pointer:fine` asks the question that matters: is there a mouse or a
     trackpad attached at all. Turning this on for a touch device costs
     nothing, because finger scrolling does not produce wheel events — the
     handler simply never fires, and the phone keeps its native momentum. */
  var WHEELY=true,REDUCED=false;
  try{
    WHEELY=matchMedia('(any-pointer:fine)').matches;
    REDUCED=(window.MOTION_REDUCED!==undefined)?window.MOTION_REDUCED:matchMedia('(prefers-reduced-motion:reduce)').matches;
  }catch(e){}

  function lerp(a,b,t){return a+(b-a)*t;}

  /* el: a scrollable element, or document / window for the page itself */
  window.softScroll=function(el,opts){
    /* the operating system's own scrolling is the default; see motion.js */
    if(!window.EASED_SCROLL||!WHEELY||REDUCED||!el)return function(){};
    opts=opts||{};
    var ease=opts.ease||0.12;
    var isDoc=(el===document||el===window||el===document.documentElement||el===document.body);
    var node=isDoc?document.documentElement:el;
    if(node.__soft)return node.__soft;                 // never twice

    var target=isDoc?(window.scrollY||0):node.scrollTop;
    var cur=target,running=false,killed=false;

    function maxY(){
      return isDoc
        ? Math.max(0,document.documentElement.scrollHeight-innerHeight)
        : Math.max(0,node.scrollHeight-node.clientHeight);
    }
    function put(y){ if(isDoc)scrollTo(0,y); else node.scrollTop=y; }
    function got(){ return isDoc?(window.scrollY||0):node.scrollTop; }

    function loop(){
      if(killed){running=false;return;}
      cur=lerp(cur,target,ease);
      if(Math.abs(target-cur)<0.4){cur=target;running=false;put(cur);return;}
      put(cur);requestAnimationFrame(loop);
    }
    function kick(){if(!running){running=true;requestAnimationFrame(loop);}}

    /* A nested scroller inside this one keeps its own behaviour — but finding
       out used to mean walking the ancestor chain calling getComputedStyle and
       reading scrollHeight on EVERY wheel event. Both force a synchronous
       layout, and a trackpad fires these a hundred times a second, so the
       browser was laying out the whole pane a hundred times a second while
       trying to animate a scroll through it. That was the stutter: the home
       page's scroll does none of this, which is why the two felt different.

       The answer per element does not change, so it is worked out once and
       remembered. The cache is dropped on resize, when it could go stale. */
    var nested=(typeof WeakMap!=='undefined')?new WeakMap():null;
    function inNested(t){
      if(nested&&nested.has(t))return nested.get(t);
      var r=false,n=t;
      while(n&&n!==node){
        if(n.nodeType===1){
          var oy=getComputedStyle(n).overflowY;
          if((oy==='auto'||oy==='scroll')&&n.scrollHeight>n.clientHeight+2){r=true;break;}
        }
        n=n.parentNode;
      }
      if(nested&&t&&t.nodeType===1)nested.set(t,r);
      return r;
    }

    function onWheel(e){
      if(killed)return;
      if(e.ctrlKey)return;                             // pinch zoom is not scrolling
      if(inNested(e.target))return;
      var m=maxY();
      if(m<=0)return;
      /* Always claim the event once this scroller has anywhere to go. Letting it
         through at the ends was the glitch: the wheel chained out to the page
         behind the overlay, which has its own eased scroll, so hitting the top
         or the bottom of About or Work twitched whatever was underneath. */
      e.preventDefault();
      var d=e.deltaY;
      if(e.deltaMode===1)d*=16;                        // lines
      else if(e.deltaMode===2)d*=node.clientHeight||innerHeight;

      /* Parity with the home page, which has always had both: one flick cannot
         launch the page across the site, and the target is never allowed to run
         more than a screen or so ahead of the glide. A normal trackpad flick
         never reaches either limit — these are for a mouse wheel's large
         discrete deltas and for someone spinning it hard. */
      if(d>180)d=180;else if(d<-180)d=-180;
      var t=target+d;
      if(t>cur+900)t=cur+900;else if(t<cur-900)t=cur-900;
      target=Math.max(0,Math.min(m,t));
      kick();
    }

    /* Adopt scrolls that came from somewhere else — a keyboard, an anchor, the
       browser revealing a focused element. While the glide is running it owns
       the position, so anything arriving then is its own write and is ignored.

       This used to try to identify its own writes with a flag set before each
       one. Scroll events are coalesced, so several writes could produce one
       event: the flag was left set, and the next real scroll from the user was
       swallowed as though it had been ours. */
    function adopt(){ if(!running)target=cur=got(); }

    var wheelHost=isDoc?window:node;
    wheelHost.addEventListener('wheel',onWheel,{passive:false});
    (isDoc?window:node).addEventListener('scroll',adopt,{passive:true});
    node.addEventListener('keydown',adopt);
    /* dragging the scrollbar, or a resize, moves the page without a wheel event;
       resync so the glide does not yank it back to a stale target */
    node.addEventListener('pointerdown',function(){if(!running)target=cur=got();});
    addEventListener('resize',function(){
      if(typeof WeakMap!=='undefined')nested=new WeakMap();
      if(!running)target=cur=got();
    },{passive:true});

    var api={
      to:function(y,instant){
        target=Math.max(0,Math.min(maxY(),y));
        if(instant){cur=target;put(cur);}else kick();
      },
      sync:function(){target=cur=got();},
      /* The position this loop already knows, so anything else that wants it
         per frame does not have to read scrollTop from the DOM. A read after a
         style write forces a synchronous layout, and during a scroll there is
         a style write every frame — so asking the DOM was costing a layout per
         frame for a number that was sitting in a variable. */
      pos:function(){return cur;},
      destroy:function(){
        killed=true;
        wheelHost.removeEventListener('wheel',onWheel);
        (isDoc?window:node).removeEventListener('scroll',adopt);
        node.removeEventListener('keydown',adopt);
        node.__soft=null;
      }
    };
    node.__soft=api;
    return api;
  };
})();
