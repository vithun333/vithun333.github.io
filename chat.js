/* ============================================================================
   Ask Vithun — a self-contained assistant for people who don't have time to
   read the whole portfolio.

   No API key, no network call, no server. Everything it knows lives in KB
   below, and matching happens locally, so it answers instantly, works offline,
   costs nothing to run and can never invent a fact about Vithun that isn't
   here. Drop <script src="chat.js" defer></script> on any page and it appears.

   House style for answers: talk like a chat, not a brochure. Short lines,
   answer only what was asked, then offer the next thing rather than dumping it.

   To teach it something new, add one entry to KB. Nothing else to touch.
   ========================================================================== */
(function(){
  if(window.__askVithun)return;window.__askVithun=1;

  /* ------------------------------------------------------------------- brain
     Paste your deployed Cloudflare Worker URL here and the chat starts using a
     real language model, with everything below as its offline safety net. Leave
     it empty and the keyword matcher runs on its own, exactly as before.
     Setup instructions: SETUP-CHATBOT.md                                     */
  var API='https://ask-vithun.vithun-ux.workers.dev/';                       // e.g. 'https://ask-vithun.you.workers.dev'
  var API_TIMEOUT=9000;             // past this, stop waiting and answer locally

  var EMAIL='vithun.ux@gmail.com';
  var LINKEDIN='https://www.linkedin.com/in/srivithun-geetha-vinu-05b995241/';
  var mail='<a href="mailto:'+EMAIL+'">'+EMAIL+'</a>';

  /* ---------------------------------------------------------------- knowledge
     k: every word or phrase that should point here. Be generous, this is the
        whole matching surface. Phrases score higher than single words.
     a: the answer. Keep it conversational and end by offering more.
     f: follow-up chips.                                                     */
  var KB=[
  {id:'who',
   /* no "who is" phrase: it tied with real topics like "who is his favourite
      director" and won on list order. The bare word still catches "who is he". */
   k:['who','about him','about you','about vithun','about himself','yourself',
      'introduce','intro','summary','tell me about vithun','tell me about him','bio','profile',
      'background','vithun','srivithun','geetha','vinu'],
   q:'Who is Vithun?',
   a:'He\'s a UX designer and interaction developer in Vancouver, third year Interactive Arts and Technology at SFU.<br><br>The short version: he runs the research, designs the interface, then builds the front end himself.<br><br>Want his work, his background, or the personal stuff?',
   f:['What has he built?','Where did he grow up?','What are his hobbies?']},

  {id:'born',
   k:['born','birthday','birth','age','how old','dob','date of birth','when was he born','february','feb 21','21 february','2004','birthdate'],
   q:'When was he born?',
   a:'Born in <b>Chennai, India</b> on <b>21 February 2004</b>. So he\'s 22.<br><br>He didn\'t stay there long. Want the full list of places he\'s lived?',
   f:['Where did he grow up?','Where is he based?','Who is Vithun?']},

  {id:'education',
   k:['education','school','university','college','study','studying','degree','sfu','simon fraser','iat',
      'interactive arts','major','student','graduate','graduation','when does he graduate','academic','course','courses'],
   q:'Where does he study?',
   a:'Third year <b>Interactive Arts and Technology</b> at <b>Simon Fraser University</b> in Vancouver.<br><br>It sits between design, HCI and development, which is why his projects tend to cover all three.<br><br>Want to see what came out of it?',
   f:['What has he built?','What is he good at?','Is he available for work?']},

  {id:'skills',
   k:['skill','skills','capability','capabilities','what can he do','good at','strength','strengths',
      'expertise','specialise','specialize','discipline','services','what does he do','abilities',
      'accessibility','accessible','interaction design','motion design','visual design'],
   q:'What is he good at?',
   a:'Six things: interaction design, UX research, prototyping, frontend development, motion and visual design, and accessibility.<br><br>The useful bit is the combination. He can run a study, act on it, and ship the interface without a handoff in between.<br><br>Want the tools, or proof from a project?',
   f:['What tools does he use?','Which is his best work?','Can he code?']},

  {id:'tools',
   k:['tool','tools','software','stack','tech','technology','figma','adobe','photoshop','illustrator',
      'after effects','framer','protopie','notion','observable','vs code','github','claude','processing',
      'what does he use','programs','vega','vega-lite'],
   q:'What tools does he use?',
   a:'<b>Design:</b> Figma, Framer, ProtoPie, Photoshop, Illustrator, After Effects.<br><b>Build:</b> VS Code, GitHub, Observable, Vega-Lite, Processing.<br><b>Research:</b> Notion, Zoom, Google Forms.<br><b>Hardware:</b> Arduino and circuits.<br><br>Want to see him actually use any of these?',
   f:['Can he code?','What has he built?','Tell me about Echo of Motion']},

  {id:'code',
   k:['code','coding','can he code','developer','development','frontend','front-end','front end','engineer',
      'programming','program','javascript','html','css','technical','does he code','arduino code'],
   q:'Can he code?',
   a:'Yes, properly.<br><br>He wrote the Arduino and Processing code for Echo of Motion, built a scroll-reactive gradient micro-interaction for The Uneven Wave, and hand-wrote this whole portfolio with no framework.<br><br>Want details on any of those?',
   f:['Tell me about Echo of Motion','How was this site built?','Tell me about The Uneven Wave']},

  {id:'work',
   k:['work','works','project','projects','portfolio','case study','case studies','what has he built',
      'what has he made','built','made','show me','selected work'],
   q:'What has he built?',
   a:'Five case studies:<br><br>• <b>The Uneven Wave</b>, 2026, scroll-driven data viz site<br>• <b>Echo of Motion</b>, 2026, a wearable that draws from movement<br>• <b>Zealty</b>, 2025, comparative usability study<br>• <b>Vancouver Police Museum</b>, 2025, accessibility-first museum app<br>• <b>tidbit</b>, 2024, swipe-based cooking app in one day<br><br>Plus a short film and a novel. Which one?',
   f:['Tell me about Zealty','Tell me about the Police Museum','Which is his best work?']},

  {id:'best',
   /* "best" and "favourite" are different questions and get different answers:
      strongest evidence for a hiring manager vs the ones he actually loved */
   k:['best work','best project','best piece','strongest','proudest','most impressive','impressive',
      'highlight','which project','flagship','standout','top project','strongest work'],
   q:'Which is his best work?',
   a:'<b>Vancouver Police Museum</b>. Four months, a real client, a workshop he led himself, and an implementation-ready prototype at the end.<br><br><b>The Uneven Wave</b> is the one that shows range, since he designed and built it.<br><br>Want the details on either, or the ones he personally enjoyed most?',
   f:['Tell me about the Police Museum','What is his favourite project?','Tell me about The Uneven Wave']},

  {id:'fav',
   k:['favourite project','favorite project','favourite work','favorite work','favourite case study',
      'favorite case study','favourite one','favorite one','which project does he like','project he liked',
      'enjoyed most','enjoyed the most','enjoy most','did he enjoy','did he enjoy most','most fun',
      'most fun project','likes most','like most','loved most','one does he like','which did he enjoy',
      'iron man project','project he enjoyed'],
   q:'What is his favourite project?',
   a:'Two, and not the ones that look best on paper.<br><br><b>tidbit</b>, because seeing what could be done in a single day was genuinely fun. They built a business-style pitch around it and the judge liked the idea enough to tell them to go and actually build it.<br><br><b>Echo of Motion</b>, because of the Iron Man thing. Getting to make a wearable that turns hand movement into visual patterns is about as close to that as a student project gets.<br><br>Want the detail on either?',
   f:['Tell me about tidbit','Tell me about Echo of Motion','Which is his best work?']},

  {id:'tidbit',
   k:['tidbit','titbit','cooking','recipe','recipes','food app','hackathon','one day','1 day','cooking app'],
   q:'Tell me about tidbit',
   a:'A swipe-based recipe and cooking app, designed in <b>one day</b> for a hackathon in 2024.<br><br>The problem was decision fatigue: recipe apps pile on dense content before you\'ve even picked a meal.<br><br><b>What he did:</b><br>• Designed the recipe detail page: ingredients, nutrition, utensils and AI-generated summaries, structured to cut cognitive load<br>• Conceptualised the core interaction, a step-by-step cooking view where each instruction is a full-screen card you scroll through, so you focus on one task at a time<br>• Drove the information architecture and interface design<br><br>There\'s a live Figma prototype in the case study. Want another project?',
   f:['Tell me about the Police Museum','Tell me about Zealty','Which is his best work?']},

  {id:'vpm',
   k:['police','museum','vancouver police','vpm','police museum','museum app','museum project',
      'accessibility project','accessibility work','inclusive','workshop','stakeholder','client',
      'participatory','client work','iat 333'],
   q:'Tell me about the Police Museum project',
   a:'Four months in 2025, built with the Vancouver Police Museum for IAT 333: Interaction Design Methods.<br><br>The museum\'s exhibits and digital touchpoints weren\'t serving visitors with visual, mobility or cognitive access needs, and any fix had to be affordable for a small grant-funded institution.<br><br><b>What he did:</b><br>• Contributed across the full process: research, synthesis, ideation, wireframing, high-fidelity prototyping<br>• <b>Led a participatory design workshop</b> with museum staff, turning their expertise into actionable design requirements<br>• Designed core screens himself: the Exhibition Description page, the My Visit page, and the QR Code page that unlocks context around the museum<br>• Built those screens around scalable type, high contrast and clear hierarchy<br><br>There\'s a video walkthrough in the case study. Want another?',
   f:['Tell me about Zealty','Is he good at research?','Which is his best work?']},

  {id:'zealty',
   k:['zealty','real estate','property','rew','usability study','comparative','usability test',
      'research paper','cognitive load','benchmark','sus','system usability','iat 432'],
   q:'Tell me about Zealty',
   a:'A four-month comparative usability study of Zealty.ca against competitor REW.ca, done for IAT 432 with the real Zealty team.<br><br>16 participants, 8 novices and 8 experts, across four tasks. Zealty scored <b>41.9 SUS with novices (grade F)</b> and 56.6 with experts, against an industry benchmark of 68 and REW\'s ~78. Even experts made more errors, because the interface broke real-estate conventions they already knew.<br><br><b>What he did:</b><br>• <b>Led the novice interviews</b><br>• Analysed their behavioural data, questionnaires and recorded session videos<br>• Read hesitation patterns, repeated actions and verbal feedback to surface the themes of cognitive overload, filter confusion and navigation uncertainty<br>• Those themes fed straight into the recommendations delivered to Zealty\'s design team<br><br>He can share the full research paper on request. Want another project?',
   f:['Tell me about Echo of Motion','Is he good at research?','How do I contact him?']},

  {id:'echo',
   k:['echo','motion','echo of motion','wearable','arduino','gesture','sensor','hardware','wrist',
      'drawing','canvas','physical computing','circuit','iat 320','body as interface'],
   q:'Tell me about Echo of Motion',
   a:'A wearable drawing interface, one month, 2026, for IAT 320: Body as Interface.<br><br>Version one turned body motion into light and sound. It worked, but the professor\'s feedback was that it was a reactive gadget, not an expressive one. So they pivoted to drawing.<br><br><b>What he did:</b><br>• <b>Owned the technical implementation</b><br>• Wrote the Arduino and Processing code that captured sensor motion data<br>• Mapped that data to visual parameters: line position, direction and flow on the canvas<br>• Refined the sensor input and tuned different mappings until the strokes felt smooth and natural<br>• Worked with the team on the pivot itself, from light-and-sound prototype to embodied art piece<br><br>Want another one?',
   f:['Tell me about The Uneven Wave','Can he code?','What has he built?']},

  {id:'wave',
   k:['uneven','wave','uneven wave','data viz','data visualisation','data visualization','dataviz','scroll',
      'ai','observable','chart','charts','gaming','marketing','media','website project','iat 355','visual analytics'],
   q:'Tell me about The Uneven Wave',
   a:'An interactive site of data visualisations built in Observable with Vega-Lite, exploring AI across gaming, marketing and media. Two months, 2026, for IAT 355.<br><br>Feedback on the first version was that it was too text-heavy and the variables weren\'t explained, so the insights got lost.<br><br><b>What he did:</b><br>• Led the <b>website design and communication</b> side<br>• Shaped the ideation, turning separate charts into one narrative with a clear layout and flow<br>• Built a <b>micro-interaction that shifts the background gradient as you scroll</b><br>• Handled documentation: organised progress, refined the writing, set out findings, limitations and design decisions<br>• Guided the live walkthrough, explaining the visualisations through the interface itself<br><br>The live site is linked in the case study. Want another?',
   f:['Tell me about Echo of Motion','Can he code?','Which is his best work?']},

  {id:'research',
   k:['research','researcher','user research','ux research','study','studies','interview','interviews',
      'testing','usability','method','methods','participant','participants','is he good at research',
      'qualitative','quantitative','heuristic','nielsen'],
   q:'Is he good at research?',
   a:'It\'s probably his strongest suit. Two four-month research-led projects.<br><br>On the Police Museum he ran mixed-method research and led a participatory workshop with staff. On Zealty he led novice interviews and behavioural analysis across 16 participants.<br><br>Both ended in decisions, not reports. Want the detail on either?',
   f:['Tell me about Zealty','Tell me about the Police Museum','What is he good at?']},

  {id:'hire',
   k:['hire','hiring','available','availability','internship','intern','opportunity','open to',
      'work with','freelance','contract','coop','co-op','position','recruit',
      'when can he start','start date','when is he available','when could he start','how soon',
      'how long can he work','how long is he available','how many months','spring 2027','2027'],
   q:'Is he available for work?',
   a:'Yes. He\'s looking for internships from <b>spring 2027</b>, <b>4 or 8 months, full-time</b>. Based in Vancouver.<br><br>Want to know what kind of role, or how to reach him?',
   f:['What roles is he looking for?','How do I contact him?','What is his experience?']},

  {id:'roles',
   k:['what role','what roles','which role','kind of role','type of role','what kind of job','looking for',
      'what does he want','ideal role','target role','product design','ux researcher','research role',
      'design role','what job','job','role','wants to do','career','what sort of role',
      'researcher or designer','designer or researcher','research or design','design or research'],
   q:'What roles is he looking for?',
   a:'<b>Product design</b> or <b>UX research</b>.<br><br>Company size doesn\'t matter much to him. What does is somewhere with room to grow and learn.<br><br>Want his availability or his experience?',
   f:['Is he available for work?','What is his experience?','What is his design process?']},

  {id:'jobs',
   k:['experience','work experience','job history','employment','worked','has he worked','previous job',
      'previous work','past job','part time','part-time','volunteer','volunteering','rec room','recroom',
      'amusement','recreation','hospitality','customer service','employer','work history','any jobs',
      'employment','employment history','his experience','what experience'],
   q:'What is his experience?',
   a:'<b>Amusement Host, The Rec Room</b>, part-time, summer 2025.<br><b>Recreation Assistant, SFU Recreation and Fitness</b>, volunteer, summer 2025 to spring 2026.<br><br>Both are front-of-house, which is a lot of watching real people get confused by things in real time. Useful habit for a researcher.<br><br>Want his design work instead?',
   f:['What has he built?','What roles is he looking for?','Is he available for work?']},

  {id:'process',
   k:['process','design process','how does he work','workflow','approach','methodology','method he uses',
      'his process','way of working','how he designs','steps','framework','empathize','ideate','iterate',
      'double diamond','how does he approach'],
   q:'What is his design process?',
   a:'<b>Empathize, Define, Ideate, Prototype, Test, Iterate.</b><br><br>He picked it up from Google\'s UX Design Professional Certificate, which he took before committing to the degree, and he\'s stuck to it since.<br><br>Want to see it applied to a real project?',
   f:['Tell me about the Police Museum','What certifications does he have?','Is he good at research?']},

  {id:'certs',
   k:['certification','certifications','certificate','certificates','certified','credential','credentials',
      'coursera','edx','google certificate','ibm','georgia tech','hci certificate','course','courses',
      'training','qualification','qualifications','what certs'],
   q:'What certifications does he have?',
   a:'Seven, all on his <a href="'+LINKEDIN+'" target="_blank" rel="noopener">LinkedIn</a>:<br><br>• <b>IBM AI Developer</b>, Coursera, 2024<br>• <b>Google Project Management</b>, Coursera, 2023<br>• <b>Georgia Tech HCI I to IV</b>, edX, 2022, covering fundamentals and design principles, cognition and culture, ethics and needfinding, then evaluation and agile methods<br>• <b>Google UX Design</b>, Coursera, 2022<br><br>The Google UX one is where his process comes from. Want to hear it?',
   f:['What is his design process?','Where does he study?','What is he good at?']},

  {id:'contact',
   k:['contact','email','e-mail','reach','get in touch','linkedin','message','talk','connect',
      'how do i contact','how to contact','social','dm','phone','write to him'],
   q:'How do I contact him?',
   a:'Email: '+mail+'<br>LinkedIn: <a href="'+LINKEDIN+'" target="_blank" rel="noopener">@srivithun</a><br><br>Email is fastest. Anything else you want to know first?',
   f:['Is he available for work?','Can I see his resume?','Which is his best work?']},

  {id:'location',
   k:['where','based','location','city','live','lives','living','vancouver','canada','relocate','remote',
      'timezone','time zone','yvr','where is he'],
   q:'Where is he based?',
   a:'<b>Vancouver, Canada</b>, three years now, studying at SFU.<br><br>Before that, five other countries. Want the list?',
   f:['Where did he grow up?','Is he available for work?','When was he born?']},

  {id:'roots',
   k:['grow up','grew up','from','origin','origins','roots','country','countries','nationality','india',
      'sweden','vietnam','china','singapore','chennai','shanghai','almhult','ho chi minh','moved',
      'travelled','traveled','where is he from','culture','international','lived in'],
   q:'Where did he grow up?',
   a:'Six countries in 22 years:<br><br>• <b>Chennai, India</b>, 1 year<br>• <b>Älmhult, Sweden</b>, 1 year<br>• <b>Ho Chi Minh City, Vietnam</b>, 4 years<br>• <b>Shanghai, China</b>, 5 years<br>• <b>Singapore</b>, 8 years<br>• <b>Vancouver, Canada</b>, 3 years<br><br>They\'re hidden behind the letters of his name on the homepage. Want to know why that shapes how he designs?',
   f:['Why UX?','What languages does he speak?','When was he born?']},

  {id:'languages',
   k:['language','languages','speak','speaks','spoken','fluent','fluency','bilingual','multilingual',
      'trilingual','english','french','malayalam','francais','mother tongue','native language',
      'what languages','does he speak'],
   q:'What languages does he speak?',
   a:'<b>English</b>, <b>French</b> and <b>Malayalam</b>.<br><br>Handy for a designer who has lived on three continents. Want to know where those were?',
   f:['Where did he grow up?','Who is Vithun?','Is he available for work?']},

  {id:'why',
   k:['why','why ux','why design','motivation','motivates','inspired','inspiration','got into','journey',
      'jarvis','iron man','tony stark','care about','drives him','what motivates'],
   q:'Why UX?',
   a:'Watching Tony Stark talk to J.A.R.V.I.S. as a kid. Technology that felt effortless and human.<br><br>That\'s still the target, and it\'s why accessibility matters to him. Something that excludes you isn\'t effortless.<br><br>Want to know what he\'s passionate about outside that?',
   f:['What is he passionate about?','What are his hobbies?','What has he built?']},

  {id:'passion',
   k:['passion','passionate','dream','goal','goals','ambition','ambitions','future','wants to','aspire',
      'long term','career goal','what drives'],
   q:'What is he passionate about?',
   a:'Design and film, in that order and then not really in any order.<br><br>He\'s writing a sci-fi novel called <b>Sentient</b>, out soon, and the dream is for it to get picked up by an animation studio or made into live action.<br><br>Want to hear the premise?',
   f:['Tell me about the novel','Tell me about the short film','What are his hobbies?']},

  {id:'film',
   k:['short film','horroscope','horrorscope','movie he made','cinematography','cinematographer','camera',
      'his film','film he made','filmmaking','screening','film class'],
   q:'Tell me about the short film',
   a:'<b>Horroscope</b>, a short film he shot as <b>cinematographer</b> with a six-person crew for a film class.<br><br>It was picked as a <b>finalist for the class screening</b>.<br><br><a href="https://youtu.be/1duDiLWw14M" target="_blank" rel="noopener">Watch it on YouTube</a>. Want to hear about the novel too?',
   f:['Tell me about the novel','What are his favourite films?','What is he passionate about?']},

  {id:'book',
   k:['book','novel','sentient','writing','write','author','kdp','amazon','story','sci-fi','sci fi',
      'science fiction','cover design','viren','intellink','his book'],
   q:'Tell me about the novel',
   a:'<b>Sentient</b>, a sci-fi novel he\'s been writing for eight months, cover designed by him too. Coming to Amazon KDP.<br><br>New Manhattan, 2080. The most valuable thing in the world isn\'t land or oil, it\'s the mind. A hundred million people carry the Intellink chip. Viren is one of the last who doesn\'t, until the company offers him one unlike any they\'ve built.<br><br>It lets him hack with his mind, and see what the other hundred million can\'t. Want the rest?',
   f:['What happens next in Sentient?','What is he passionate about?','Tell me about the short film']},

  {id:'book2',
   k:['what happens next','rest of the plot','plot','ending','unlinked','more about sentient','synopsis',
      'what happens in sentient','rest of sentient','how does it end','how does sentient end',
      'sentient end','ending of sentient','end of sentient','does it end'],
   q:'What happens next in Sentient?',
   a:'The perfect world Intellink built is hiding something monstrous, and the price of paradise has been paid all along by everyone who said yes.<br><br>Now Viren knows too much. Hunted by the most powerful man alive, he falls in with the <b>Unlinked</b>, the outlawed few who refused the chip, and they set out to drag the truth into the light before Intellink buries it, and him, with it.<br><br>And they aren\'t the only ones with an agenda.<br><br>Want to know what else he\'s into?',
   f:['What are his hobbies?','What is he passionate about?','Tell me about the short film']},

  {id:'hobbies',
   k:['hobby','hobbies','fun','for fun','do for fun','free time','interest','interests','personal','beyond',
      'other than','spare time','outside','outside work','outside of work','likes','enjoys','into',
      'sport','sports','football','soccer','table tennis','guitar','instrument','music','cards',
      'card collection','collecting','collection','athletic','plays sports','does he play'],
   q:'What are his hobbies?',
   a:'Gaming, film and shows, anime, card collecting, football, fashion, table tennis, and playing guitar.<br><br>Pick one and I\'ll go deeper.',
   f:['What are his favourite films?','What games does he play?','What anime does he like?']},

  {id:'games',
   k:['game','games','gaming','video game','video games','playstation','console','gamer',
      'last of us','red dead','uncharted','arkham','batman game','favourite game','favorite game',
      'what games','games does he play'],
   q:'What games does he play?',
   a:'Favourites: <b>The Last of Us Part II</b>, <b>Red Dead Redemption 2</b>, <b>Uncharted 4</b> and <b>Batman: Arkham Knight</b>.<br><br>Heavy on story-driven single player, which tracks for someone writing a novel. Want his films or anime?',
   f:['What are his favourite films?','What anime does he like?','What are his hobbies?']},

  {id:'films',
   k:['favourite film','favorite film','favourite films','favorite films','favourite movie','favorite movie',
      'movies','cinema','director','nolan','christopher nolan','memento','oldboy','dune','parasite',
      'prestige','interstellar','shutter island','wolf of wall street','catch me if you can','kumbalangi',
      'the batman','what films','favourite director','favorite director','which director','best director'],
   q:'What are his favourite films?',
   a:'<b>Memento</b>, <b>Oldboy</b>, <b>Dune: Part Two</b>, <b>The Batman</b>, <b>Kumbalangi Nights</b>, <b>Parasite</b>, <b>The Prestige</b>, <b>Interstellar</b>, <b>Shutter Island</b>, <b>The Wolf of Wall Street</b> and <b>Catch Me If You Can</b>.<br><br>Favourite director is <b>Christopher Nolan</b>.<br><br>Want his shows or his anime?',
   f:['What shows does he watch?','What anime does he like?','Tell me about the short film']},

  {id:'anime',
   k:['anime','manga','one piece','attack on titan','aot','jujutsu','bleach','hunter x hunter','hxh',
      'vinland','monster','solo leveling','great pretender','ping pong','japanese animation','what anime'],
   q:'What anime does he like?',
   a:'<b>One Piece</b>, <b>Attack on Titan</b>, <b>Great Pretender</b>, <b>Ping Pong the Animation</b>, <b>Jujutsu Kaisen</b>, <b>Bleach</b>, <b>Hunter x Hunter</b>, <b>Vinland Saga</b>, <b>Monster</b> and <b>Solo Leveling</b>.<br><br>Want his animated shows or his live action ones?',
   f:['What animated shows does he like?','What shows does he watch?','What are his favourite films?']},

  {id:'animated',
   k:['animated','animation','cartoon','cartoons','rick and morty','scavengers reign','common side effects',
      'pantheon','blue eye samurai','avatar','last airbender','arcane','primal','archer','smiling friends',
      'invincible','animated shows','animated series'],
   q:'What animated shows does he like?',
   a:'<b>Rick and Morty</b>, <b>Scavengers Reign</b>, <b>Common Side Effects</b>, <b>Pantheon</b>, <b>Blue Eye Samurai</b>, <b>Avatar: The Last Airbender</b>, <b>Arcane</b>, <b>Primal</b>, <b>Archer</b>, <b>Smiling Friends</b> and <b>Invincible</b>.<br><br>Which is partly why he wants Sentient animated. Want the live action list?',
   f:['What shows does he watch?','Tell me about the novel','What anime does he like?']},

  {id:'shows',
   k:['show','shows','series','tv','television','watch','watching','binge','game of thrones','got',
      'walking dead','breaking bad','mr robot','prison break','lost','sopranos','chernobyl','dexter',
      'dark','black mirror','severance','silo','ted lasso','money heist','atlanta','daredevil','shogun',
      'knight of the seven kingdoms','what shows'],
   q:'What shows does he watch?',
   a:'<b>Game of Thrones</b>, <b>A Knight of the Seven Kingdoms</b>, <b>The Walking Dead</b>, <b>Breaking Bad</b>, <b>Mr. Robot</b>, <b>Prison Break</b>, <b>Lost</b>, <b>The Sopranos</b>, <b>Chernobyl</b>, <b>Dexter</b>, <b>Dark</b>, <b>Black Mirror</b>, <b>Severance</b>, <b>Silo</b>, <b>Ted Lasso</b>, <b>Money Heist</b>, <b>Atlanta</b>, <b>Daredevil</b> and <b>Shogun</b>.<br><br>Sitcoms are a separate list. Want those?',
   f:['What sitcoms does he like?','What anime does he like?','What are his favourite films?']},

  {id:'sitcoms',
   k:['sitcom','sitcoms','comedy','comedies','funny','the office','modern family','how i met your mother',
      'himym','friends','laugh'],
   q:'What sitcoms does he like?',
   a:'<b>The Office</b>, <b>Modern Family</b>, <b>How I Met Your Mother</b> and <b>Friends</b>.<br><br>Want anything else on the personal side?',
   f:['What is his favourite food?','What are his hobbies?','What shows does he watch?']},

  {id:'food',
   k:['food','eat','eats','eating','cuisine','favourite food','favorite food','dish','meal','restaurant',
      'hotpot','mala','szechuan','sichuan','shawarma','kebab','dessert','desert','tiramisu','snack','hungry'],
   q:'What is his favourite food?',
   a:'Dry mala hotpot, Szechuan chicken, and shawarma or kebab.<br><br>Dessert is <b>tiramisu</b>, no debate.<br><br>Anything else you want to know about him?',
   f:['What are his hobbies?','Who is Vithun?','Where did he grow up?']},

  {id:'site',
   k:['this site','this website','this portfolio','how was this built','who made this','built this',
      'site built','made this site','the website','design of this site','this page','who designed'],
   q:'How was this site built?',
   a:'He designed and hand-wrote it. No page builder, no framework.<br><br>Live SVG name with per-letter hit targets and city video behind it, an SVG metaball filter on the portrait, an infinite draggable playground, and a physics-driven swipe deck on mobile.<br><br>Want to know what else he can build?',
   f:['Can he code?','What tools does he use?','What has he built?']},

  {id:'resume',
   k:['resume','cv','curriculum','download','pdf','credentials','qualification','qualifications'],
   q:'Can I see his resume?',
   a:'Email him at '+mail+' and he\'ll send it over. He can share the full Zealty research paper too.<br><br>Anything you want to know in the meantime?',
   f:['Which is his best work?','Is he available for work?','What is he good at?']},

  {id:'meta',
   k:['are you ai','are you a bot','are you real','who are you','what are you','is this ai','is this a bot',
      'chatgpt','llm','gpt','claude','how do you work','are you human','is this real ai','built you',
      'how were you made','what powers you'],
   q:'Are you actually AI?',
   a:'Honestly, no. I\'m a hand-written knowledge base, not a language model. Vithun wrote every answer in here himself.<br><br>Upside: I\'m instant, free to run, and I can\'t make anything up about him.<br><br>Downside: ask me something he didn\'t write and I\'ll say so rather than guess. What do you want to know?',
   f:['Who is Vithun?','What has he built?','How was this site built?']},

  {id:'strength',
   k:['stand out','standout','different','unique','why him','why hire','why should we hire',
      'why should you hire','should we hire','edge','apart','special','compared','compare',
      'other candidates','sell','what makes him'],
   q:'What makes him stand out?',
   a:'Three things.<br><br>He covers the whole chain, research to design to built front end. He has real client work, four months with the Vancouver Police Museum including a workshop he led. And he finishes things: a finalist short film, a novel eight months in, this site.<br><br>Want proof from a specific project?',
   f:['Tell me about the Police Museum','Which is his best work?','Is he available for work?']}
  ];

  var STOP={'a':1,'an':1,'the':1,'is':1,'are':1,'was':1,'were':1,'do':1,'does':1,'did':1,
    'he':1,'him':1,'his':1,'she':1,'her':1,'they':1,'you':1,'your':1,'i':1,'me':1,'my':1,
    'to':1,'of':1,'in':1,'on':1,'at':1,'for':1,'with':1,'and':1,'or':1,'but':1,'that':1,
    'this':1,'it':1,'can':1,'could':1,'would':1,'should':1,'have':1,'has':1,'had':1,
    'tell':1,'about':1,'what':1,'whats':1,'know':1,'any':1,'some':1,'please':1,
    'so':1,'if':1,'then':1,'there':1,'here':1,'be':1,'been':1,'am':1};

  function norm(s){return (s||'').toLowerCase().replace(/[^a-z0-9\s'-]/g,' ').replace(/\s+/g,' ').trim();}
  function toks(s){return norm(s).split(' ').filter(function(t){return t&&!STOP[t];});}

  /* One distinctive word ("zealty", "tiramisu") should be enough to land an
     answer, so a single exact hit clears the bar on its own. Nothing is divided
     by keyword-list length: that punished the entries needing the most synonyms,
     which are exactly the ones people phrase loosely.                        */
  function score(raw,e){
    var q=norm(raw),t=toks(raw),s=0,i,j;
    for(i=0;i<e.k.length;i++){
      var k=e.k[i];
      if(k.indexOf(' ')>-1){ if(q.indexOf(k)>-1)s+=8; continue; }   // phrase beats any pile of single words
      for(j=0;j<t.length;j++){
        var w=t[j];
        if(w===k)s+=4;
        else if(k.length>3&&w.length>3&&(k.indexOf(w)===0||w.indexOf(k)===0))s+=2.5;
        else if(k.length>4&&w.length>4&&k.indexOf(w)>-1)s+=1;
      }
    }
    return s;
  }
  var FLOOR=4;

  /* Every answer ends by offering something, so a bare "yes" has to mean "yes,
     that one". There's no model here to infer it, so the last set of follow-ups
     is kept and an affirmative reply is treated as picking the first.        */
  var YES=/^(y|ye|yes|yeah|yea|yep|yup|sure|ok|okay|k|please|yes please|go on|go ahead|do it|show me|tell me|sounds good|alright|why not|of course|absolutely|definitely|i do|lets|let's)[\s.!?]*$/i;
  var NO=/^(n|no|nope|nah|no thanks|no thank you|not really|im good|i'm good|thats all|that's all|nothing|nevermind|never mind)[\s.!?]*$/i;
  var lastF=null;

  function ask(raw){
    var q=norm(raw);
    if(!q)return null;
    if(/^(hi|hey|hello|yo|sup|hiya|good (morning|afternoon|evening))\b/.test(q))
      return {greet:true,a:'Hey. Ask me anything about Vithun, his projects or the personal stuff.',
              f:['Who is Vithun?','What has he built?','What are his hobbies?']};
    if(/^(thanks|thank you|ty|cheers|nice|cool|great|awesome|perfect|ok|okay)\b/.test(q))
      return {greet:true,a:'Any time. Anything else?',
              f:['Which is his best work?','Is he available for work?','What are his hobbies?']};

    var ranked=KB.map(function(e){return {e:e,s:score(raw,e)};})
                 .sort(function(a,b){return b.s-a.s;});
    if(ranked[0].s>=FLOOR)return ranked[0].e;
    return {miss:true,near:ranked.slice(0,3).map(function(r){return r.e.q;})};
  }

  /* ------------------------------------------------------------------- shell */
  var css=''+
  /* z-index sits below the site's custom cursor (9500/9501) on purpose, so the
     cursor dot stays drawn on top of the panel instead of sliding under it */
  '#avBtn{position:fixed;right:20px;bottom:20px;z-index:9400;width:58px;height:58px;border:none;padding:0;'+
    'background:none;color:#fff;cursor:pointer;display:block;'+
    'transform:translate3d(var(--mx,0px),var(--my,0px),0);will-change:transform}'+
  /* the magnet moves the button, the inner disc handles hover and press, so the
     two effects never fight over one transform property */
  '#avBtn i.in{position:absolute;inset:0;border-radius:50%;background:#FF6A00;display:flex;'+
    'align-items:center;justify-content:center;'+
    'box-shadow:0 10px 30px rgba(255,106,0,.42),0 2px 8px rgba(0,0,0,.24);'+
    'transition:transform .42s cubic-bezier(.22,1.4,.36,1),box-shadow .3s ease}'+
  '#avBtn:hover i.in{transform:scale(1.08);box-shadow:0 18px 40px rgba(255,106,0,.52),0 2px 8px rgba(0,0,0,.24)}'+
  '#avBtn:active i.in{transform:scale(.93)}'+
  '#avBtn svg{position:absolute;width:25px;height:25px;fill:none;stroke:#fff;stroke-width:1.9;'+
    'stroke-linecap:round;stroke-linejoin:round;transition:opacity .25s ease,transform .35s ease}'+
  '#avBtn .x{opacity:0;transform:rotate(-45deg) scale(.7)}'+
  '#avBtn.open .b{opacity:0;transform:rotate(45deg) scale(.7)}'+
  '#avBtn.open .x{opacity:1;transform:none}'+

  /* The panel grows out of the button and shrinks back into it: a blob that
     rounds off to a circle at the small end, with the contents fading in only
     once it has most of its size, so nothing looks stretched on the way.   */
  '#avPanel{position:fixed;right:20px;bottom:88px;z-index:9401;width:min(384px,calc(100vw - 40px));'+
    'height:min(560px,calc(100vh - 128px));display:flex;flex-direction:column;overflow:hidden;'+
    'background:var(--paper,#EFECE4);color:var(--ink,#12120F);'+
    'border:1px solid var(--rule,rgba(18,18,15,.14));box-shadow:0 32px 80px rgba(0,0,0,.3);'+
    'transform-origin:var(--ox,100%) var(--oy,100%);pointer-events:none;will-change:transform;'+
    'opacity:0;border-radius:50%;transform:scale(.16) translateY(var(--dy,0px));'+
    'transition:transform .58s cubic-bezier(.22,1.3,.34,1),border-radius .5s cubic-bezier(.3,1,.4,1),'+
      'opacity .26s ease}'+
  '#avPanel.on{opacity:1;border-radius:18px;transform:scale(1) translateY(var(--dy,0px));pointer-events:auto}'+
  '#avPanel>*{opacity:0;transition:opacity .22s ease}'+
  '#avPanel.on>*{opacity:1;transition-delay:.2s}'+
  /* Closing is deliberately not the reverse of opening. Running the open
     backwards squeezed the panel down to an ellipse before it faded, which read
     as a shape change rather than a dismissal. It keeps its corner radius and
     simply draws in a little as it goes.                                    */
  '#avPanel.closing{opacity:0;border-radius:18px;'+
    'transform:scale(.93) translateY(var(--dy,0px));'+
    'transition:transform .32s cubic-bezier(.4,0,.25,1),opacity .26s ease,border-radius 0s}'+
  '#avPanel.closing>*{opacity:0;transition:opacity .16s ease}'+
  /* while a finger is on it, it tracks the finger instead of easing */
  '#avPanel.drag{transition:opacity .2s ease}'+
  '#avHead{display:flex;align-items:center;gap:10px;padding:15px 16px;'+
    'border-bottom:1px solid var(--rule,rgba(18,18,15,.14));flex:none}'+
  '#avHead .dot{width:8px;height:8px;border-radius:50%;background:#FF6A00;flex:none}'+
  '#avHead b{font-size:12px;letter-spacing:.16em;text-transform:uppercase;font-weight:700}'+
  '#avHead small{margin-left:auto;font-size:9px;letter-spacing:.16em;text-transform:uppercase;'+
    'font-weight:700;opacity:.5}'+
  /* the sheet covers the floating button on a phone, so the way out has to live
     in the panel itself rather than behind it */
  '#avClose{flex:none;width:34px;height:34px;margin:-6px -6px -6px 4px;border:none;border-radius:50%;'+
    'background:transparent;color:inherit;cursor:pointer;display:flex;align-items:center;'+
    'justify-content:center;transition:background .25s ease}'+
  '#avClose:hover{background:var(--paper-2,#E6E2D8)}'+
  '#avClose svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}'+
  /* overscroll-behavior stops a flick at the end of the log from scrolling the page */
  '#avLog{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px;'+
    'display:flex;flex-direction:column;gap:12px;-webkit-overflow-scrolling:touch;scrollbar-width:thin}'+
  '.avMsg{max-width:88%;font-size:13.5px;line-height:1.62;border-radius:14px;padding:11px 14px;'+
    'animation:avIn .45s cubic-bezier(.22,1.25,.36,1) both}'+
  '@keyframes avIn{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}'+
  '.avMsg.bot{align-self:flex-start;background:var(--paper-2,#E6E2D8);border-bottom-left-radius:5px}'+
  '.avMsg.me{align-self:flex-end;background:#FF6A00;color:#fff;border-bottom-right-radius:5px}'+
  '.avMsg a{color:#FF6A00;text-decoration:underline;text-underline-offset:2px;word-break:break-word}'+
  '.avMsg.me a{color:#fff}'+
  '.avMsg b{font-weight:700}'+
  '.avDots{align-self:flex-start;display:flex;align-items:center;gap:5px;padding:14px 15px;border-radius:14px;'+
    'background:var(--paper-2,#E6E2D8);border-bottom-left-radius:5px;'+
    'animation:avIn .35s cubic-bezier(.22,1.25,.36,1) both}'+
  '.avDots i{width:7px;height:7px;border-radius:50%;background:#FF6A00;'+
    'animation:avBl 1.05s cubic-bezier(.45,0,.55,1) infinite}'+
  '.avDots i:nth-child(2){animation-delay:.16s}.avDots i:nth-child(3){animation-delay:.32s}'+
  '@keyframes avBl{0%,65%,100%{opacity:.3;transform:translateY(0) scale(.8)}'+
    '32%{opacity:1;transform:translateY(-5px) scale(1.12)}}'+
  '#avChips{display:flex;flex-wrap:wrap;gap:7px;padding:0 16px 12px;flex:none}'+
  '#avChips button{font:inherit;font-size:11.5px;line-height:1.3;padding:8px 13px;border-radius:40px;cursor:pointer;'+
    'background:transparent;color:inherit;border:1px solid var(--rule,rgba(18,18,15,.2));'+
    'transition:background .25s ease,border-color .25s ease,transform .25s ease}'+
  '#avChips button:hover{background:#FF6A00;border-color:#FF6A00;color:#fff;transform:translateY(-1px)}'+
  '#avForm{display:flex;gap:8px;padding:12px 14px calc(14px + env(safe-area-inset-bottom));flex:none;'+
    'border-top:1px solid var(--rule,rgba(18,18,15,.14))}'+
  '#avIn{flex:1;min-width:0;font:inherit;font-size:13.5px;padding:11px 14px;border-radius:40px;'+
    'background:var(--paper-2,#E6E2D8);color:inherit;border:1px solid transparent;outline:none;'+
    'transition:border-color .25s ease}'+
  '#avIn:focus{border-color:#FF6A00}'+
  '#avSend{flex:none;width:40px;height:40px;border:none;border-radius:50%;background:#FF6A00;cursor:pointer;'+
    'display:flex;align-items:center;justify-content:center;transition:transform .25s ease,opacity .25s ease}'+
  '#avSend:hover{transform:scale(1.07)}#avSend:active{transform:scale(.92)}'+
  '#avSend svg{width:17px;height:17px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'+
  '@media (max-width:560px){'+
    '#avBtn{right:16px;bottom:16px;width:54px;height:54px}'+
    /* shorter than the screen on purpose: leaves the page visible above it, so
       the sheet reads as a sheet and there is somewhere to tap to dismiss */
    '#avPanel{right:0;left:0;bottom:0;width:100%;height:76svh;max-height:76vh}'+
    '#avPanel.on{border-radius:20px 20px 0 0}'+
    '#avHead{padding:14px 14px 10px;cursor:grab;touch-action:none}'+
    '#avClose{width:38px;height:38px}'+
    /* a grab handle, so the swipe is discoverable rather than a secret */
    '#avHead::before{content:"";position:absolute;left:50%;top:6px;width:38px;height:4px;'+
      'margin-left:-19px;border-radius:4px;background:currentColor;opacity:.22}'+
    '#avHead{position:relative}}'+
  '@media (prefers-reduced-motion:reduce){#avBtn,#avPanel,.avMsg{transition-duration:.01ms;animation:none}}';

  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  var btn=document.createElement('button');
  btn.id='avBtn';btn.type='button';btn.setAttribute('aria-label','Ask about Vithun');
  btn.innerHTML='<i class="in">'+
    '<svg class="b" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.5 9.5 0 0 1-2.8-.4L3 21l1.6-4.6A8.2 8.2 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/></svg>'+
    '<svg class="x" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></i>';

  var panel=document.createElement('div');
  panel.id='avPanel';panel.setAttribute('role','dialog');
  panel.setAttribute('aria-label','Ask about Vithun');panel.setAttribute('aria-hidden','true');
  panel.innerHTML=
    '<div id="avHead"><span class="dot"></span><b>Ask about Vithun</b><small>Instant</small>'+
      '<button id="avClose" type="button" aria-label="Close chat">'+
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>'+
      '</button></div>'+
    '<div id="avLog" aria-live="polite"></div>'+
    '<div id="avChips"></div>'+
    '<form id="avForm" autocomplete="off">'+
      '<input id="avIn" type="text" placeholder="Ask me anything about Vithun" aria-label="Your question">'+
      '<button id="avSend" type="submit" aria-label="Send">'+
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>'+
      '</button>'+
    '</form>';

  document.body.appendChild(btn);document.body.appendChild(panel);

  var log=panel.querySelector('#avLog'),chips=panel.querySelector('#avChips'),
      form=panel.querySelector('#avForm'),input=panel.querySelector('#avIn');
  var open=false,busy=false;

  /* The site runs its own eased page scroll off a window-level wheel handler
     that preventDefaults everything. Stopping the event here, before it can
     bubble that far, hands the wheel back to the message list.             */
  ['wheel','mousewheel','DOMMouseScroll','touchmove'].forEach(function(t){
    panel.addEventListener(t,function(e){e.stopPropagation();},{passive:true});
  });

  function scroll(){log.scrollTop=log.scrollHeight;}
  function say(html,who){
    var m=document.createElement('div');m.className='avMsg '+(who||'bot');m.innerHTML=html;
    log.appendChild(m);scroll();return m;
  }
  function setChips(list){
    chips.innerHTML='';
    (list||[]).forEach(function(t){
      var b=document.createElement('button');b.type='button';b.textContent=t;
      b.addEventListener('click',function(){send(t);});
      chips.appendChild(b);
    });
  }
  function thinking(){
    var d=document.createElement('div');d.className='avDots';
    d.innerHTML='<i></i><i></i><i></i>';log.appendChild(d);scroll();return d;
  }

  /* Local answer, used on its own when there's no API and as the safety net when
     there is one. Returns {a,f} ready to render.                             */
  function localAnswer(text){
    var res;
    if(YES.test(text)&&lastF&&lastF.length)res=ask(lastF[0]);   // "yes" → the thing just offered
    else if(NO.test(text))res={a:'No problem. I\'m here if anything else comes up.',
      f:['Which is his best work?','Is he available for work?','How do I contact him?']};
    else res=ask(text);
    if(res&&res.miss)
      return {a:'Don\'t have that one. Here\'s what I can answer, or ask him yourself at '+mail+'.',
              f:res.near};
    if(res)return {a:res.a,f:res.f||['What has he built?','What are his hobbies?','How do I contact him?']};
    return {a:'Ask me anything about Vithun.',f:['Who is Vithun?','What has he built?','How do I contact him?']};
  }

  /* The model gets the last few turns for context. If it is slow, rate-limited,
     down, or simply not configured, we answer locally instead of showing an
     error: a hiring manager should never meet a broken chat.                 */
  var history=[];
  function remoteAnswer(text){
    if(!API)return Promise.reject('no api');
    /* must never throw synchronously: a raw throw here would escape the .then
       rejection handler below and leave the chat stuck on "thinking" */
    if(typeof fetch!=='function')return Promise.reject('no fetch');
    var ctl=typeof AbortController!=='undefined'?new AbortController():null;
    var timer=setTimeout(function(){if(ctl)ctl.abort();},API_TIMEOUT);
    return fetch(API,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({messages:history.concat([{role:'user',content:text}])}),
      signal:ctl?ctl.signal:undefined
    }).then(function(r){
      clearTimeout(timer);
      if(!r.ok)throw new Error('status '+r.status);
      return r.json();
    }).then(function(j){
      if(!j||typeof j.a!=='string'||!j.a.trim())throw new Error('empty');
      return {a:j.a,f:(j.f&&j.f.length?j.f:null)};
    });
  }

  function send(text){
    text=(text||'').trim();
    if(!text||busy)return;
    busy=true;input.value='';setChips([]);
    say(text.replace(/[<>&]/g,''),'me');

    var d=thinking(),t0=Date.now(),done=false;
    function render(out){
      if(done)return;done=true;                       // whoever gets there first wins
      var finish=function(){
        d.remove();
        say(out.a);
        var f=out.f&&out.f.length?out.f
              :['What has he built?','Is he available for work?','How do I contact him?'];
        setChips(f);lastF=f;
        history.push({role:'user',content:text},{role:'assistant',content:out.a});
        if(history.length>8)history=history.slice(-8);
        busy=false;
        if(open&&window.innerWidth>560)input.focus();
      };
      /* hold the dots for a beat even on an instant local answer, so the
         thinking state is something you see rather than a flicker */
      var held=Math.max(0,620+Math.random()*260-(Date.now()-t0));
      setTimeout(finish,held);
    }

    if(API){
      /* Belt and braces. AbortController normally rejects the fetch and we fall
         through, but if a request somehow never settles at all, this timer still
         answers and clears busy, so the chat can't lock up. */
      var guard=setTimeout(function(){render(localAnswer(text));},API_TIMEOUT+400);
      var p;
      try{p=remoteAnswer(text);}catch(err){p=Promise.reject(err);}
      p.then(function(out){clearTimeout(guard);render(out);},
             function(){clearTimeout(guard);render(localAnswer(text));});
    }else{
      render(localAnswer(text));
    }
  }

  /* Point the panel's growth at the button, so it really does come out of it
     rather than merely appearing near it. Recomputed on open and on resize
     because the button moves with the viewport.                           */
  function anchor(){
    /* the panel is scaled down while closed, so measure it unscaled or the
       origin lands in the wrong place entirely */
    panel.style.transition='none';
    panel.style.transform='none';
    const p=panel.getBoundingClientRect(),b=btn.getBoundingClientRect();
    panel.style.transform='';
    panel.getBoundingClientRect();                  // settle back before animating
    panel.style.transition='';
    if(!p.width||!b.width)return;
    panel.style.setProperty('--ox',((b.left+b.width/2-p.left)/p.width*100).toFixed(1)+'%');
    panel.style.setProperty('--oy',((b.top+b.height/2-p.top)/p.height*100).toFixed(1)+'%');
  }
  addEventListener('resize',function(){if(open)anchor();});

  var closeT=null;
  function opened(){
    if(open)return;open=true;
    clearTimeout(closeT);
    if(panel.classList.contains('closing')){
      /* still mid-dismiss: drop back to the closed state without animating
         through it, or the panel would grow from wherever the fade got to */
      panel.style.transition='none';
      panel.classList.remove('closing');
      panel.getBoundingClientRect();
      panel.style.transition='';
    }
    panel.style.setProperty('--dy','0px');
    anchor();
    panel.classList.add('on');panel.setAttribute('aria-hidden','false');
    btn.classList.add('open');
    btn.setAttribute('aria-label','Close');
    try{sessionStorage.setItem('av-seen','1');}catch(e){}
    if(!log.children.length){
      say('Hey, I\'m Vithun\'s assistant. Ask me about his work, his background, or what he\'s into.');
      var f0=['Who is Vithun?','What has he built?','Which is his best work?','What are his hobbies?'];
      setChips(f0);lastF=f0;
    }
    if(window.innerWidth>560)setTimeout(function(){input.focus();},420);
  }
  function closed(){
    if(!open)return;open=false;
    panel.classList.remove('drag');
    panel.style.setProperty('--dy','0px');
    panel.classList.add('closing');
    panel.classList.remove('on');panel.setAttribute('aria-hidden','true');
    btn.classList.remove('open');btn.setAttribute('aria-label','Ask about Vithun');
    /* once it has faded, snap back to the closed state so the next open starts
       from the button again rather than from the dismissed position */
    clearTimeout(closeT);
    closeT=setTimeout(function(){
      panel.style.transition='none';
      panel.classList.remove('closing');
      panel.getBoundingClientRect();
      panel.style.transition='';
    },380);
  }

  /* ------------------------------------------------------- swipe to dismiss
     Drag the header down and the sheet follows, fading as it goes. Past a
     threshold, or on a quick flick, it lets go and morphs back into the button
     exactly as the close button would. Anything short of that springs back. */
  (function(){
    const head=panel.querySelector('#avHead');
    let id=null,y0=0,dy=0,t0=0,last=0,vel=0;
    head.addEventListener('pointerdown',function(e){
      if(!open||window.innerWidth>560)return;
      if(e.target&&e.target.closest&&e.target.closest('#avClose'))return;   // that's a tap, not a drag
      id=e.pointerId;y0=last=e.clientY;dy=0;vel=0;t0=performance.now();
      panel.classList.add('drag');
      try{head.setPointerCapture(id);}catch(err){}
    });
    head.addEventListener('pointermove',function(e){
      if(id===null||e.pointerId!==id)return;
      vel=e.clientY-last;last=e.clientY;
      dy=Math.max(0,e.clientY-y0);                   // down only
      panel.style.setProperty('--dy',dy.toFixed(1)+'px');
      panel.style.opacity=Math.max(0,1-dy/520).toFixed(3);
    });
    function end(e){
      if(id===null||(e&&e.pointerId!==undefined&&e.pointerId!==id))return;
      try{head.releasePointerCapture(id);}catch(err){}
      id=null;
      panel.classList.remove('drag');
      panel.style.opacity='';
      const far=dy>120||(vel>9&&dy>50);
      if(far)closed();
      else panel.style.setProperty('--dy','0px');    // springs home on the panel's own curve
      dy=0;
    }
    head.addEventListener('pointerup',end);
    head.addEventListener('pointercancel',end);
  })();

  btn.addEventListener('click',function(){open?closed():opened();});
  panel.querySelector('#avClose').addEventListener('click',closed);
  form.addEventListener('submit',function(e){e.preventDefault();send(input.value);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&open){closed();btn.focus();}});
  /* Clicking a chip calls send(), which clears the chip row synchronously. By the
     time the click reaches document the button is already detached, so a plain
     panel.contains(e.target) test reads false and the panel closes itself. Stop
     the event at the panel, and ignore anything already off the DOM.         */
  panel.addEventListener('click',function(e){e.stopPropagation();});
  /* tapping the page above the sheet dismisses it, on phones too now that the
     sheet no longer fills the screen */
  document.addEventListener('click',function(e){
    if(!open)return;
    if(e.target&&e.target.isConnected===false)return;
    if(!panel.contains(e.target)&&!btn.contains(e.target))closed();
  });

  /* ------------------------------------------------------------------ magnet
     Only while the cursor is actually over the button. The pull is read from
     the button's resting centre, not its live rect: the rect already includes
     the offset we applied, so measuring that feeds the movement back into
     itself and the button drifts away.                                      */
  var fine=true;
  try{fine=matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches;}catch(e){}
  if(fine){
    var tX=0,tY=0,rX=0,rY=0,mRaf=null,PULL=.5,CAP=16;
    function clamp(v,a,b){return v<a?a:v>b?b:v;}
    function mTick(){
      rX+=(tX-rX)*.18;rY+=(tY-rY)*.18;
      btn.style.setProperty('--mx',rX.toFixed(2)+'px');
      btn.style.setProperty('--my',rY.toFixed(2)+'px');
      mRaf=(Math.abs(tX-rX)>.15||Math.abs(tY-rY)>.15)?requestAnimationFrame(mTick):null;
    }
    function mStart(){if(!mRaf)mRaf=requestAnimationFrame(mTick);}
    btn.addEventListener('mousemove',function(e){
      var r=btn.getBoundingClientRect(),
          hx=r.left+r.width/2-rX,                    // resting centre, offset removed
          hy=r.top+r.height/2-rY;
      tX=clamp((e.clientX-hx)*PULL,-CAP,CAP);
      tY=clamp((e.clientY-hy)*PULL,-CAP,CAP);
      mStart();
    });
    btn.addEventListener('mouseleave',function(){tX=0;tY=0;mStart();});
    addEventListener('blur',function(){tX=0;tY=0;mStart();});
  }

})();
