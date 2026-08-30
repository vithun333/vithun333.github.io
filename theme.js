/* ============================================================================
   THEME — light and dark.

   The palette is written as INLINE custom properties on <html>. Inline styles
   beat every stylesheet rule, so the switch cannot be defeated by the cascade,
   and this runs in <head> so there is no flash on load.

   Switching modes cross-dissolves. Two earlier attempts animated the colours
   themselves and both stuttered, for the same underlying reason: a blanket
   transition, and then registered @property interpolation, each force a style
   recalculation on every element on every frame. The properties are inherited,
   so a change at the root invalidates the whole tree, and on a page this size
   that will not hold sixty frames — which is the jitter, and no amount of
   tuning the curve was ever going to fix it.

   So the palette is swapped in a single recalculation, hidden under a veil in
   the outgoing paper colour. The only thing animating is opacity on one fixed
   element, which the compositor handles without touching layout or style at
   all. It is smooth by construction rather than by tuning, and it costs one
   div.

   One file for every page. This used to be copied into each document and the
   copies drifted, which is how the switch ended up looking different on About
   and Work from the way it looked on the home page.
   ========================================================================== */
window.THEME=(function(){
  var root=document.documentElement;
  var MODES=['light','dark'];
  var BASE_TINT='#FF6A00';
  var LIGHT={'--paper':'#EFECE4','--paper-2':'#E6E2D8','--paper-3':'#DCD7CB','--ink':'#12120F','--ink-2':'#1C1C18',
    '--muted':'#6F6C63','--rule':'rgba(18,18,15,.14)','--panel-bg':'#12120F','--panel-fg':'#EFECE4',
    '--panel-rule':'rgba(239,236,228,.16)','--panel-muted':'#8D8A80','--scrim':'rgba(239,236,228,.46)',
    '--accent':BASE_TINT,'--tint':BASE_TINT};
  var DARK={'--paper':'#111110','--paper-2':'#171714','--paper-3':'#232320','--ink':'#EDEAE2','--ink-2':'#D6D2C8',
    '--muted':'#8E8A80','--rule':'rgba(237,234,226,.15)','--panel-bg':'#080807','--panel-fg':'#EDEAE2',
    '--panel-rule':'rgba(237,234,226,.14)','--panel-muted':'#87847B','--scrim':'rgba(17,17,16,.56)',
    '--accent':BASE_TINT,'--tint':BASE_TINT};

  function write(t){var k;for(k in t){if(t.hasOwnProperty(k))root.style.setProperty(k,t[k]);}}

  var REDUCED=false;
  try{REDUCED=(window.MOTION_REDUCED!==undefined)?window.MOTION_REDUCED:matchMedia('(prefers-reduced-motion:reduce)').matches;}catch(e){}

  /* Long enough on both halves to read as one continuous dissolve, and a beat
     of full cover between them. That hold is the important part: the palette
     swap forces a style recalculation across the whole page, and the portrait's
     dot screen redraws itself off the class change, so beginning the reveal in
     the same frame meant the first few frames of the exit were competing with
     that work. Now it all happens while nothing is visible.               */
  var COVER=300, HOLD=90, REVEAL=560;
  var veil=null,veilT=null,pending=null;

  function makeVeil(){
    if(veil)return veil;
    veil=document.createElement('div');
    veil.id='themeVeil';
    veil.setAttribute('aria-hidden','true');
    /* under the custom cursor and under the page-transition curtain, over
       everything else. contain:paint, not strict: strict brings size
       containment with it, which would collapse a box that has no intrinsic
       size of its own. */
    veil.style.cssText='position:fixed;inset:0;z-index:9550;pointer-events:none;'+
      'opacity:0;will-change:opacity;contain:paint';
    (document.body||document.documentElement).appendChild(veil);
    /* A box inserted and then changed in the same tick has no previously
       computed style to transition from, so the first change lands instantly.
       Reading a layout property forces the style to resolve, which is what
       gave the first switch of a session no dissolve at all while every later
       one had it.                                                          */
    void veil.offsetHeight;
    return veil;
  }
  /* built as soon as there is a body, so the very first switch is warm */
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',makeVeil,{once:true});
  }else{makeVeil();}
  var booted=false;

  function commit(mode){
    write(mode==='dark'?DARK:LIGHT);
    root.classList.toggle('dark',mode==='dark');
    root.style.colorScheme=mode;
    try{localStorage.setItem('v-theme',mode);}catch(e){}
    if(document.body)document.body.classList.toggle('dark',mode==='dark');
    var label=(mode==='dark')?'Dark':'Light';
    var l=document.getElementById('themeLabel');if(l)l.textContent=label+' mode';
    var m=document.getElementById('themeMini');if(m)m.textContent=label;
    var b=document.querySelectorAll('[data-theme]'),i;
    for(i=0;i<b.length;i++){
      b[i].setAttribute('aria-pressed',mode==='dark'?'true':'false');
      b[i].setAttribute('title','Switch to '+(mode==='dark'?'light':'dark')+' mode, or press D');
    }
    pending=null;
    return mode;
  }

  function apply(mode){
    if(MODES.indexOf(mode)<0)mode='light';
    if(!booted||REDUCED||mode===current()||!document.body)return commit(mode);

    pending=mode;                      // current() answers with this until it lands
    var v=makeVeil();
    clearTimeout(veilT);
    /* the veil takes the colour the page is leaving, so the cover reads as the
       page fading out rather than a slab dropping over it */
    v.style.background=(root.classList.contains('dark')?DARK:LIGHT)['--paper'];
    v.style.transition='opacity '+COVER+'ms cubic-bezier(.4,0,.2,1)';
    v.style.opacity='1';
    veilT=setTimeout(function(){
      commit(mode);                    // one recalculation, entirely hidden
      /* two frames plus the hold, so the recalculation and the repaint it
         triggers are finished before the exit starts moving. Falls back to a
         timer where there is no rAF: nothing here is worth leaving the page
         under an opaque sheet for. */
      function reveal(){
        veilT=setTimeout(function(){
          v.style.transition='opacity '+REVEAL+'ms cubic-bezier(.4,0,.2,1)';
          v.style.opacity='0';
        },HOLD);
      }
      if(typeof requestAnimationFrame==='function'){
        requestAnimationFrame(function(){requestAnimationFrame(reveal);});
      }else{setTimeout(reveal,32);}
    },COVER);
    return mode;
  }

  function current(){return pending||(root.classList.contains('dark')?'dark':'light');}
  function next(){return current()==='dark'?'light':'dark';}

  var saved=null;try{saved=localStorage.getItem('v-theme');}catch(e){}
  if(MODES.indexOf(saved)<0){
    try{saved=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';}catch(e){saved='light';}
  }
  apply(saved);
  booted=true;

  return {apply:apply,current:current,next:next,modes:MODES,base:BASE_TINT};
})();

function toggleTheme(){window.THEME.apply(window.THEME.next());return false;}

document.addEventListener('DOMContentLoaded',function(){window.THEME.apply(window.THEME.current());});
document.addEventListener('keydown',function(e){                    // press D anywhere to switch
  var tag=(e.target&&e.target.tagName)||'';
  if((e.key==='d'||e.key==='D')&&!/INPUT|TEXTAREA|SELECT/.test(tag)&&!e.metaKey&&!e.ctrlKey)toggleTheme();
});
