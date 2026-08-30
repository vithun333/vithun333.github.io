/* ============================================================================
   About and Work, as markup shared by the in-page overlay and the standalone
   documents. One source, so the two can never drift apart.

   Each chapter is backed by that city's own footage, the same frames the home
   page hero uses, under a wash of the chapter's colour.
   ========================================================================== */
(function(){

/* ---------------------------------------------------------------- artwork

   Each chapter is backed by a photograph from Unsplash, hotlinked from their
   CDN as their guidelines ask, sized by srcset so a phone never pulls a 2400px
   frame. They sit under a wash of the chapter's colour so the type stays
   readable. The Unsplash licence does not require credit, but a portfolio is
   exactly the place to give it, so each one is signed.                     */
function CITY(id,alt,who,handle){
  var u='https://images.unsplash.com/photo-'+id+'?fm=jpg&auto=format&fit=crop&q=80&w=';
  return '<img class="cityshot" alt="'+alt+'" loading="lazy" decoding="async" '+
           'src="'+u+'1600" '+
           'srcset="'+u+'900 900w, '+u+'1600 1600w, '+u+'2400 2400w" '+
           'sizes="100vw">'+
         '<div class="wash"></div>'+
         '<a class="shotcred" href="https://unsplash.com/@'+handle+'" target="_blank" '+
           'rel="noopener noreferrer">Photo '+who+' / Unsplash</a>';
}

/* ---------------------------------------------------------------- process

   Six stages as a strip. Hovering or focusing one lets it take the room and
   the rest fold down to a spine, so the detail is there without a click and
   without a wall of text sitting on the page by default. Pure CSS, driven by
   :hover and :focus-within, which means it also works from the keyboard and
   from a tap on a touch screen with no extra code.                        */
var STEPS=[
 ['Empathize','Start with the person, not the brief.',
  ['Semi-structured interviews, recruited to the actual user, not whoever is nearby',
   'Contextual observation where the thing is really used',
   'Read the complaints and the reviews before assuming anything'],
  'Zealty'],
 ['Define','Turn everything I heard into one sentence worth solving.',
  ['Affinity map the raw notes until the themes argue with each other',
   'Write the problem statement and what success would look like',
   'Agree what is out of scope, in writing, while it is still cheap'],
  'Vancouver Police Museum'],
 ['Ideate','Quantity first. Judgement second.',
  ['Crazy 8s and paper before anything opens in Figma',
   'Steal structure from outside the category on purpose',
   'Rank by user value against effort, not by which one I like'],
  'tidbit'],
 ['Prototype','Build the smallest thing that can be proven wrong.',
  ['Paper for flow, Figma for layout, real code when the answer is motion',
   'Fidelity only where the question needs it, grey boxes everywhere else',
   'One prototype per question, so a failure tells you something'],
  'Echo of Motion'],
 ['Test','Watch what people do. Do not ask what they would do.',
  ['Task-based sessions, five users, think-aloud',
   'Log hesitation as well as failure. The pause is the finding',
   'Keyboard, contrast and screen reader passes every round, not at the end'],
  'Vancouver Police Museum'],
 ['Iterate','Then do it again, with what you learned.',
  ['Fix by severity, then retest the fix rather than assuming it landed',
   'Write down why, so the next person inherits reasoning and not just files',
   'Know when it is done: when the next change stops moving the number'],
  'The Uneven Wave']
];
function PROCESS(){
  return '<section class="sec proc">'+
    '<h2 class="rv">My process</h2>'+
    '<p class="proc-lede rv rv-d1">Six stages, and the loop back to the first one is the point. '+
      'Hover a stage to open it.</p>'+
    '<div class="strip rv rv-d2">'+
      STEPS.map(function(st,i){
        return '<button class="step" type="button" style="--i:'+i+'">'+
          '<span class="spine">'+
            '<b class="no">0'+(i+1)+'</b>'+
            '<b class="nm">'+st[0]+'</b>'+
          '</span>'+
          '<span class="detail"><span class="detail-in">'+
            '<span class="thesis">'+st[1]+'</span>'+
            '<span class="does">'+st[2].map(function(d){return '<i>'+d+'</i>';}).join('')+'</span>'+
            '<span class="seen">Seen in <em>'+st[3]+'</em></span>'+
          '</span></span>'+
        '</button>';
      }).join('')+
    '</div>'+
  '</section>';
}

/* ------------------------------------------------------ letter by letter
   The same treatment the home page gives its section headings, exported so the
   overlay can run it after it paints. Walks text nodes rather than flattening
   textContent, so a heading keeps its <br> and its <em> and still animates one
   character at a time. Each word is wrapped so the browser cannot break a line
   in the middle of one, and .wd is the mask the letters climb out of.
   The character class is .ch-l, not .ch: .ch is already the chapter section. */
window.pvSplit=function(root,step){
  if(!root||root.classList.contains('split'))return;
  var i=0;
  (function walk(node){
    [].slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var frag=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(tok){
          if(!tok)return;
          if(/^\s+$/.test(tok)){frag.appendChild(document.createTextNode(tok));return;}
          var w=document.createElement('span');w.className='wd';
          tok.split('').forEach(function(ch){
            var sp=document.createElement('span');
            sp.className='ch-l';sp.textContent=ch;
            sp.style.transitionDelay=(i*step)+'s';
            sp.style.setProperty('--li',i);i++;
            w.appendChild(sp);
          });
          frag.appendChild(w);
        });
        n.replaceWith(frag);
      }else if(n.nodeType===1&&n.tagName!=='BR'){walk(n);}
    });
  })(root);
  root.classList.add('split');
};
window.pvSplitAll=function(scope){
  if(!scope||!window.pvSplit)return;
  try{
    if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  }catch(e){}
  /* not .globe-head h1: that one is revealed by the scene's own progress, and
     letters in a mask would sit behind it forever */
  [].forEach.call(scope.querySelectorAll('.ptop h1'),function(h){window.pvSplit(h,.03);});
  [].forEach.call(scope.querySelectorAll('.sec>h2,.proc>h2'),function(h){window.pvSplit(h,.045);});
  [].forEach.call(scope.querySelectorAll('.ch-place'),function(h){window.pvSplit(h,.05);});
  [].forEach.call(scope.querySelectorAll('.cta h2'),function(h){window.pvSplit(h,.03);});
};

