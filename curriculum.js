// Bitongue Adventures — Curriculum data (single source of truth)
// 13 levels (Pre A1 -> C1 exam prep), aligned with Cambridge recommendations:
// Levels 1-7: Power Up path (Pre A1 - B1, primary);
// Levels 8-11: Evolve secondary path (B1 - B2);
// Level 12: C1 Advanced (Empower / Evolve Advanced);
// Level 13: C1 Advanced exam preparation (Cambridge C1 Advanced).
// 9 units per level (117 total), each unit = 1 grammar topic
// (complete syllabus, no repetitions) + 5 days of class per unit,
// with the 7 skill areas (Vocabulary, Reading, Listening, Speaking,
// Writing, Grammar, Entrepreneurship) inside each day.

const DAY_STRUCTURE = [
  { n: 1, name: "Discover",    icon: "fa-compass",      focus: "Vocabulary + Reading" },
  { n: 2, name: "Explore",     icon: "fa-book-open",    focus: "Listening + Speaking" },
  { n: 3, name: "Practice",    icon: "fa-puzzle-piece", focus: "Grammar + Writing" },
  { n: 4, name: "Create",      icon: "fa-palette",      focus: "Speaking + Writing" },
  { n: 5, name: "Show what you know", icon: "fa-trophy", focus: "Review + Entrepreneurship" }
];

const SKILL_AREAS = [
  { id: "vocabulary", name: "Vocabulary",       icon: "📚" },
  { id: "reading",    name: "Reading",          icon: "📖" },
  { id: "listening",  name: "Listening",        icon: "🎧" },
  { id: "speaking",   name: "Speaking",         icon: "🎤" },
  { id: "writing",    name: "Writing",          icon: "✍️" },
  { id: "grammar",    name: "Grammar",          icon: "🧩" },
  { id: "project",    name: "Entrepreneurship", icon: "🚀" }
];

