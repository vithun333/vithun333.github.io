/* ============================================================================
   Case study content, shared by the in-page overlay and by case.html.

   One source for the data and the markup, so a case study opened from the home
   page and one opened from a direct link can never drift apart.
   ========================================================================== */
(function(){

window.CASES=[
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
  outcome:`The most useful thing I learned here is that accessibility is a research problem before it is an interface problem. Scalable type and high contrast screens were the straightforward part. Knowing which barriers actually stopped people came from watching visitors in the building and running a workshop with the staff who are there every day. The second lesson was about constraints. A small, grant funded museum cannot implement a prototype that assumes new hardware, so designing to what an organisation can realistically operate is part of the brief rather than a compromise on it.`,
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
  outcome:`This project changed how I read a usability result. The surprise was not that novices struggled. It was that experts made more errors than novices on navigation and filtering, which told us the problem was unfamiliarity rather than complexity. Zealty had diverged from patterns professionals already held in their heads. I also learned to pair the numbers with the words. A System Usability Scale score of 41.9 says something is wrong, but "busy", "crowded" and "overwhelming" said what was wrong. Delivering that to a real product team taught me to frame findings as decisions they could act on rather than criticism they had to absorb.`,
  link:null },

{ name:"Harmony Arts Studio", cat:"Visual Identity / Design System", color:"#F5C842",
  tagline:`A visual design system and template kit for a Langley wellness studio, built so a small team can publish on-brand content without a designer.`,
  hero:"HAS1.png", gallery:["HAS2.png","HAS3.png","HAS4.png"],
  problem:`Harmony Arts Studio is a creative community space in Willoughby Town Centre, Langley, hosting yoga, meditation, sound healing, art, dance and music led by a roster of independent teachers. Its audience lives on Instagram, where it had grown past 227 followers, but posts were being produced ad hoc. Each one used a different typeface, the colour shifted week to week, and there was no fixed relationship between a headline, an image and a call to action. The feed did not read as one studio. The harder constraint was operational rather than visual. The people posting are teachers and studio staff rather than designers, so any solution that depended on design judgement to apply correctly would decay as soon as it left my hands.`,
  solution:`I delivered a visual design system rather than a set of posts. It defines a colour palette, a type scale with fixed roles, layout templates for the formats the studio actually publishes, and a library of reusable components. The palette is deliberately small, built on a warm yellow, a near black and a soft cream, because three colours can be applied correctly by someone who is not a designer while a twelve colour palette cannot. Typography pairs a high contrast serif for headlines with a quiet sans for body copy and labels. The system has one signature gesture, a yellow highlight behind a key phrase, which gives every post a recognisable moment without requiring a new idea each week. All of it ships as ready to use templates with written brand guidelines, so the team can produce on-brand content independently and hold one identity across channels.`,
  body:[`Harmony Arts Studio needed its social presence to look like the room it advertises: warm, calm and deliberate. The work was commissioned as a visual identity and template system covering the studio's recurring post types, including the weekly class schedule, studio features aimed at prospective renters, teacher and booking calls, workshop announcements, and a visit us card carrying the address and contact details.`,
    `I started from the content rather than the aesthetic. Listing what the studio genuinely posts, week after week, produced a small set of recurring shapes: a headline with one highlighted phrase, a dated list of classes with teacher and duration, a grid of feature cards with icons, and a call to action with a destination. Designing the templates against those real patterns, instead of inventing layouts and hoping content would fit, is what made the kit usable. Several of my early layouts broke the moment a real class name ran to two lines.`,
    `The system rests on a few fixed decisions. Colour is three values plus the highlight. Typography has four roles, covering display headline, section label, body and caption, each with a locked size and weight, so choosing type is a matter of picking the role rather than judging a size. Components are consistent across every template: a pill button, a rounded card with a yellow border for photography, a circular icon chip, and an eyebrow label set in letterspaced caps. Every post is assembled from that same vocabulary, which is why the set reads as one studio even though the posts do very different jobs.`,
    `Accessibility shaped the palette more than style did. Yellow on white fails contrast badly, so yellow never carries body copy. It sets headlines against near black, sits behind text as a highlight, or fills a button with dark type on top. That single rule keeps the studio's most recognisable colour legible in every placement, which matters on a platform where most people read at arm's length on a phone.`,
    `The delivery was a template kit alongside written brand guidelines covering what each colour is for, which type role belongs where, how much space to leave, and what the highlight should and should not mark. The measure of this project is not any individual post. It is whether a studio manager with no design background can open a template months from now, change the class list, and publish something that still looks like Harmony Arts Studio.`],
  meta:{Year:"2026",Timeframe:"3 weeks",Tools:"Figma, Illustrator",Category:"Visual Identity / Design System"},
  outcome:`The brief looked like a set of posts and turned out to be a question about what happens after I leave. A studio where one person handles the marketing does not need more beautiful assets. It needs a system it can run without me, so the real deliverable was the decisions written down: which yellow, which weight, how much space, what the highlight is for. Building the templates against the studio's actual content rather than placeholder text is what made them hold up, and I learned that the hard way when early layouts broke on a two line class name. The other lesson was restraint. Three colours and one repeated gesture are enough to make a post recognisable in a feed, and few enough that someone who is not a designer can apply them correctly.`,
  link:{label:"Visit the studio site",url:"https://harmonyartstudio.ca"} },

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
  outcome:`Designing a whole cooking flow in a single day enforced a discipline I have kept since. Decide what the user is doing in this exact moment, and show only that. The step by step view works because it refuses to show step four while you are on step two. What I underestimated was research. With one day there was none, so every decision rested on an assumption rather than evidence. Shipping something coherent that fast taught me how much of design is sequencing, and how easily a confident guess can pass for a finding if nobody asks where it came from.`,
  link:{label:"View the prototype",url:"https://www.figma.com/proto/yYFBcKCkSWOcsuwWP1xIzX/Hackathons-Design?node-id=87-506&starting-point-node-id=87%3A506"} },

{ name:"Echo of Motion", cat:"Wearable Interaction", color:"#EF4444",
  tagline:`Exploring wrist movement and delayed motion feedback through a wearable drawing interface.`,
  hero:"EOMD.png", gallery:["320-2.png","320-3.png","320-1.png"],
  problem:`The initial concept explored translating body motion into light and sound feedback using sensors and Arduino. While the idea successfully demonstrated a technical connection between movement and digital output, the experience felt too functional and product-oriented. The interaction focused on triggering visual and auditory responses rather than creating a meaningful artistic experience. During our presentation, feedback from our professor highlighted that the concept lacked depth in terms of embodied exploration and did not fully investigate how movement itself could become a creative and expressive medium.`,
  solution:`After discussing the project with our professor, we redefined the concept to focus on translating body movement into a drawing experience. Instead of producing simple light and sound outputs, hand gestures and motion now generate dynamic lines and shapes on a digital canvas. This shift transformed the project from a reactive system into an open-ended artistic experience where participants can visually express their movements in real time. To support this new direction, we modified the Arduino and Processing code so that motion data controlled drawing behavior such as line position, size, and flow.`,
  body:[`This project was developed for IAT 320: Body as Interface, a course that explores how the human body can serve as an input medium for interactive systems. Through prototyping with Arduino, sensors, and creative coding, the course investigates embodied interaction and how movement, gesture, and physical sensation can be translated into meaningful digital experiences.`,
    `As part of this project, I was primarily responsible for developing the technical implementation that translated body movement into a real-time drawing experience. I worked on the Arduino and Processing code that captured motion data from the sensors and mapped those values to visual parameters such as line position, direction, and flow on the digital canvas. This involved refining the sensor input, adjusting how movement was interpreted, and experimenting with different mappings to create smooth and expressive drawings that responded naturally to the user's gestures. I also collaborated closely with my team during the concept pivot, helping transform the project from a functional light-and-sound prototype into a more artistic and embodied interaction.`],
  meta:{Year:"2026",Timeframe:"1 month",Tools:"Arduino, Circuits",Category:"Wearable Interaction"},
  outcome:`The pivot was the lesson. Our first build worked, taking movement in and putting light and sound out, and it was still the wrong project because it demonstrated a connection rather than giving anyone something to express. Being told that in a presentation was uncomfortable and completely correct. Rebuilding it as a drawing instrument taught me that in embodied interaction the mapping is the design. Identical sensor data feels mechanical or expressive depending entirely on what you map it to and how much of the movement's character survives the translation.`,
  link:null },

{ name:"The Uneven Wave", cat:"Frontend / Data Viz", color:"#CDB89A",
  tagline:`An interactive website showcasing data visualizations built in Observable with Vega-Lite, exploring AI usage across gaming, marketing, and media.`,
  hero:"TUW-1.png", gallery:["TUW-2.png","TUW-3.png","TUW-4.png"],
  problem:`Our initial presentation received feedback that the content was too text-heavy, which made it difficult for viewers to quickly identify the most important insights. In addition, some variables used in the visualizations were not clearly explained, causing confusion and reducing the overall effectiveness of the storytelling.`,
  solution:`To address this feedback, we refined the written content by reducing the amount of text and emphasizing key takeaways with bolded summary statements. We also clarified the visualizations by improving labels and making the variables easier to understand. To create a more engaging experience, we introduced scroll-based animations that gradually revealed content as users moved through the page, helping guide attention and making the information easier to follow.`,
  body:[`This project was created for IAT 355: Introduction to Visual Analytics, where we explored principles of effective data visualization by analyzing datasets, designing interactive charts, and presenting insights through a web-based storytelling experience.`,
    `For my role and contribution, I focused primarily on the website design and communication aspects of the project. I contributed to the ideation process by helping shape how the visualizations would be presented as a cohesive narrative, ensuring the layout, flow, and user experience of the site were clear and intuitive. I was also involved in the development process by implementing a micro-interaction that dynamically changes the background gradient as the user scrolls, adding a more engaging and polished experience. In addition, I worked on documentation by organizing our progress, refining written content, and clearly outlining our findings, limitations, and design decisions. During the presentation, I helped guide the walkthrough of the website, explaining the visualizations and insights directly through the interface.`],
  meta:{Year:"2026",Timeframe:"2 months",Tools:"Observable, Github",Category:"Front-end / Data Visualization"},
  outcome:`Feedback that our first version was too text heavy taught me something I had been getting wrong about data storytelling. Needing a paragraph to explain a chart usually means the chart has not been designed to explain itself. Cutting the copy and bolding the takeaway made the same findings land harder. The scroll driven reveals were the other half of it. Pacing the information turned a dense page into a sequence, and sequence is what turns a set of charts into an argument.`,
  link:{label:"View the live site",url:"https://ceez23.github.io/IAT355_FinalProject_PopeyesSandwich/"} }

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
  /* The page used to stop dead at the last image and jump straight to the next
     project. A case study that ends on a screenshot has not said what it was
     for — this is the part a reader actually wants: what the work taught. */
  (c.outcome?'<div class="wrap"><section class="outcome rv">'+
    '<h3><i></i>What I took from it</h3>'+
    '<p>'+c.outcome+'</p>'+
  '</section></div>':'')+
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