/* ------------------------------------------------------------------ about */
window.ABOUT_HTML =
'<div class="pv-in">'+
 /* The opening: the page's own header, with the earth beside it. It turns on
    its own the whole time it is on screen, and scrolling pushes it further
    round rather than being the only thing that moves it — a globe that stops
    dead when you stop scrolling reads as a picture, not a planet. */
 '<section class="ptop globe-top">'+
   '<div class="ptop-in">'+
     '<div class="eyebrow rv">About</div>'+
     /* the breaks are explicit so the four-line stack holds at every desktop
        width, rather than being an accident of where the column happens to
        wrap on one screen size */
     '<h1 class="rv rv-d1">Six<br>countries,<br><em>one</em> way of<br>looking.</h1>'+
     '<p class="rv rv-d2">I have been the new person in the room on three continents. It turns out '+
       'that is a design education, and this page is what it taught me.</p>'+
   '</div>'+
   '<div class="globe-wrap" aria-hidden="true"><canvas class="globe-cv"></canvas></div>'+
 '</section>'+

 '<section class="ch" id="c-in">'+
   '<div class="art rv">'+CITY('1582510003544-4d00b7f74220','A South Indian temple gopuram lit against a night sky','SIBY','siby_cd')+'<div class="frame"></div></div>'+
   '<div class="ch-inner">'+
     '<div class="ch-no rv">01 / India</div>'+
     '<h2 class="ch-place rv rv-d1">Chennai</h2>'+
     '<div class="ch-native rv rv-d1">சென்னை</div>'+
     '<div class="ch-yrs rv rv-d2">2004, one year</div>'+
     '<p class="ch-body rv rv-d2">Where I was born, and the shortest stay of the six. What stays with '+
       'me is the visual logic rather than the memory of it. Rangoli laid out in coloured powder on '+
       'doorsteps at dawn, temple gopurams stacked tier on tier, and a city that treats ornament as '+
       'structure rather than decoration. Rules first, then beauty, and all of it redrawn every '+
       'single morning.</p>'+
     '<div class="ch-took rv rv-d3"><b>What it left:</b> pattern can be architecture, not garnish.</div>'+
     '<ol class="steps rv rv-d3">'+
       '<li>Mylapore sets its dots before it draws. The grid comes first, always.</li>'+
       '<li>One unbroken line around the whole grid. Lift it and the kolam is spoiled.</li>'+
       '<li>Fold it or turn it. A street reads a symmetrical pattern without stopping.</li>'+
       '<li>One motif, repeated at four scales, beats four motifs at one.</li>'+
       '<li>It is swept away by noon and drawn again at dawn. Nothing is precious.</li>'+
     '</ol>'+
   '</div>'+
 '</section>'+

 '<section class="ch" id="c-se">'+
   '<div class="art rv">'+CITY('1726134212431-c794fd3d0c34','A lake in the forests of Smaland, Sweden, at dusk','Stories','allthestories')+'</div>'+
   '<div class="ch-inner">'+
     '<div>'+
       '<div class="ch-no rv">02 / Sweden</div>'+
       '<h2 class="ch-place rv rv-d1">Älmhult</h2>'+
       '<div class="ch-native rv rv-d1">Småland</div>'+
       '<div class="ch-yrs rv rv-d2">One year</div>'+
       '<p class="ch-body rv rv-d2">A small town in Småland, and the town IKEA came from. My dad worked '+
         'there, so the principles were not a case study to me, they were the household rules: '+
         'democratic design, form and function and quality and sustainability at a price most people '+
         'can afford, and the belief that if a thing cannot be understood without a manual then the '+
         'thing is wrong.</p>'+
       '<p class="ch-body rv rv-d2">Plain materials, honest joints, nothing performing. It is the first '+
         'design philosophy I met, years before I knew that was what it was.</p>'+
       '<div class="ch-took rv rv-d3"><b>What it left:</b> affordable and considered are not opposites.</div>'+
     '</div>'+
     '<ol class="steps rv rv-d2">'+
       '<li>Form. What catches the eye is a requirement, not a finish added at the end.</li>'+
       '<li>Function. Every part earns its place or it does not leave the prototype shop.</li>'+
       '<li>Quality. It has to survive the years the price implied it would.</li>'+
       '<li>Sustainability. Nothing wasteful, nothing that needs a manual to understand.</li>'+
       '<li>Low price. If the many cannot afford it, the other four did not count.</li>'+
     '</ol>'+
   '</div>'+
 '</section>'+

 '<section class="ch" id="c-vn">'+
   '<div class="art rv">'+CITY('1583417319070-4a69db38a482','The Ho Chi Minh City skyline at sunset over the Saigon river','Tron Le','tronle_sg')+'</div>'+
   '<div class="ch-inner">'+
     '<div class="ch-no rv">03 / Vietnam</div>'+
     '<h2 class="ch-place rv rv-d1">Ho Chi Minh City</h2>'+
     '<div class="ch-native rv rv-d1">Thành phố Hồ Chí Minh</div>'+
     '<div class="ch-yrs rv rv-d2">Four years</div>'+
     '<p class="ch-body rv rv-d2">A city that types in capitals. Hand-painted signage stacked three '+
       'deep, every surface working, information competing at full volume and somehow still legible. '+
       'It is the opposite of the Swedish lesson, and both are true.</p>'+
     '<div class="plates rv rv-d3">'+
       '<b style="--r:-2deg">Density</b><b style="--r:1.5deg">Contrast</b>'+
       '<b style="--r:-1deg">Repetition</b><b style="--r:2deg">Hierarchy under pressure</b>'+
     '</div>'+
     '<div class="ch-took rv rv-d3"><b>What it left:</b> loud can still be organised.</div>'+
     '<ol class="steps rv rv-d3">'+
       '<li>Ngo Viet Thu\'s palace answers the sun before it answers the brief.</li>'+
       '<li>A brise-soleil is structure, shade and pattern in one move. Make things do three jobs.</li>'+
       '<li>A tube house is four metres wide. Constraint is the plan, not the obstacle.</li>'+
       '<li>Borrowed ideas have to be translated, not copied. Modernism arrived, then adapted.</li>'+
       '<li>Design for the monsoon and the heat, not for the drawing.</li>'+
     '</ol>'+
   '</div>'+
 '</section>'+

 '<section class="ch" id="c-cn">'+
   '<div class="art rv">'+CITY('1757836631130-ea95e36e62bb','The Shanghai skyline with the Oriental Pearl Tower and the Huangpu river','Andy Luo','andy8647')+'<div class="glow"></div></div>'+
   '<div class="ch-inner">'+
     '<div class="ch-no rv">04 / China</div>'+
     '<h2 class="ch-place rv rv-d1">Shanghai</h2>'+
     '<div class="ch-native rv rv-d1">上海</div>'+
     '<div class="ch-yrs rv rv-d2">Five years, the second longest</div>'+
     '<p class="ch-body rv rv-d2">Where a layout stopped being only horizontal for me. Type that runs '+
       'down as readily as across, lattice screens that turn a window into a repeating grid, and a red '+
       'seal as the single point of certainty in a composition.</p>'+
     '<p class="ch-body rv rv-d2">The Pearl Tower was the thing on the skyline you set your bearings '+
       'by. Three spheres on a stem, lit in sequence after dark, and nothing else needed.</p>'+
     '<div class="ch-took rv rv-d3"><b>What it left:</b> emphasis is what you leave out.</div>'+
     '<ol class="steps rv rv-d3">'+
       '<li>The yuefenpai worked because it was useful first. Give people a reason to keep it.</li>'+
       '<li>It was a calendar, an advert and a picture at once. One artefact, three jobs.</li>'+
       '<li>Shanghai took Art Deco and made it local. Import the grammar, not the accent.</li>'+
       '<li>Lithography set the palette. Know what your process can actually print.</li>'+
       '<li>It was given away. Distribution decided the influence, not the drawing.</li>'+
     '</ol>'+
   '</div>'+
 '</section>'+

 '<section class="ch" id="c-sg">'+
   '<div class="art rv">'+CITY('1774075884764-be7319c06e08','The Singapore skyline at blue hour, Marina Bay Sands and the observation wheel','Sigrid','sigridpan')+'</div>'+
   '<div class="ch-inner">'+
     '<div class="ch-no rv">05 / Singapore</div>'+
     '<h2 class="ch-place rv rv-d1">Singapore</h2>'+
     '<div class="ch-native rv rv-d1">新加坡 · சிங்கப்பூர்</div>'+
     '<div class="ch-yrs rv rv-d2">Eight years, the longest</div>'+
     '<p class="ch-body rv rv-d2">Four languages on one sign and none of them shouting. A city run on '+
       'systems, where wayfinding is treated as public infrastructure and it shows. The MRT map is a '+
       'design object most people use twice a day without ever once thinking about it, which is the '+
       'highest compliment available.</p>'+
     '<div class="grid-note rv rv-d3">Order is not the absence of personality.<br>'+
       'It is what lets several of them share a page.</div>'+
     '<div class="rules rv rv-d3" aria-hidden="true">'+
       '<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>'+
     '<div class="ch-took rv rv-d3"><b>What it left:</b> systems are a kindness at scale.</div>'+
     '<ol class="steps rv rv-d3">'+
       '<li>Symbols before words. Four official languages, one pictogram.</li>'+
       '<li>One system across every mode. Train, bus and taxi have to read the same.</li>'+
       '<li>A typeface and a single colour can do most of the navigating on their own.</li>'+
       '<li>Design the journey, not the sign. Nobody experiences one sign.</li>'+
       '<li>An HDB block is planned for forty years. Build for the second decade too.</li>'+
     '</ol>'+
   '</div>'+
 '</section>'+

 '<section class="ch" id="c-ca">'+
   '<div class="art rv">'+CITY('1757266562608-2bbf67f92e71','The Vancouver skyline with the North Shore mountains behind it','Dan Dennis','cameramandan83')+'</div>'+
   '<div class="ch-inner">'+
     '<div class="ch-no rv">06 / Canada</div>'+
     '<h2 class="ch-place rv rv-d1">Vancouver</h2>'+
     '<div class="ch-native rv rv-d1">Coast Salish territory</div>'+
     '<div class="ch-yrs rv rv-d2">Three years, and counting</div>'+
     '<p class="ch-body rv rv-d2">Room to breathe, and the first place I got to choose. Studying '+
       'Interactive Arts and Technology at SFU, building the things on this site, and finally putting '+
       'a name to what all the moving had been teaching me: design for the person who does not share '+
       'your assumptions, because you have been that person.</p>'+
     '<div class="ch-took rv rv-d3"><b>What it left:</b> the brief is always someone else\'s context.</div>'+
     '<ol class="steps rv rv-d3">'+
       '<li>Vancouverism: a slim tower on a low podium. Density without a wall at street level.</li>'+
       '<li>Twenty-seven protected view corridors. The mountains outrank the building.</li>'+
       '<li>The seawall is continuous and public. The best part is not sold to anyone.</li>'+
       '<li>Light, air and sightlines are requirements, not amenities.</li>'+
       '<li>It is grey eight months a year. Design for that, not for the launch photograph.</li>'+
     '</ol>'+
   '</div>'+
 '</section>'+

 '<section class="sec">'+
   '<h2 class="rv">My story</h2>'+
   '<div class="two">'+
     '<div class="rv">'+
       '<p>Before I committed to this as a degree I took Google\'s UX Design Professional Certificate, '+
         'and the process it taught me is still the one I use: <b>empathize, define, ideate, prototype, '+
         'test, iterate</b>. Not as a poster on a wall, as the actual order I do things in.</p>'+
       '<p>What I add to it is that I build the thing as well. Research that ends at a slide deck loses '+
         'most of what it found. Being able to take a finding through design and into working front-end '+
         'code means less of it goes missing on the way.</p>'+
     '</div>'+
     '<div class="rv rv-d1">'+
       '<p>I speak English, French and Malayalam, which is three fewer than the number of countries, '+
         'and I am still annoyed about that.</p>'+
       '<p>Off the clock: <b>Horroscope</b>, a short film I was cinematographer on and a finalist for '+
         'its class screening, and <b>Sentient</b>, a science-fiction novel eight months in with a '+
         'cover I designed. Otherwise gaming, anime, football, table tennis and playing guitar badly '+
         'enough to enjoy it.</p>'+
     '</div>'+
   '</div>'+
 '</section>'+

 PROCESS()+

 '<section class="sec">'+
   '<h2 class="rv">Background</h2>'+
   '<div class="rows rv rv-d1">'+
     '<div class="row"><em>Now</em><b>Interactive Arts and Technology, Simon Fraser University</b><span>Third year</span></div>'+
     '<div class="row"><em>2025 to 2026</em><b>Recreation Assistant, SFU Recreation and Fitness</b><span>Volunteer</span></div>'+
     '<div class="row"><em>Summer 2025</em><b>Amusement Host, The Rec Room</b><span>Part-time</span></div>'+
     '<div class="row"><em>2024</em><b>IBM AI Developer Professional Certificate</b><span>Coursera</span></div>'+
     '<div class="row"><em>2023</em><b>Google Project Management Certificate</b><span>Coursera</span></div>'+
     '<div class="row"><em>2022</em><b>Georgia Tech Human-Computer Interaction I to IV</b><span>edX</span></div>'+
     '<div class="row"><em>2022</em><b>Google UX Design Certificate</b><span>Coursera</span></div>'+
   '</div>'+
 '</section>'+

 '<button class="cta" type="button" data-pvgo="work"><small>Next</small>'+
   '<h2 class="rv">See the work <em>&#8594;</em></h2></button>'+
 '<div class="pfoot"><span>&copy; 2026 Srivithun Geetha Vinu</span>'+
   '<span><a href="mailto:vithun.ux@gmail.com">vithun.ux@gmail.com</a></span></div>'+