const LEVELS = [
  { id: "l1", num: 1, cefr: "Pre A1 · Starters", series: "Power Up 1", units: [
    ["Hello, friends!", "Verb 'to be' (I, you)"], ["My family", "a / an + plural nouns"],
    ["My school day", "this / that / these / those"], ["Colours & numbers", "Possessive adjectives (my, your, his, her)"],
    ["My body & face", "Imperatives"], ["Toy box", "Question words (what, where, who, how old)"],
    ["Animal friends", "can / can't (ability)"], ["My home", "there is / there are"], ["Yummy food", "Possessive 's"]]},
  { id: "l2", num: 2, cefr: "Pre A1+ · Starters", series: "Power Up 2", units: [
    ["My day", "have got"], ["At the playground", "Present simple (I, you, we, they)"],
    ["Weather watch", "Present simple (he, she, it)"], ["Party time!", "Present simple questions & short answers"],
    ["My clothes", "Adverbs of frequency"], ["On the farm", "Prepositions of place"],
    ["Helping at home", "Prepositions of time (in, on, at)"], ["People who help us", "Countable & uncountable + some / any"],
    ["Sports & games", "was / were"]]},
  { id: "l3", num: 3, cefr: "A1 · Movers", series: "Power Up 3", units: [
    ["Breakfast time", "Past simple: regular verbs"], ["In the city", "Past simple: irregular verbs"],
    ["On holiday", "Past simple: questions & negatives"], ["At the zoo", "Comparatives (-er / more)"],
    ["My free time", "Superlatives"], ["Friends forever", "Present continuous"],
    ["After school club", "Present continuous vs present simple"], ["The rainforest", "like / love / hate + -ing"],
    ["Feast & festivals", "Object pronouns"]]},
  { id: "l4", num: 4, cefr: "A1+ · Movers → Flyers", series: "Power Up 4", units: [
    ["Morning routines", "going to (plans)"], ["Travel & transport", "will / won't (predictions & offers)"],
    ["Our planet", "must / mustn't"], ["Amazing animals", "there was / there were"],
    ["Then & now", "Quantifiers: much / many / a lot of"], ["Making music", "Conjunctions: and / but / or"],
    ["Heroes & legends", "Possessive pronouns (mine, yours)"], ["Inventors & machines", "Adverbs of manner"],
    ["Show time!", "Polite requests: Can I...? / Could I...?"]]},
  { id: "l5", num: 5, cefr: "A2 · Flyers", series: "Power Up 5", units: [
    ["Healthy me", "should / shouldn't"], ["World of water", "have to / don't have to"],
    ["At the museum", "Past continuous"], ["Great buildings", "Past continuous vs past simple"],
    ["Money & me", "Zero & first conditional"], ["Media & screens", "Connectors: because / so"],
    ["Teams & leaders", "Verbs + to-infinitive (want, decide, hope)"], ["Roots & traditions", "Defining relative clauses (who, which, that)"],
    ["Choose your future", "too / enough"]]},
  { id: "l6", num: 6, cefr: "A2+ · Flyers → Key", series: "Power Up 6", units: [
    ["Me & my world", "Present perfect with ever / never / just"], ["Mind & body", "Present perfect with for / since"],
    ["Forces of nature", "Present perfect vs past simple"], ["Great explorers", "Gerunds after prepositions & as subjects"],
    ["Enterprise lab", "Verb patterns: -ing or to-infinitive"], ["Screens & stories", "as...as comparisons"],
    ["Leading together", "Second conditional"], ["Culture & identity", "used to"],
    ["Next steps", "Relative clauses with whose / where"]]},
  { id: "l7", num: 7, cefr: "B1 · Key", series: "Power Up 7", units: [
    ["Identity & belonging", "Present perfect continuous"], ["Body & well-being", "Past perfect"],
    ["Discovery & invention", "Reported speech: statements"], ["The business mindset", "Reported speech: questions & commands"],
    ["Our changing planet", "Passive voice: present & past simple"], ["Media & influence", "might / may / could (possibility)"],
    ["Leadership in action", "could / was able to (past ability)"], ["Voices of the world", "Verb + object + infinitive (want sb to do)"],
    ["My future plan", "It's + adjective + to-infinitive"]]},
  { id: "l8", num: 8, cefr: "B1 · Preliminary", series: "Evolve 1 / B1", units: [
    ["Who am I becoming?", "Modals of deduction: must / might / can't"], ["Wellbeing & balance", "Past modals: should have / could have"],
    ["Climate action", "Passive with modal verbs"], ["Innovation now", "wish / if only + past (present wishes)"],
    ["Young entrepreneurs", "would rather / had better"], ["Digital citizens", "Contrast connectors: however / although / despite"],
    ["Leading change", "Phrasal verbs (separable / inseparable)"], ["Cultural exchange", "Causative: have / get something done"],
    ["Decisions & consequences", "unless / in case / as long as"]]},
  { id: "l9", num: 9, cefr: "B1+ · Preliminary → First", series: "Evolve 2 / B1+", units: [
    ["Success & motivation", "Third conditional"], ["Mind & machine", "Mixed conditionals"],
    ["The blue planet", "wish + past perfect (past regrets)"], ["Science frontiers", "Reported speech advanced (modal backshift)"],
    ["Startup studio", "Passive reporting: It is said / believed that"], ["Media & truth", "Reduced relative clauses"],
    ["Global citizens", "so / such... that"], ["Art & identity", "both / either / neither; each / every / all / none"],
    ["Exam challenge (B1)", "Question tags (advanced)"]]},
  { id: "l10", num: 10, cefr: "B2 · First", series: "Evolve 3 / B2", units: [
    ["Fluency first", "Future continuous"], ["Health & performance", "Future perfect"],
    ["Environment & energy", "Future in the past (was going to / would)"], ["Technology & society", "Advanced articles (zero article, generic reference)"],
    ["Business start-up", "Participle clauses (having done, being done)"], ["Media makers", "Cleft sentences (It was... that...)"],
    ["Leading projects", "Concession: even though / whereas / no matter"], ["Culture & communication", "Nominalisation & formal style"],
    ["Exam challenge (B2)", "Discourse markers & cohesion"]]},
  { id: "l11", num: 11, cefr: "B2+ · First → Advanced", series: "Evolve 4 / B2+", units: [
    ["Beyond borders", "Inversion after negative adverbials"], ["The science of learning", "Subjunctive & formal structures"],
    ["Sustainability & systems", "Hedging: seem / appear / tend to"], ["The innovation economy", "Ellipsis & substitution"],
    ["From pitch to plan", "Idiomatic phrasal verbs & collocations"], ["Storytelling & media", "Formal conditionals (were it not for...)"],
    ["Leadership & legacy", "Non-defining relative clauses (of which)"], ["Language & identity", "Cohesion, reference & punctuation mastery"],
    ["Mastery & beyond", "Integrated review: from grammar to discourse"]]},
  { id: "l12", num: 12, cefr: "C1 · Advanced", series: "Empower / Evolve Advanced", units: [
    ["The examined life", "Modal perfect for speculation (must have / can't have done)"],
    ["Wellbeing by design", "Future perfect continuous"],
    ["Digital frontiers", "Passive infinitives & gerunds (to be done, needs doing)"],
    ["Media & persuasion", "Comment adverbs & stance markers (admittedly, arguably)"],
    ["Venture & innovation", "Complex noun phrases & collocation"],
    ["Climate & policy", "Alternative conditionals (supposing, otherwise, but for)"],
    ["The art of negotiation", "Reporting verbs & advanced reported structures"],
    ["Ethics & leadership", "Emphatic structures & auxiliary do"],
    ["Language & thought", "Gradability, intensifiers & adverb choice"]]},
  { id: "l13", num: 13, cefr: "C1 · Exam Preparation", series: "C1 Advanced (CAE) Trainer", units: [
    ["Exam overview & strategy", "Exam format, timing & task navigation"],
    ["Reading & Use of English I", "Multiple-choice cloze & open cloze strategies"],
    ["Reading & Use of English II", "Word formation & key word transformations"],
    ["Reading strategies", "Skimming, scanning, inference & distractor awareness"],
    ["Writing I", "Essay: structure, register & range"],
    ["Writing II", "Proposal, report & review formats"],
    ["Listening strategies", "Note-taking, prediction & distractors"],
    ["Speaking", "Collaborative task & extended turn"],
    ["Full mock & feedback", "Simulated exam, error analysis & action plan"]]}
];

