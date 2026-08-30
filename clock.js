/* ============================================================================
   THE VANCOUVER CLOCK, FOR EVERY PAGE.

   This used to live inline in index.html only. About and Work are normally
   overlays on the home page, so the header — and its clock — belonged to the
   page underneath and everything looked right. But the overlay pushes
   about.html / work.html into the address bar, so REFRESHING while one is open
   loads the standalone document, and those two never had a clock at all. The
   time appeared to vanish on refresh, which is exactly what it did.

   One file, loaded everywhere, so the header is the same header wherever you
   land and there is no copy to drift.

   It is written to be unfailable rather than merely correct, because the
   failure mode is silent — the markup ships a placeholder, so anything that
   stops the update leaves the header looking like the clock was removed:
     - the timezone lookup throwing on a browser without full ICU data;
     - a back/forward-cache restore, where interval timers are frozen;
     - a background tab having its timers throttled.
   ========================================================================== */
(function(){
  function stamp(){
    var now=new Date();
    try{
      return 'YVR '+now.toLocaleTimeString('en-US',
        {timeZone:'America/Vancouver',hour:'2-digit',minute:'2-digit',hour12:false});
    }catch(e){
      /* no timezone database: the local hour is wrong for Vancouver, so it is
         labelled honestly rather than quietly lying about where it is */
      try{
        return 'LOCAL '+now.toLocaleTimeString('en-US',
          {hour:'2-digit',minute:'2-digit',hour12:false});
      }catch(e2){
        var h=('0'+now.getHours()).slice(-2),m=('0'+now.getMinutes()).slice(-2);
        return 'LOCAL '+h+':'+m;
      }
    }
  }
  function tick(){
    var el=document.getElementById('clock');
    if(!el)return;
    var t=stamp();
    if(t&&el.textContent!==t)el.textContent=t;
  }
  tick();
  setInterval(tick,15000);
  /* every moment the page might be freshly in front of someone */
  addEventListener('pageshow',tick);
  addEventListener('focus',tick);
  addEventListener('visibilitychange',tick);
  addEventListener('load',tick);
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',tick,{once:true});
  }
  window.__clockTick=tick;
})();