'</div>';

/* ------------------------------------------------------------------- work */
var DID={
 0:['Designed the recipe detail and cooking experience',
    'Structured ingredients, nutrition, utensils and AI summaries to cut cognitive load',
    'Conceptualised the step-by-step cooking interface, one full-screen instruction at a time'],
 1:['Contributed across research, synthesis, ideation, wireframing and hi-fi prototyping',
    'Led a participatory design workshop with museum staff',
    'Designed the Exhibition Description, My Visit and QR Code screens',
    'Built them around scalable type, high contrast and clear hierarchy'],
 2:['Led the interviews with novice users',
    'Analysed their behavioural data, questionnaires and session recordings',
    'Surfaced the cognitive overload, filter confusion and navigation themes',
    'Those themes drove the recommendations delivered to Zealty'],
 3:['Owned the technical implementation',
    'Wrote the Arduino and Processing code reading the motion sensors',
    'Mapped that data to line position, direction and flow on the canvas',
    'Tuned the mappings until the strokes felt natural'],
 4:['Led the website design and communication',
    'Shaped separate charts into one scrolling narrative',
    'Built the micro-interaction that shifts the background gradient on scroll',
    'Handled documentation: findings, limitations and design decisions']
};
var YEARS={0:'2024',1:'2025',2:'2025',3:'2026',4:'2026'};
var TIME={0:'1 day',1:'4 months',2:'4 months',3:'1 month',4:'2 months'};
var SHOT={0:'th-tb1.jpg',1:'th-VPMD.jpg',2:'th-ZD.jpg',3:'th-EOMD.jpg',4:'th-TUVD.jpg'};