// ---------------------------------------------------------------------------
// SKILL JOURNEYS (design from the research PDF)
// Each journey = progressive levels; each level = activities + XP.
// Content per activity is added later in CONTENT (below), day by day.
// ---------------------------------------------------------------------------
const SKILL_JOURNEYS = {
  reading: {
    title: "Reading Journey",
    howItWorks: "Read · Understand · Think · Answer · Earn XP",
    levels: [
      { name: "Recognize",  xp: 10, activities: ["Word Discovery", "Picture Match", "Find in the Story", "Highlight Words", "Who Said It?"] },
      { name: "Understand", xp: 15, activities: ["Multiple Choice", "True or False", "Order the Events", "Character Feelings", "Find Evidence"] },
      { name: "Interpret",  xp: 20, activities: ["Why Did It Happen?", "Character Motivation", "Prediction", "Best Advice", "Choose the Lesson"] },
      { name: "Analyze",    xp: 25, activities: ["Compare & Reality", "Problem Solving", "Decision Making", "Real Life Connection", "Challenge Question"] }
    ]
  },
  listening: {
    title: "Listening Journey",
    howItWorks: "Listen · Think · Answer · Earn XP",
    levels: [
      { name: "Identify Sounds & Words", xp: 10, activities: ["Listen & Choose", "Listen & Match", "Listen & Select", "Listen & Find", "Listen & Repeat"] },
      { name: "Understand Phrases",      xp: 15, activities: ["Listen & Choose", "Listen & Order", "Listen & True or False", "Listen & Complete"] },
      { name: "Understand Sentences",    xp: 20, activities: ["Listen & Answer", "Listen & Follow Instructions", "Listen & Draw", "Listen & Correct"] },
      { name: "Understand Stories",      xp: 25, activities: ["Listen to the Story", "Listen & Answer", "Listen & Explain", "Listen & Reflect"] },
      { name: "Understand Dialogues",    xp: 30, activities: ["Listen to the Dialogue", "Listen & Answer", "Listen & Sequence", "Listen & Choose", "Listen & Infer"] }
    ]
  },
  speaking: {
    title: "Speaking Journey",
    howItWorks: "Listen · Think · Speak · Earn XP",
    levels: [
      { name: "Imitate",   xp: 10, activities: ["Listen & Repeat Words", "Listen & Repeat Phrases", "Listen & Repeat Sentences"] },
      { name: "Reproduce", xp: 15, activities: ["Listen & Repeat Dialogue", "Repeat the Phrases", "Describe the Picture"] },
      { name: "Respond",   xp: 20, activities: ["Answer the Question", "Ask & Answer", "Role-play the Dialogue"] },
      { name: "Create",    xp: 25, activities: ["Tell Your Story", "Interview a Friend", "Present Your Idea"] }
    ]
  },
  writing: {
    title: "Writing Journey",
    howItWorks: "Complete · Build · Write · Create · Earn XP",
    levels: [
      { name: "Complete",      xp: 10, activities: ["Complete the Words", "Complete the Sentences", "Look at the Pictures and Write", "Put the Words in Order"] },
      { name: "Build",         xp: 15, activities: ["Unscramble the Sentences", "Combine the Sentences", "Use the Words", "Describe the Picture"] },
      { name: "Guided Writing", xp: 20, activities: ["Answer the Questions", "Write 2 Sentences", "What Happened Next?", "Describe the Character"] },
      { name: "Free Writing",  xp: 25, activities: ["Write a Short Story", "Opinions and Ideas", "Write a Letter", "Draw and Write"] }
    ]
  },
  vocabulary: {
    title: "Vocabulary Journey",
    howItWorks: "Quizlet-style modes: Flashcards · Match & Learn · Spell",
    modes: [
      { id: "flashcards", name: "Flashcards",    icon: "🃏", desc: "Flip cards to learn each word (word ↔ meaning)." },
      { id: "match",      name: "Match & Learn", icon: "🧠", desc: "Drag or tap pairs: match each word with its meaning before the timer ends." },
      { id: "spell",      name: "Spell",         icon: "⌨️", desc: "Listen to the word and type it correctly." }
    ]
  },
  grammar: {
    title: "Grammar Journey",
    howItWorks: "Notice · Practice · Build · Use · Earn XP",
    levels: [
      { name: "Notice",  xp: 10, activities: ["Find the Pattern", "Spot the Example", "Sort the Words", "Label the Parts"] },
      { name: "Practice", xp: 15, activities: ["Choose the Form", "Right or Wrong?", "Complete the Rule", "Match the Halves"] },
      { name: "Build",   xp: 20, activities: ["Build the Sentence", "Transform It", "Fix the Error", "Complete the Text"] },
      { name: "Use",     xp: 25, activities: ["Use It Yourself", "Ask & Answer", "Mini Dialogue", "Grammar in Action"] }
    ]
  }
};

