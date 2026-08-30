/* ============================================================================
   Case study content, shared by the in-page overlay and by case.html.

   One source for the data and the markup, so a case study opened from the home
   page and one opened from a direct link can never drift apart.
   ========================================================================== */
(function(){

window.CASES=[
{ name:"tidbit", cat:"UI/UX Hackathon", color:"#F5821F",
  tagline:`A swipe-based recipe discovery and cooking experience designed to reduce decision fatigue and get users cooking faster, designed in 1 day.`,
  hero:"tb1.png", gallery:["tb2.png","tb34.png","tb56.png"],
  problem:`Many users experience friction when deciding what to cook due to overwhelming recipe content, lengthy instructions, and high cognitive effort before committing to a meal. Existing food and recipe platforms often prioritize information density over decision efficiency.`,
  solution:`tidbit explored a low-friction, swipe-based discovery model that allows users to browse recipes quickly and intuitively. The design prioritized rapid decision-making, simplified recipe presentation, and a clear progression from inspiration to action.`,
  body:[`tidbit was born out of a shared frustration with the overwhelming nature of modern recipe apps. Faced with endless scrolling, dense instructions, and decision fatigue, we envisioned a simpler way to move from inspiration to action. By reframing cooking as a quick, intuitive discovery experience, tidbit explores how thoughtful interaction design can make everyday decisions feel effortless.`,
    `As part of the tidbit hackathon project, I was responsible for designing the recipe detail and cooking experience, with a particular focus on how users transition from discovering a recipe to actively preparing it. I designed the recipe description page to present essential information such as ingredients, nutritional data, utensils, and AI-generated summaries in a structured and visually digestible format. The layout was intentionally organized to reduce cognitive load and help users quickly understand what they needed before starting.`,
    `I also conceptualized tidbit's core interaction: a step-by-step cooking interface that guides users through each instruction using vertical scrolling. Instead of presenting all instructions at once, each step appears as a full-screen immersive view with supporting imagery, allowing users to focus on one task at a time. This progressive disclosure approach transforms cooking into a more intuitive and engaging experience, similar to browsing short-form content, while minimizing distractions and making the learning process feel more approachable for beginner cooks.`,
    `Through this work, I explored how interaction design can simplify complex tasks and turn recipe instructions into a guided, user-centered experience. The project highlights my strengths in information architecture, interface design, and creating innovative interaction patterns that balance usability with visual appeal.`],
  meta:{Year:"2024",Timeframe:"1 day",Tools:"Figma",Category:"UI/UX Hackathon"},
  link:{label:"View the prototype",url:"https://www.figma.com/proto/yYFBcKCkSWOcsuwWP1xIzX/Hackathons-Design?node-id=87-506&starting-point-node-id=87%3A506"} },

{ name:"Vancouver Police Museum App", cat:"UI/UX", color:"#3B82F6",
  tagline:`Designing an accessibility-first museum experience grounded in real-world research and stakeholder collaboration.`,
  hero:"VPM1.png", gallery:["VPM2.png","VPM3.png","VPM4.png"],
  problem:`The Vancouver Police Museum sought to improve the accessibility and inclusivity of its visitor experience. Existing exhibit interactions and digital touchpoints did not adequately support users with varying accessibility needs, including visual, mobility, and cognitive differences. Additionally, any proposed solution needed to be realistic for implementation within the museum's operational and funding constraints.`,
  solution:`Our team conducted longitudinal, mixed-method user research over four months, including on-site observations, stakeholder interviews, and accessibility evaluations. Insights from this research informed the design of an accessible mobile app prototype that emphasized inclusive navigation, readable content hierarchies, and intuitive interaction patterns aligned with accessibility standards.`,
  body:[`This project emerged from the class IAT 333: Interaction Design Methods with close collaboration with the <a href="https://www.vancouverpolicemuseum.ca/" target="_blank" rel="noopener">Vancouver Police Museum</a> and its visitors. Through months of on-site research and conversations with staff, we recognized how traditional museum experiences often exclude users with accessibility needs. This work set out to reimagine how digital tools could support inclusive storytelling while remaining realistic for a small, grant-funded institution.`,
    `This project was a research-driven UX design collaboration completed in close partnership with the Vancouver Police Museum and its staff. I contributed across the full design process, from research and synthesis to ideation, wireframing, and high-fidelity prototyping.`,
    `On the research side, I led a participatory design workshop with museum staff to better understand visitor needs, accessibility challenges, and opportunities for improving the on-site experience. Through collaborative ideation activities, we gathered insights directly from stakeholders and translated their expertise into actionable design requirements. This process helped ensure that the proposed solution addressed both user expectations and operational realities.`,
    `On the design side, I was responsible for creating several core screens of the mobile experience, including the Exhibition Description page, the My Visit page, and the QR Code page used to unlock contextual information throughout the museum. These interfaces were designed with a strong emphasis on accessibility, incorporating scalable typography, high-contrast visuals, and clear information hierarchy to reduce cognitive load and support a wide range of visitors.`,
    `The final outcome was a polished, implementation-ready prototype intended to enhance how visitors explore exhibits and plan their museum experience. This project demonstrates my ability to lead collaborative research activities and translate stakeholder insights into thoughtful, user-centered design solutions for a real-world organization.`],
  meta:{Year:"2025",Timeframe:"4 months",Tools:"Figma",Category:"UI/UX"},
  link:{label:"Watch the walkthrough",url:"https://www.youtube.com/watch?v=i3CqeT_Vx2Q"} },

{ name:"Zealty", cat:"UX Research", color:"#EC4899",
  tagline:`A research case study with suggested design choices delivered to the design team at Zealty.`,
  hero:"Z1.png", gallery:["Z2.png","Z3.png","Zealty_SUS.png"],
  problem:`The evaluation revealed that Zealty's primary challenge was not a lack of functionality, but excessive information density that increased cognitive load. Across nearly all tasks, users required more time to complete workflows on Zealty compared to REW, particularly during complex filtering. Novice users were significantly slower even on simple tasks such as address search, suggesting difficulty interpreting the interface quickly. Unexpectedly, expert users also demonstrated high friction, committing significantly more errors on Zealty during navigation and filtering tasks. This indicated that Zealty diverged from industry-standard interaction patterns, disrupting professionals' established mental models. Satisfaction scores reinforced these findings: Zealty received a System Usability Scale score of 41.9 from novices (Grade F) and 56.6 from experts (Grade D), both falling well below the industry benchmark of 68 and far below REW's ~78 average. Qualitative feedback consistently described the interface as "busy," "crowded," and "overwhelming," revealing that visual overload and unclear filter hierarchy were core drivers of reduced efficiency, increased error rates, and diminished trust.`,
  solution:`Based on the synthesis of quantitative and qualitative findings, we proposed a focused redesign strategy centered on reducing cognitive load while preserving Zealty's strong data capabilities. First, we recommended reducing visual overload by simplifying the interface hierarchy, minimizing overlapping elements, grouping related controls, and prioritizing primary information over secondary details. Second, we proposed improving interaction consistency by aligning icons, behaviors, and navigation patterns with established real estate industry standards to restore predictability for expert users. Finally, we identified filtering as the largest usability bottleneck and recommended strengthening filter discoverability through clearer labeling, better grouping of criteria, visible highlighting of active filters, and stronger system feedback when changes are applied.`,
  body:[`Completed as part of IAT 432: Design Evaluation, this project involved working directly with <a href="https://www.zealty.ca/" target="_blank" rel="noopener">Zealty</a> to conduct an in-depth evaluation of their product and deliver research-backed design recommendations to improve the user experience.`,
    `As part of an advanced UX evaluation project, our team conducted a comprehensive comparative usability study of Zealty.ca's map interface, benchmarking it against REW.ca, a well-established competitor in the real estate market. The objective was to measure efficiency, effectiveness, and user satisfaction across both novice homebuyers and experienced real estate professionals. We recruited 16 participants (8 Novices and 8 Experts) and asked them to complete four high-frequency tasks, including address search, navigation and sorting, identifying key property details, and applying complex filters. The study combined heuristic evaluation using Nielsen's 10 Usability Heuristics, moderated usability testing, quantitative performance metrics (time-on-task, error rates, and System Usability Scale scores), and qualitative behavioral observations.`,
    `My primary responsibility in this project was leading interviews with novice users and analyzing their behavioral data. I reviewed questionnaire responses and analyzed recorded session videos of participants completing tasks on both platforms. Through close observation of hesitation patterns, repeated actions, and verbal feedback, I identified themes related to cognitive overload, filter confusion, and uncertainty in navigation, which directly informed our final design recommendations to the design team.`,
    `Interested in the full research process behind this case study? Contact me to view the complete Zealty research paper.`],
  meta:{Year:"2025",Timeframe:"4 months",Tools:"Figma, Zoom, Google Forms",Category:"UX Research"},
  link:null },

{ name:"Echo of Motion", cat:"Wearable Interaction", color:"#EF4444",
  tagline:`Exploring wrist movement and delayed motion feedback through a wearable drawing interface.`,
  hero:"EOMD.png", gallery:["320-2.png","320-3.png","320-1.png"],
  problem:`The initial concept explored translating body motion into light and sound feedback using sensors and Arduino. While the idea successfully demonstrated a technical connection between movement and digital output, the experience felt too functional and product-oriented. The interaction focused on triggering visual and auditory responses rather than creating a meaningful artistic experience. During our presentation, feedback from our professor highlighted that the concept lacked depth in terms of embodied exploration and did not fully investigate how movement itself could become a creative and expressive medium.`,
  solution:`After discussing the project with our professor, we redefined the concept to focus on translating body movement into a drawing experience. Instead of producing simple light and sound outputs, hand gestures and motion now generate dynamic lines and shapes on a digital canvas. This shift transformed the project from a reactive system into an open-ended artistic experience where participants can visually express their movements in real time. To support this new direction, we modified the Arduino and Processing code so that motion data controlled drawing behavior such as line position, size, and flow.`,
  body:[`This project was developed for IAT 320: Body as Interface, a course that explores how the human body can serve as an input medium for interactive systems. Through prototyping with Arduino, sensors, and creative coding, the course investigates embodied interaction and how movement, gesture, and physical sensation can be translated into meaningful digital experiences.`,
    `As part of this project, I was primarily responsible for developing the technical implementation that translated body movement into a real-time drawing experience. I worked on the Arduino and Processing code that captured motion data from the sensors and mapped those values to visual parameters such as line position, direction, and flow on the digital canvas. This involved refining the sensor input, adjusting how movement was interpreted, and experimenting with different mappings to create smooth and expressive drawings that responded naturally to the user's gestures. I also collaborated closely with my team during the concept pivot, helping transform the project from a functional light-and-sound prototype into a more artistic and embodied interaction.`],
  meta:{Year:"2026",Timeframe:"1 month",Tools:"Arduino, Circuits",Category:"Wearable Interaction"},
  link:null },

{ name:"The Uneven Wave", cat:"Frontend / Data Viz", color:"#CDB89A",
  tagline:`An interactive website showcasing data visualizations built in Observable with Vega-Lite, exploring AI usage across gaming, marketing, and media.`,
  hero:"TUW-1.png", gallery:["TUW-2.png","TUW-3.png","TUW-4.png"],
  problem:`Our initial presentation received feedback that the content was too text-heavy, which made it difficult for viewers to quickly identify the most important insights. In addition, some variables used in the visualizations were not clearly explained, causing confusion and reducing the overall effectiveness of the storytelling.`,
  solution:`To address this feedback, we refined the written content by reducing the amount of text and emphasizing key takeaways with bolded summary statements. We also clarified the visualizations by improving labels and making the variables easier to understand. To create a more engaging experience, we introduced scroll-based animations that gradually revealed content as users moved through the page, helping guide attention and making the information easier to follow.`,
  body:[`This project was created for IAT 355: Introduction to Visual Analytics, where we explored principles of effective data visualization by analyzing datasets, designing interactive charts, and presenting insights through a web-based storytelling experience.`,
    `For my role and contribution, I focused primarily on the website design and communication aspects of the project. I contributed to the ideation process by helping shape how the visualizations would be presented as a cohesive narrative, ensuring the layout, flow, and user experience of the site were clear and intuitive. I was also involved in the development process by implementing a micro-interaction that dynamically changes the background gradient as the user scrolls, adding a more engaging and polished experience. In addition, I worked on documentation by organizing our progress, refining written content, and clearly outlining our findings, limitations, and design decisions. During the presentation, I helped guide the walkthrough of the website, explaining the visualizations and insights directly through the interface.`],
  meta:{Year:"2026",Timeframe:"2 months",Tools:"Observable, Github",Category:"Front-end / Data Visualization"},
  link:{label:"View the live site",url:"https://ceez23.github.io/IAT355_FinalProject_PopeyesSandwich/"} },
];

/* ------------------------------------------------------------------ markup
   backHref: given, the Back control is a link (standalone page). Omitted, it
   is a button the host wires to close the overlay.                        */
window.caseHTML=function(i,opts){
  opts=opts||{};
  var C=window.CASES,c=C[i],n=(i+1)%C.length,nx=C[n];
  var pad=function(v){return String(v).padStart(2,'0');};
  var meta=Object.keys(c.meta).map(function(k){
    return '<div><span>'+k+'</span><b>'+c.meta[k]+'</b></div>';}).join('');
  var body=c.body.map(function(p,j){
    return '<p class="'+(j===0?'lead':'')+'">'+p+'</p>';}).join('');
  var gal=c.gallery.map(function(g,j){
    return '<figure class="rv"><img src="'+g+'" alt="" loading="lazy">'+
      '<figcaption><span>'+c.name+'</span><span>Fig. '+pad(j+1)+'</span></figcaption></figure>';}).join('');
  var link=c.link?'<a class="linkbtn" href="'+c.link.url+'" target="_blank" rel="noopener">'+
      '<span>'+c.link.label+' \u2197</span></a>':'';
  var back=opts.backHref
    ? '<a class="backbtn" href="'+opts.backHref+'" data-home><span class="ar">\u2190</span><span>Back</span></a>'
    : '<button class="backbtn" type="button" data-caseback><span class="ar">\u2190</span><span>Back</span></button>';
  var nextHref=opts.nextHref?' href="'+opts.nextHref.replace('{i}',n)+'" data-case':'';
  var nextTag=opts.nextHref?'a':'button';

  return back+
  '<div class="cv-in">'+
  '<section class="chero">'+
    '<div class="chip rv hi"><i></i>'+c.cat+' \u2014 '+pad(i+1)+' / '+pad(C.length)+'</div>'+
    '<h1 class="rv hi">'+c.name+'</h1>'+
    '<p class="tagline rv hi">'+c.tagline+'</p>'+
    '<div class="metarow rv hi">'+meta+'</div>'+
    '<div class="bigimg rv"><img src="'+c.hero+'" alt="'+c.name+'"></div>'+
  '</section>'+
  '<div class="wrap">'+
    '<div class="ps-grid">'+
      '<div class="ps rv"><h3>The problem</h3><p>'+c.problem+'</p></div>'+
      '<div class="ps rv"><h3>The approach</h3><p>'+c.solution+'</p></div>'+
    '</div>'+
    '<div class="prose rv">'+body+link+'</div>'+
  '</div>'+
  '<div class="gal">'+gal+'</div>'+
  '<'+nextTag+' class="next"'+nextHref+' data-casenext="'+n+'"'+(opts.nextHref?'':' type="button"')+'>'+
    '<small>Next project</small>'+
    '<h2>'+nx.name+' <em>\u2192</em></h2>'+
  '</'+nextTag+'>'+
  '<div class="cfoot">'+
    '<span>\u00a9 2026 Srivithun Geetha Vinu</span>'+
    '<span><a href="mailto:vithun.ux@gmail.com">vithun.ux@gmail.com</a></span>'+
  '</div>'+
  '</div>';
};

/* reveals, scoped to whichever element is doing the scrolling */
window.caseReveal=function(root,scroller){
  var els=[].slice.call(root.querySelectorAll('.rv,.bigimg,.gal figure'));
  if(typeof IntersectionObserver==='undefined'){
    els.forEach(function(e){e.classList.add('in');});return;
  }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{root:scroller||null,threshold:.12,rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(e){io.observe(e);});
  /* anything already on screen shows at once */
  requestAnimationFrame(function(){
    els.forEach(function(e){
      var r=e.getBoundingClientRect();
      if(r.top<innerHeight*.92)e.classList.add('in');
    });
  });
};

})();