window.WORK_HTML=function(){
  var C=window.CASES||[];
  var order=C.map(function(_,i){return i;}).sort(function(a,b){return YEARS[b]-YEARS[a]||b-a;});
  /* Which of the two inks actually reads on this project's colour. Decided per
     project by WCAG contrast rather than by the current theme: a bright orange
     row wants dark type whether the page around it is light or dark.       */
  function ink(hex){
    var n=parseInt(String(hex).slice(1),16);
    var c=[(n>>16)&255,(n>>8)&255,n&255].map(function(v){
      v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);
    });
    var L=0.2126*c[0]+0.7152*c[1]+0.0722*c[2];
    var onDark=(L+0.05)/0.05;              // against #000-ish
    var onLight=1.05/(L+0.05);             // against #fff-ish
    return onDark>=onLight?'#12120F':'#F4F1EA';
  }
  function pale(hex){
    var n=parseInt(String(hex).slice(1),16);
    return (((n>>16&255)*.299+(n>>8&255)*.587+(n&255)*.114)/255)>0.62;
  }
  return '<div class="pv-in">'+
   '<section class="ptop">'+
     '<div class="eyebrow rv">Work</div>'+
     '<h1 class="rv rv-d1">Work</h1>'+
     '<p class="rv rv-d2">Five projects between 2024 and 2026. Each one says what the problem was and '+
       'what I personally did about it, so you can judge the contribution and not just the '+
       'screenshots.</p>'+
   '</section>'+
   order.map(function(i){
     var c=C[i];
     return '<button class="dossier rv'+(pale(c.color)?' lightpc':'')+'" type="button" '+
       'data-case-i="'+i+'" style="--pc:'+c.color+';--pcink:'+ink(c.color)+'" '+
       'aria-label="'+c.name+'. Open case study">'+
       '<div class="yr">'+YEARS[i]+'<small>'+TIME[i]+'</small></div>'+
       '<div>'+
         '<h2>'+c.name+'</h2>'+
         '<div class="cat"><i></i>'+c.cat+'</div>'+
         '<p class="line">'+c.tagline+'</p>'+
         '<div class="did"><em>What I did</em><ul>'+
           DID[i].map(function(x){return '<li>'+x+'</li>';}).join('')+
         '</ul></div>'+
         '<span class="open">Read the case study <i>&#8594;</i></span>'+
       '</div>'+
       '<div class="shot"><img src="'+SHOT[i]+'" alt="'+c.name+'" loading="lazy"></div>'+
     '</button>';
   }).join('')+
   '<button class="cta" type="button" data-pvgo="about"><small>Next</small>'+
     '<h2 class="rv">Who made it <em>&#8594;</em></h2></button>'+
   '<div class="pfoot"><span>&copy; 2026 Srivithun Geetha Vinu</span>'+
     '<span><a href="mailto:vithun.ux@gmail.com">vithun.ux@gmail.com</a></span></div>'+
  '</div>';
};

/* the rows block used by About's record */
window.PAGE_ROWS_CSS=true;

})();