// ---------------------------------------------------------------------------
// ENTREPRENEURSHIP: one project per level (13), all based on the
// Business Model Canvas (BMC). The canvas grows with the level:
// mini-canvas (kids) -> 5 blocks -> full 9-block canvas + pitch (C1).
// ---------------------------------------------------------------------------
const BMC_BLOCKS = [
  "Key Partners", "Key Activities", "Key Resources", "Value Proposition",
  "Customer Relationships", "Channels", "Customer Segments", "Cost Structure", "Revenue Streams"
];

const PROJECTS = {
  l1:  { title: "My Classroom Store",                scope: "Mini-canvas (3 blocks)", blocks: ["Customer Segments", "Value Proposition", "Channels"],        desc: "Identify what classmates need, offer it, and show it to customers." },
  l2:  { title: "Toy Exchange Market",               scope: "Mini-canvas (4 blocks)", blocks: ["Customer Segments", "Value Proposition", "Channels", "Customer Relationships"], desc: "Organize a market where friends exchange toys fairly." },
  l3:  { title: "Healthy Snack Stand",              scope: "Mini-canvas (5 blocks)", blocks: ["Customer Segments", "Value Proposition", "Channels", "Cost Structure", "Revenue Streams"], desc: "Design and cost a healthy snack for the school break." },
  l4:  { title: "Recycling Heroes Service",         scope: "Mini-canvas (5 blocks)", blocks: ["Customer Segments", "Value Proposition", "Key Activities", "Channels", "Customer Relationships"], desc: "Offer a recycling service that helps the school community." },
  l5:  { title: "School Garden Produce",            scope: "Mini-canvas (6 blocks)", blocks: ["Customer Segments", "Value Proposition", "Key Activities", "Key Resources", "Cost Structure", "Revenue Streams"], desc: "Grow and sell garden produce; plan costs and income." },
  l6:  { title: "Pet Care Helpers",                 scope: "Mini-canvas (6 blocks)", blocks: ["Customer Segments", "Value Proposition", "Key Activities", "Channels", "Customer Relationships", "Revenue Streams"], desc: "Design a pet-care helper service for the neighborhood." },
  l7:  { title: "Community Fair Event",             scope: "Mini-canvas (7 blocks)", blocks: ["Customer Segments", "Value Proposition", "Key Activities", "Key Resources", "Channels", "Cost Structure", "Revenue Streams"], desc: "Plan a school fair: partners, activities, costs and income." },
  l8:  { title: "Upcycled Product Line",            scope: "Mini-canvas (7 blocks)", blocks: ["Customer Segments", "Value Proposition", "Key Activities", "Key Resources", "Channels", "Customer Relationships", "Revenue Streams"], desc: "Create products from recycled materials and define the business." },
  l9:  { title: "Digital Content Channel",          scope: "Full canvas (9 blocks)", blocks: BMC_BLOCKS, desc: "Design an educational content channel and map all nine blocks." },
  l10: { title: "Startup Pitch Idea",               scope: "Full canvas (9 blocks)", blocks: BMC_BLOCKS, desc: "Develop a startup idea, complete the canvas and prepare a short pitch." },
  l11: { title: "Social Enterprise",                scope: "Full canvas (9 blocks)", blocks: BMC_BLOCKS, desc: "Design a social enterprise: value for people and planet, with a canvas." },
  l12: { title: "Innovation Startup",               scope: "Full canvas (9 blocks)", blocks: BMC_BLOCKS, desc: "Build a startup around an innovation; validate assumptions with the canvas." },
  l13: { title: "Full Canvas + Investor Pitch",    scope: "Full canvas + pitch",    blocks: BMC_BLOCKS, desc: "Complete a full Business Model Canvas and deliver an investor pitch in English (C1 level)." }
};

