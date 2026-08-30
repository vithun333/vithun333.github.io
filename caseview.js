/* ============================================================================
   In-page case study.

   A case study used to be a separate document, which meant every visit went
   through a blank screen while one page tore down and the next painted. This
   opens it as an overlay that clips into view exactly like the playground,
   with its content already inside, so there is never an empty frame.

   The URL still becomes case.html?p=N via pushState, so links can be copied,
   the back button works, and loading that URL directly still serves the real
   page. Needs case.css and cases.js.
   ========================================================================== */
(function(){
  if(!window.CASES||!window.caseHTML)return;

  var host=document.body;
  var cv=document.createElement('div');
  cv.id='cv';cv.className='cv';cv.setAttribute('aria-hidden','true');
  cv.setAttribute('role','dialog');cv.setAttribute('aria-label','Case study');
  host.appendChild(cv);

  var open=false,cur=-1,restore=null,lastFocus=null;

  function lock(on){
    if(on){
      var sbw=Math.max(0,Math.min(24,innerWidth-document.documentElement.clientWidth))||0;
      document.documentElement.style.setProperty('--sbw',sbw+'px');
      document.body.classList.add('lock');
    }else{
      document.body.classList.remove('lock');
    }
  }

  function paint(i){
    cur=i;
    var c=window.CASES[i];
    cv.style.setProperty('--tint',c.color);
    cv.innerHTML=window.caseHTML(i,{});
    cv.scrollTop=0;
    if(window.softScroll&&!cv.__soft)window.softScroll(cv);
    if(cv.__soft)cv.__soft.sync();
    document.title=c.name+' — Vithun';
    window.caseReveal(cv,cv);
    magnet(cv.querySelector('.backbtn'));
  }

  /* magnetic Back, same feel as the chat button */
  function magnet(b){
    var fine=false;
    try{fine=matchMedia('(pointer:fine)').matches&&
             !matchMedia('(prefers-reduced-motion:reduce)').matches;}catch(e){}
    if(!fine||!b)return;
    var tX=0,tY=0,rX=0,rY=0,raf=null;
    var cl=function(v,a,z){return v<a?a:v>z?z:v;};
    function tick(){
      rX+=(tX-rX)*.18;rY+=(tY-rY)*.18;
      b.style.setProperty('--mx',rX.toFixed(2)+'px');
      b.style.setProperty('--my',rY.toFixed(2)+'px');
      raf=(Math.abs(tX-rX)>.15||Math.abs(tY-rY)>.15)?requestAnimationFrame(tick):null;
    }
    var start=function(){if(!raf)raf=requestAnimationFrame(tick);};
    b.addEventListener('mousemove',function(e){
      var r=b.getBoundingClientRect();
      tX=cl((e.clientX-(r.left+r.width/2-rX))*.4,-18,18);
      tY=cl((e.clientY-(r.top+r.height/2-rY))*.4,-12,12);
      start();
    });
    b.addEventListener('mouseleave',function(){tX=0;tY=0;start();});
  }

  /* from: 'pg' when opened out of the playground, so Back returns there */
  function show(i,from,push){
    i=Math.max(0,Math.min(window.CASES.length-1,i|0));
    if(!open){
      lastFocus=document.activeElement;
      restore={title:document.title,url:location.pathname+location.search+location.hash,from:from||null};
      lock(true);
    }
    paint(i);
    if(!open){
      open=true;
      cv.setAttribute('aria-hidden','false');
      /* two frames: the content is laid out before the curtain starts, which is
         what keeps the first frames of the wipe smooth */
      requestAnimationFrame(function(){requestAnimationFrame(function(){cv.classList.add('on');});});
    }
    if(push!==false){
      var url='case.html?p='+i+(restore&&restore.from==='pg'?'&from=pg':'');
      try{history.pushState({cv:i,from:restore&&restore.from},'',url);}catch(e){}
    }
    var b=cv.querySelector('.backbtn');
    if(b)setTimeout(function(){try{b.focus();}catch(e){}},420);
  }

  function hide(pop){
    if(!open)return;
    open=false;
    cv.classList.remove('on');
    cv.setAttribute('aria-hidden','true');
    lock(false);
    if(restore){
      document.title=restore.title;
      if(pop!==true){try{history.pushState(null,'',restore.url);}catch(e){}}
    }
    var wasFrom=restore&&restore.from;
    restore=null;
    /* clear the markup only after the wipe has finished, or the panel empties
       while you are still watching it close */
    setTimeout(function(){if(!open)cv.innerHTML='';},780);
    if(lastFocus&&lastFocus.focus){try{lastFocus.focus();}catch(e){}}
    lastFocus=null;
    if(wasFrom==='pg'&&window.__openPlayground)window.__openPlayground();
  }

  /* Moving to the next project wipes the same way opening does, rather than the
     content simply being replaced underneath you: the panel clips shut, swaps,
     and clips back open, so every move through the work reads the same.    */
  var swapping=false;
  function swap(i){
    if(swapping||!open)return;
    swapping=true;
    cv.classList.remove('on');
    setTimeout(function(){
      paint(i);
      var url='case.html?p='+i+(restore&&restore.from==='pg'?'&from=pg':'');
      try{history.pushState({cv:i,from:restore&&restore.from},'',url);}catch(e){}
      requestAnimationFrame(function(){requestAnimationFrame(function(){
        cv.classList.add('on');swapping=false;
        var b=cv.querySelector('.backbtn');
        if(b)setTimeout(function(){try{b.focus();}catch(e){}},420);
      });});
    },460);                                      // most of the way through the wipe out
  }

  cv.addEventListener('click',function(e){
    var t=e.target;
    var back=t.closest&&t.closest('[data-caseback]');
    if(back){e.preventDefault();hide();return;}
    var nx=e.target.closest&&e.target.closest('[data-casenext]');
    if(nx){e.preventDefault();swap(+nx.getAttribute('data-casenext'));return;}
  });

  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&open){e.preventDefault();hide();}
  });

  /* The site header stays visible above a case study, so its own links have to
     dismiss this first. The playground is the exception: it layers over the top
     and closing it should bring you back here, not to the home page.       */
  document.addEventListener('click',function(e){
    if(!open)return;
    var t=e.target;if(!t.closest)return;
    if(cv.contains(t))return;
    if(t.closest('[data-pg]'))return;                 // playground covers us instead
    if(t.closest('[data-nav],[data-home],#burger,#menu a'))hide();
  },true);

  addEventListener('popstate',function(e){
    var st=e.state;
    if(st&&typeof st.cv==='number'){open?paint(st.cv):show(st.cv,st.from,false);}
    else if(open)hide(true);
  });

  /* the only entry point the rest of the site needs */
  window.openCase=function(i,from){show(i,from,true);};
  window.caseViewOpen=function(){return open;};
})();
