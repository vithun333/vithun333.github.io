/* ============================================================================
   ONE ANSWER TO "IS MOTION ALLOWED HERE".

   Every moving part of this site asked the operating system the same question
   independently — the eased scroll on the home page, the eased scroll in the
   overlays, the globe, the theme dissolve. That is four places to be switched
   off at once by a single system setting, and no way to tell from the page
   that it had happened. Which is exactly what it looked like: scrolling that
   would not smooth however it was tuned, and an earth that would not turn.

   `prefers-reduced-motion: reduce` is a real accessibility request and the
   default here still honours it. But it is a system-wide switch, often turned
   on for battery or by an OS "reduce animations" default, and the person who
   set it has no way to say "not on this site". So there is an override:

       ?motion=full     force the full experience, and remember it
       ?motion=reduced  force the calm one, and remember it
       ?motion=auto     forget, and follow the system again

   The choice is kept in localStorage, so it survives the query string being
   dropped. Visitors who have never asked for anything still get whatever their
   system says.

   Everything else reads window.MOTION_REDUCED rather than asking matchMedia.
   Loads first, before anything that might want to move.
   ========================================================================== */
(function(){
  var reduced=false;
  try{reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;}catch(e){}

  var pref=null;
  try{
    var q=(location.search.match(/[?&]motion=(full|reduced|auto)/)||[])[1];
    if(q==='auto')localStorage.removeItem('v-motion');
    else if(q)localStorage.setItem('v-motion',q);
    pref=localStorage.getItem('v-motion');
  }catch(e){}

  if(pref==='full')reduced=false;
  else if(pref==='reduced')reduced=true;

  window.MOTION_REDUCED=reduced;
  window.MOTION_OK=!reduced;
  /* so CSS can see it too, and so it is visible in the inspector */
  try{
    document.documentElement.classList.toggle('reduced-motion',reduced);
    /* The counterpart the stylesheets need. CSS cannot see localStorage, so a
       @media (prefers-reduced-motion:reduce) block goes on obeying the system
       setting even when the visitor has asked this site for full motion — the
       override was JS-only, and every CSS rule that kills a transition ignored
       it. Those blocks are now qualified with html:not(.motion-full). */
    document.documentElement.classList.toggle('motion-full',!reduced);
    document.documentElement.setAttribute('data-motion',reduced?'reduced':'full');
  }catch(e){}

  /* ---------------------------------------------------------------- scroll

     JS "smooth scrolling" replaces the operating system's own scrolling with a
     rAF loop that writes scrollTop. On a Mac trackpad the two feel similar. On
     Windows they do not: the OS already scrolls smoothly, with its own
     momentum, driven below the browser's main thread — and a JS loop cannot
     match it, because every frame it produces has to queue behind whatever
     else the page is doing.

     This site had it on everywhere. It also had prefers-reduced-motion
     switching it off — so on a machine with that setting the scrolling was
     NATIVE, and that is the scrolling that was described as smooth. Turning
     motion on to fix the globe handed over to the JS loop for the first time,
     and that is when the scrolling stopped feeling right.

     So the operating system gets it back by default. ?scroll=eased opts into
     the JS glide for anyone who prefers it. */
  var eased=false;
  try{
    var q2=(location.search.match(/[?&]scroll=(eased|native)/)||[])[1];
    if(q2)localStorage.setItem('v-scroll',q2);
    eased=localStorage.getItem('v-scroll')==='eased';
  }catch(e){}
  window.EASED_SCROLL=eased;

  /* a one-liner for checking which way it went */
  window.scrollMode=function(mode){
    if(!mode)return eased?'eased':'native';
    try{localStorage.setItem('v-scroll',mode);}catch(e){}
    location.reload();
  };
  window.motion=function(mode){
    if(!mode)return reduced?'reduced':'full';
    try{
      if(mode==='auto')localStorage.removeItem('v-motion');
      else localStorage.setItem('v-motion',mode);
    }catch(e){}
    location.reload();
  };
})();