// Lessons that already have full content (updated as content is added).
const READY_LESSONS = {
  "l1|2|1": { note: "Full content available" },
  "l5|1|1": { note: "Full content available" }
};

// ---------------------------------------------------------------------------
// ACTIVITY CONTENT SCHEMA (filled later, day by day).
// Key: "level|unit|day|skill|journeyLevel|activityIndex"
// Value: one object per engine type:
//   { type:"pairs",  items:[["word","meaning"],...] }
//   { type:"choice", items:[{q:"...",options:["..."],answer:0}] }
//   { type:"order",  items:[{prompt:"...",correct:["first","second",...]}] }
//   { type:"blanks", items:[{sentence:"There is ___ noise in the ___.", bank:["a","the"],answers:["a","the"]}] }
//   { type:"text",   items:[{prompt:"...",example:"..."}] }
//   { type:"tts",    items:[{say:"...",hint:"..."}] }        // listen & repeat
//   { type:"spell",  items:[["word","audio-text"]] }
//   { type:"bmc",    blocks:{...} }                          // project canvas
const CONTENT = {
  // LEVEL 1 · UNIT 1 "Hello, friends!" · DAY 1 "Discover" · VOCABULARY
  // Flashcard set name: "Discover" — used by all 3 modes (Flashcards, Match & Learn, Spell)
  "l1|1|1|words": {
    set: "Discover",
    note: "Tap the cards, listen and repeat. The browser reads every word for you.",
    items: [
      ["hello",     "the word we say when we meet someone"],
      ["hi",        "a short, friendly way to say hello"],
      ["friend",    "a person you like and play with"],
      ["name",      "what people call you"],
      ["teacher",   "a person who helps you learn"],
      ["student",   "a person who learns at school"],
      ["classmate", "a student who is in your class"],
      ["happy",     "when you feel very good and smile"]
    ]
  }
};

window.CURRICULUM = { LEVELS, DAY_STRUCTURE, SKILL_AREAS, SKILL_JOURNEYS, PROJECTS, BMC_BLOCKS, READY_LESSONS, CONTENT };
