/* ============================================================================
   About and Work as in-page overlays.

   They used to be separate documents, which meant every visit went through a
   blank frame while one page tore down and the next painted. This clips them
   into view over whatever you were looking at, exactly like the playground,
   with the content already inside.

   Two panes rather than one. Opening wipes a pane up over the page; going from
   About to Work paints the other pane and wipes that up over the first. So the
   move between them is the same slide as opening, not a cross-fade, and what
   is underneath is never uncovered at any point in either transition.

   The site header stays above the panes, so the menu and the theme switch are
   the real ones rather than copies that drift. The playground sits above
   everything and simply opens on top, so it no longer has to close this first.

   The URL still becomes about.html or work.html via pushState, so links can be
   copied and the back button works, and loading those URLs directly still
   serves the standalone documents. Needs pages.css and pages.js.
   ========================================================================== */
(function(){
  if(!window.ABOUT_HTML||!window.WORK_HTML)return;

  var WIPE=720;                       // must match .pvpane's clip-path duration
  var TITLES={about:'About — Vithun',work:'Work — Vithun'};

  var panes=[mkPane(),mkPane()],cur=0;
  var open=false,which=null,restore=null,lastFocus=null,swapping=false;

  function mkPane(){
    var p=document.createElement('div');
    p.className='pv pvpane';
    p.setAttribute('aria-hidden','true');
    p.setAttribute('role','dialog');
    document.body.appendChild(p);
    wire(p);
    if(window.softScroll)window.softScroll(p);        // same glide as the page
    return p;
  }
  function front(){return panes[cur];}
  function back(){return panes[1-cur];}

  function lock(on){
    if(on){
      var sbw=Math.max(0,Math.min(24,innerWidth-document.documentElement.clientWidth))||0;
      document.documentElement.style.setProperty('--sbw',sbw+'px');
      document.body.classList.add('lock');
    }else if(!(window.caseViewOpen&&window.caseViewOpen())){
      /* a case study may be layered on top and still needs the page held */
      document.body.classList.remove('lock');
    }
  }

  function reveal(pane){
    var els=[].slice.call(pane.querySelectorAll('.rv'));
    if(typeof IntersectionObserver==='undefined'){
      els.forEach(function(e){e.classList.add('in');});return;
    }
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('in');return;}
        if(e.boundingClientRect.top>0)e.target.classList.remove('in');
      });
    },{root:pane,threshold:.1,rootMargin:'0px 0px -5% 0px'});
    els.forEach(function(e){io.observe(e);});
    requestAnimationFrame(function(){
      els.forEach(function(e){
        if(e.getBoundingClientRect().top<innerHeight*.94)e.classList.add('in');
      });
    });
  }

  function paint(pane,name){
    pane.innerHTML=(name==='work')?window.WORK_HTML():window.ABOUT_HTML;
    if(window.pvSplitAll)window.pvSplitAll(pane);     // headings and place names
    if(name==='about'&&window.mountGlobeScene)window.mountGlobeScene(pane);
    pane.scrollTop=0;
    if(pane.__soft)pane.__soft.sync();                // new content, new top
    pane.setAttribute('aria-label',name==='work'?'Work':'About');
    document.title=TITLES[name]||document.title;
    reveal(pane);
  }

  /* park a pane back at the bottom without animating it there */
  function park(pane){
    pane.classList.add('snap');
    pane.classList.remove('on');
    pane.setAttribute('aria-hidden','true');
    pane.innerHTML='';
    /* force a style flush before the transition is allowed back */
    void pane.offsetHeight;
    requestAnimationFrame(function(){pane.classList.remove('snap');});
  }

  function show(name,push){
    if(open){swap(name);return;}
    lastFocus=document.activeElement;
    restore={title:document.title,url:location.pathname+location.search+location.hash};
    lock(true);
    var p=front();
    p.style.zIndex=368;
    paint(p,name);
    open=true;which=name;
    p.setAttribute('aria-hidden','false');
    /* two frames so the content is laid out before the curtain starts */
    requestAnimationFrame(function(){requestAnimationFrame(function(){p.classList.add('on');});});
    if(push!==false){try{history.pushState({pv:name},'',name+'.html');}catch(e){}}
  }

  function swap(name){
    if(!open){show(name,true);return;}
    if(swapping||name===which)return;
    swapping=true;
    var out=front(),inp=back();
    inp.style.zIndex=369;out.style.zIndex=368;
    paint(inp,name);
    inp.setAttribute('aria-hidden','false');
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      inp.classList.add('on');
    });});
    try{history.pushState({pv:name},'',name+'.html');}catch(e){}
    which=name;
    setTimeout(function(){
      if(!open)return;
      park(out);
      inp.style.zIndex=368;
      cur=1-cur;
      swapping=false;
    },WIPE+40);
  }

  function hide(pop){
    if(!open)return;
    open=false;which=null;swapping=false;
    panes.forEach(function(p){
      p.classList.remove('on');
      p.setAttribute('aria-hidden','true');
    });
    lock(false);
    if(restore){
      document.title=restore.title;
      if(pop!==true){try{history.pushState(null,'',restore.url);}catch(e){}}
    }
    restore=null;
    setTimeout(function(){if(!open)panes.forEach(function(p){p.innerHTML='';});},WIPE+60);
    if(lastFocus&&lastFocus.focus){try{lastFocus.focus();}catch(e){}}
    lastFocus=null;
  }

  function wire(pane){
    pane.addEventListener('click',function(e){
      var t=e.target;if(!t.closest)return;
      var go=t.closest('[data-pvgo]');
      if(go){e.preventDefault();swap(go.getAttribute('data-pvgo'));return;}
      var cs=t.closest('[data-case-i]');
      if(cs&&window.openCase){e.preventDefault();window.openCase(+cs.getAttribute('data-case-i'));return;}
      /* the process strip opens on hover with a pointer; where there is none,
         a tap does it, and only one stage stays open at a time */
      var st=t.closest('.step');
      if(st){
        e.preventDefault();
        var was=st.classList.contains('open');
        [].forEach.call(pane.querySelectorAll('.step.open'),function(o){o.classList.remove('open');});
        if(!was)st.classList.add('open');
      }
    });
    /* arrow keys walk the work list, the same as everywhere else on the site */
    pane.addEventListener('keydown',function(e){
      var d=e.target.closest&&e.target.closest('[data-case-i]');
      if(!d)return;
      var list=[].slice.call(pane.querySelectorAll('[data-case-i]')),n=list.indexOf(d),to=-1;
      if(e.key==='ArrowDown')to=n+1;else if(e.key==='ArrowUp')to=n-1;else return;
      if(list[to]){e.preventDefault();list[to].focus();}
    });
  }

  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape'||!open)return;
    /* the case study is layered on top and its handler runs first. Checking
       whether it is open is too late by then, it has already closed itself, so
       go by whether it claimed the key.                                     */
    if(e.defaultPrevented)return;
    if(window.pgOpen&&window.pgOpen())return;      // and so is the playground
    e.preventDefault();hide();
  });

  /* Any link pointing at these pages opens the overlay instead of navigating.
     Captured on the document so it works for the header, the burger menu and
     anything inside a pane.                                                */
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]');
    if(!a)return;
    if(e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;   // let people open a new tab
    if(a.target&&a.target!=='_self')return;

    /* The playground sits above these panes, so it just opens on top and
       closing it drops you back here. It used to close this first, which is
       why it looked like it was bouncing off the home page on the way.     */
    if(a.hasAttribute('data-pg')&&open&&window.__openPlayground){
      e.preventDefault();e.stopPropagation();
      document.body.classList.remove('menu-open');
      setTimeout(function(){window.__openPlayground();},90);
      return;
    }

    var href=(a.getAttribute('href')||'').split('#')[0];
    if(href==='about.html'||href==='work.html'){
      e.preventDefault();e.stopPropagation();
      document.body.classList.remove('menu-open');
      var name=href.replace('.html','');
      /* on the standalone document for this very page there is nothing to open */
      if(!open&&location.pathname.split('/').pop()===href)return;
      open?swap(name):show(name,true);
      return;
    }

    /* Going home from inside the overlay just closes it, but only when home is
       what is actually underneath. On the standalone About or Work document it
       is not, so the link has to stay a real link.                          */
    var here=location.pathname.split('/').pop()||'index.html';
    var onHome=(here==='index.html'||here==='mobile.html');
    if(open&&onHome&&(href==='index.html'||href==='mobile.html'||href===''||href==='./')){
      var hash=(a.getAttribute('href')||'').split('#')[1];
      e.preventDefault();e.stopPropagation();
      document.body.classList.remove('menu-open');
      hide();
      if(hash)setTimeout(function(){
        var el=document.getElementById(hash);
        if(hash==='playground'&&window.__openPlayground){window.__openPlayground();return;}
        if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
      },520);
    }
  },true);

  addEventListener('popstate',function(e){
    var st=e.state;
    if(st&&st.pv){open?swap(st.pv):show(st.pv,false);}
    else if(open)hide(true);
  });

  window.openPage=function(name){show(name,true);};
  window.pageViewOpen=function(){return open;};
})();
