// Bitongue Adventures — app logic: selector + interactive activity engines.
// Static site: all progress and answers are stored in localStorage.
const LS_KEY="bitongue.v1";
const store={ load(){try{return JSON.parse(localStorage.getItem(LS_KEY))||{}}catch(e){return{}}},
  save(d){try{localStorage.setItem(LS_KEY,JSON.stringify(d))}catch(e){}} };
const data=store.load();
data.xp=data.xp||0; data.done=data.done||{}; data.canvas=data.canvas||{};
function saveAll(){store.save(data)}
function markDone(k,xp){ if(data.done[k])return false; data.done[k]=true; data.xp+=xp; saveAll(); refreshXP(); return true; }
function refreshXP(){ $("#xp").textContent=data.xp; $("#status").textContent="Saved locally"; setTimeout(function(){$("#status").textContent="Ready"},1500); }

const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
function openTab(id){$$(".tab").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active");$$(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.tab===id));window.scrollTo({top:0,behavior:"smooth"});}
$$(".nav-item").forEach(b=>b.addEventListener("click",()=>openTab(b.dataset.tab)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>openTab(b.dataset.go)));
function award(skill,amount){ const k="skill:"+skill+":"+(pathState.level||"")+"|"+(pathState.unit||"")+"|"+(pathState.day||""); if(!markDone(k,amount))return; }
function speak(text,rate){ try{ const u=new SpeechSynthesisUtterance(text); u.lang="en-US"; u.rate=rate||0.9; speechSynthesis.cancel(); speechSynthesis.speak(u); }catch(e){} }

// ---------------------------------------------------------------------------
// CURRICULUM-DRIVEN SELECTOR
// ---------------------------------------------------------------------------
const C=window.CURRICULUM;
const pathState={level:null,unit:null,day:null};
const $id=id=>document.getElementById(id);
const tilePalette=["tile-blue","tile-teal","tile-pink","tile-yellow"];
const pad=n=>String(n).padStart(2,"0");
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
function levelLabel(lv){return "Level "+lv.num+" · "+lv.cefr}

function renderGrades(){
  $id("gradeTiles").innerHTML=C.LEVELS.map(function(lv,i){
    return '<button class="choice-tile grade-tile '+tilePalette[i%tilePalette.length]+'" data-level="'+lv.id+'">'+
      '<span class="tile-icon"><i class="fa-solid '+(lv.num<=7?"fa-rocket":(lv.num<=11?"fa-star":"fa-crown"))+'"></i></span>'+
      '<span class="tile-kicker">'+lv.series.toUpperCase()+'</span>'+
      '<strong>Level '+lv.num+'</strong><small>'+lv.cefr+'</small>'+
      '<span class="tile-arrow"><i class="fa-solid fa-arrow-right"></i></span></button>';
  }).join("");
  $id("gradeTiles").querySelectorAll("[data-level]").forEach(function(b){
    b.onclick=function(){pathState.level=b.dataset.level;pathState.unit=null;renderUnits();showStage("unit")};
  });
}
function currentLevel(){return C.LEVELS.find(l=>l.id===pathState.level)}
function lessonKey(){return pathState.level+"|"+pathState.unit+"|"+pathState.day; }
function renderUnits(){
  const lv=currentLevel();
  $id("unitSubtitle").textContent=levelLabel(lv)+" · "+lv.series+" · choose a unit";
  $id("unitTiles").innerHTML=lv.units.map(function(u,i){
    return '<button class="choice-tile unit-tile tile-teal" data-unit="'+(i+1)+'">'+
      '<span class="tile-icon"><i class="fa-solid fa-book-open"></i></span>'+
      '<span class="tile-kicker">UNIT '+pad(i+1)+'</span>'+
      '<strong>'+u[0]+'</strong><small>Grammar: '+u[1]+'</small>'+
      '<span class="tile-arrow"><i class="fa-solid fa-arrow-right"></i></span></button>';
  }).join("");
  $id("unitTiles").querySelectorAll("[data-unit]").forEach(function(b){
    b.onclick=function(){pathState.unit=Number(b.dataset.unit);renderDays();showStage("day")};
  });
}
function renderDays(){
  const lv=currentLevel();
  $id("daySubtitle").textContent=levelLabel(lv)+" · Unit "+pathState.unit+" · "+lv.units[pathState.unit-1][0];
  $id("dayTiles").innerHTML=C.DAY_STRUCTURE.map(function(d){
    return '<button class="choice-tile day-tile tile-yellow" data-day="'+d.n+'">'+
      '<span class="tile-icon"><i class="fa-solid '+d.icon+'"></i></span>'+
      '<span class="tile-kicker">DAY '+pad(d.n)+'</span>'+
      '<strong>'+d.name+'</strong><small>'+d.focus+'</small>'+
      '<span class="tile-arrow"><i class="fa-solid fa-arrow-right"></i></span></button>';
  }).join("");
  $id("dayTiles").querySelectorAll("[data-day]").forEach(function(b){
    b.onclick=function(){launchLesson(Number(b.dataset.day))};
  });
}
function showStage(name){
  ['grade','unit','day'].forEach(n=>$id(n+'Stage').classList.toggle('hidden',n!==name));
  ['grade','unit','day'].forEach((n,i)=>$id('dot'+n[0].toUpperCase()+n.slice(1)).classList.toggle('active',['grade','unit','day'].indexOf(name)>=i));
  const labels={grade:'STEP 1 OF 3 · CHOOSE YOUR LEVEL',unit:'STEP 2 OF 3 · CHOOSE YOUR UNIT',day:'STEP 3 OF 3 · CHOOSE YOUR DAY'};
  $id('progressLabel').textContent=labels[name];
  window.scrollTo({top:0,behavior:'smooth'});
}

// ---------------------------------------------------------------------------
// ACTIVITY ENGINES — all render inside a modal, driven by CONTENT.
// ---------------------------------------------------------------------------
const modal={ open(html){ $id("modalBody").innerHTML=html; $id("activityModal").classList.remove("hidden"); },
  close(){ $id("activityModal").classList.add("hidden"); } };
$id("modalClose").onclick=modal.close;

function findContent(skillId){ return C.CONTENT[lessonKey()+"|"+skillId] || C.CONTENT[pathState.level+"|"+pathState.unit+"|"+pathState.day+"|"+skillId] || null; }

// ENGINE: pairs (Match & Learn / Picture Match / Word Discovery)
function enginePairs(c){
  let first=null, matched=0, total=c.items.length;
  const tiles=[];
  c.items.forEach(function(pair,i){ tiles.push({t:pair[0],p:i}); tiles.push({t:pair[1],p:i}); });
  tiles.sort(function(){return Math.random()-0.5});
  modal.open('<div class="activity-panel"><h3>🧠 Match & Learn</h3>'+
    '<p class="feedback" id="pairsMsg">Tap a word, then tap its meaning.</p>'+
    '<p><span class="badge">⏱️ <b id="pairsTimer">'+(total*10)+'</b>s</span></p>'+
    '<div class="match-grid" id="pairsGrid">'+tiles.map(function(t,i){
      return '<button class="match-card" data-p="'+t.p+'" data-i="'+i+'">'+esc(t.t)+'</button>';
    }).join("")+'</div>'+
    '<button class="outline" id="pairsClose">Finish</button></div>');
  let timeLeft=total*10, finished=false;
  const timer=setInterval(function(){
    if(finished)return;
    timeLeft--; const tEl=$id("pairsTimer"); if(tEl)tEl.textContent=timeLeft;
    if(timeLeft<=0){ finished=true; clearInterval(timer);
      const m=$id("pairsMsg"); if(m)m.textContent="⏰ Time's up! You matched "+matched+"/"+total+" pairs. Try again to beat the clock!";
      $("#pairsGrid .match-card").forEach(function(b){b.disabled=true}); }
  },1000);
  $("#pairsGrid .match-card").forEach(function(b){
    b.onclick=function(){
      if(b.classList.contains("selected")){ b.classList.remove("selected"); if(first===b)first=null; return; }
      if(!first){ first=b; b.classList.add("selected"); return; }
      if(first.dataset.p===b.dataset.p && first!==b){
        first.disabled=true; b.disabled=true; first.classList.remove("selected"); first.classList.add("ok"); b.classList.add("ok");
        matched++; speak(b.textContent);
        if(matched===total){ finished=true; clearInterval(timer);
          $("#pairsMsg").textContent="🎉 All matched in "+(total*10-timeLeft)+"s! Well done!"; markDone(lessonKey()+"|pairs",15); }
      } else { first.classList.remove("selected"); first=null; }
    };
  });
  $("#pairsClose").onclick=function(){ finished=true; clearInterval(timer); modal.close(); };
}

// ENGINE: choice (Multiple Choice, True/False, Listen & Choose, ...)
function engineChoice(c){
  let right=0, answered=0;
  modal.open('<div class="activity-panel"><h3>✅ Choose the best answer</h3><div id="choiceList">'+
    c.items.map(function(it,qi){
      return '<div class="question"><b>'+(qi+1)+'. '+esc(it.q)+'</b>'+
        (it.audio?'<button class="outline listen-btn" data-say="'+esc(it.audio)+'">🔊 Listen</button>':'')+
        '<div class="path-grid">'+it.options.map(function(o,oi){
          return '<button class="cta choice-opt" data-q="'+qi+'" data-o="'+oi+'">'+esc(o)+'</button>';
        }).join("")+'</div><small class="feedback" id="fb'+qi+'"></small></div>';
    }).join("")+'</div><button class="outline" id="choiceClose">Finish</button></div>');
  $$(".choice-opt").forEach(function(b){
    b.onclick=function(){
      const qi=+b.dataset.q, oi=+b.dataset.o, it=c.items[qi];
      $$('.choice-opt[data-q="'+qi+'"]').forEach(function(x){x.disabled=true});
      if(oi===it.answer){ right++; $("#fb"+qi).textContent="✓ Correct!"; }
      else $("#fb"+qi).textContent="✗ Try again later. Correct: "+esc(it.options[it.answer]);
      answered++;
      if(answered===c.items.length){ $("#choiceList").insertAdjacentHTML("beforeend",'<p class="feedback">Score: '+right+'/'+c.items.length+'</p>'); markDone(lessonKey()+"|choice",10+right*2); }
    };
  });
  $$(".listen-btn").forEach(function(b){ b.onclick=function(){ speak(b.dataset.say) }; });
  $("#choiceClose").onclick=modal.close;
}

// ENGINE: order (Order the Events, Build the Sentence, Listen & Order)
function engineOrder(c){
  modal.open('<div class="activity-panel"><h3>🔢 Put in order</h3><div id="orderList">'+
    c.items.map(function(it,qi){
      const shuffled=it.correct.slice().sort(function(){return Math.random()-0.5});
      return '<div class="question"><b>'+esc(it.prompt||"Put in the correct order:")+'</b>'+
        '<div class="match-grid">'+shuffled.map(function(w,wi){
          return '<button class="match-card order-word" data-q="'+qi+'" data-w="'+esc(w)+'">'+esc(w)+'</button>';
        }).join("")+'</div>'+
        '<div class="writing-levels"><article><b>Your order</b><div id="ordered'+qi+'"></div></article></div>'+
        '<button class="cta check-order" data-q="'+qi+'">Check</button><small class="feedback" id="ofb'+qi+'"></small></div>';
    }).join("")+'</div><button class="outline" id="orderClose">Finish</button></div>');
  $$(".order-word").forEach(function(b){
    b.onclick=function(){ const q=b.dataset.q; const holder=$("#ordered"+q); 
      holder.insertAdjacentHTML("beforeend",'<span class="badge">'+esc(b.dataset.w)+'</span> ');
      b.disabled=true; speak(b.dataset.w); };
  });
  $$(".check-order").forEach(function(b){
    b.onclick=function(){ const qi=+b.dataset.q;
      const given=[...$("#ordered"+qi).querySelectorAll(".badge")].map(function(x){return x.textContent.trim()});
      const ok=given.length===c.items[qi].correct.length && given.every(function(w,i){return w===c.items[qi].correct[i]});
      $("#ofb"+qi).textContent=ok?"✓ Perfect order!":"✗ Keep trying. Listen again if needed.";
      if(ok) markDone(lessonKey()+"|order"+qi,10);
    };
  });
  $("#orderClose").onclick=modal.close;
}

// ENGINE: blanks (Complete the words / sentences)
function engineBlanks(c){
  modal.open('<div class="activity-panel"><h3>✍️ Complete the sentences</h3>'+
    '<div class="match-grid" id="bank">'+[...new Set(c.items.reduce(function(a,it){return a.concat(it.bank||it.answers)},[]))].sort().map(function(w){
      return '<button class="match-card bank-word">'+esc(w)+'</button>'; }).join("")+'</div>'+
    c.items.map(function(it,qi){
      return '<div class="question"><b>'+esc(it.sentence.replace(/___/g,"______"))+'</b>'+
        '<input name="blank'+qi+'" placeholder="Type the missing word"><small class="feedback" id="bfb'+qi+'"></small></div>';
    }).join("")+
    '<button class="cta" id="blanksCheck">Check</button><button class="outline" id="blanksClose">Finish</button></div>');
  let picked=null;
  $$(".bank-word").forEach(function(b){ b.onclick=function(){ picked=b; speak(b.textContent); }; });
  $$('#bank').addEventListener("click",function(){});
  c.items.forEach(function(it,qi){ const inp=$('input[name="blank'+qi+'"]');
    inp.addEventListener("focus",function(){ if(picked){ inp.value=picked.textContent; picked=null; } }); });
  $("#blanksCheck").onclick=function(){
    let right=0;
    c.items.forEach(function(it,qi){ const v=$('input[name="blank'+qi+'"]').value.trim().toLowerCase();
      const ok=v===it.answers[qi===0?0:0]; if(ok)right++; $("#bfb"+qi).textContent=ok?"✓":"✗"; });
    markDone(lessonKey()+"|blanks",10);
  };
  $("#blanksClose").onclick=modal.close;
}

// ENGINE: text (Guided/Free writing, reflections)
function engineText(c){
  modal.open('<div class="activity-panel"><h3>📝 Write your answer</h3>'+
    c.items.map(function(it,qi){
      return '<div class="question"><b>'+esc(it.prompt)+'</b>'+
        '<textarea id="tx'+qi+'" placeholder="Write here..."></textarea>'+
        (it.example?'<small>Example: '+esc(it.example)+'</small>':'')+
        '<button class="cta save-text" data-q="'+qi+'">Save</button><small class="feedback" id="tfb'+qi+'"></small></div>';
    }).join("")+'<button class="outline" id="textClose">Finish</button></div>');
  $$(".save-text").forEach(function(b){ b.onclick=function(){
    const qi=+b.dataset.q; const v=$("#tx"+qi).value.trim();
    data.canvas[lessonKey()+"|text"+qi]=v; saveAll();
    $("#tfb"+qi).textContent=v?("✓ Saved locally ("+v.split(/\s+/).length+" words)"):"Write something first!";
    if(v) markDone(lessonKey()+"|text"+qi,10);
  }; });
  $("#textClose").onclick=modal.close;
}

// ENGINE: tts (Listen & Repeat — Speaking journey)
function engineTTS(c){
  modal.open('<div class="activity-panel"><h3>🎤 Listen & Repeat</h3>'+
    '<p class="project-note">Tap 🔊 to listen, then record yourself with the mic button (your browser will ask for permission). Everything stays on your device.</p>'+
    c.items.map(function(it,qi){
      return '<div class="question"><b>Phrase '+(qi+1)+'</b>'+
        '<button class="outline listen-btn" data-say="'+esc(it.say)+'">🔊 Listen</button>'+
        (it.hint?'<small>Hint: '+esc(it.hint)+'</small>':'')+
        '<div><button class="cta mic-btn" data-q="'+qi+'" data-say="'+esc(it.say)+'">🎙️ Record & Check</button>'+
        '<small class="feedback" id="mfb'+qi+'"></small></div></div>';
    }).join("")+'<button class="outline" id="ttsClose">Finish</button></div>');
  $$(".listen-btn").forEach(function(b){ b.onclick=function(){ speak(b.dataset.say,0.8) }; });
  $$(".mic-btn").forEach(function(b){ b.onclick=function(){
    const qi=+b.dataset.q, target=b.dataset.say;
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){ speak(target); $("#mfb"+qi).textContent="Mic not supported here — listen and repeat out loud, then tap again to mark done."; markDone(lessonKey()+"|tts"+qi,10); return; }
    try{ const r=new SR(); r.lang="en-US"; r.interimResults=false;
      $("#mfb"+qi).textContent="🎙️ Listening... say it now!";
      r.onresult=function(e){ const said=e.results[0][0].transcript.toLowerCase().replace(/[^a-z' ]/g,"").trim();
        const tgt=target.toLowerCase().replace(/[^a-z' ]/g,"").trim();
        const sim=similarity(said,tgt);
        $("#mfb"+qi).textContent = sim>0.7 ? "✓ Great pronunciation! ("+said+")" : "Almost! You said: "+said+". Listen and try again.";
        if(sim>0.7) markDone(lessonKey()+"|tts"+qi,10); };
      r.onerror=function(){ $("#mfb"+qi).textContent="Mic error. Listen and repeat out loud."; };
      r.start();
    }catch(e){ $("#mfb"+qi).textContent="Mic not available. Repeat out loud and mark done."; }
  }; });
  $("#ttsClose").onclick=modal.close;
}
function similarity(a,b){ const t=a+" "+b; if(a===b)return 1;
  const pa=a.split(" "),pb=b.split(" "); let m=0; pa.forEach(function(w){ if(pb.indexOf(w)>=0)m++; });
  return m/Math.max(pa.length,pb.length,1); }

// ENGINE: spell (Vocabulary Spell mode)
function engineSpell(c){
  let idx=0;
  function render(){
    const it=c.items[idx];
    modal.open('<div class="activity-panel"><h3>⌨️ Spell the word</h3>'+
      '<p>Word '+(idx+1)+' of '+c.items.length+'</p>'+
      '<button class="cta" id="spellPlay">🔊 Listen</button>'+
      '<input id="spellInput" placeholder="Type the word you hear">'+
      '<button class="cta" id="spellCheck">Check</button>'+
      '<small class="feedback" id="spellFb"></small>'+
      '<button class="outline" id="spellNext" style="display:none">Next word →</button></div>');
    $("#spellPlay").onclick=function(){ speak(it[0],0.7); };
    $("#spellCheck").onclick=function(){
      const v=$("#spellInput").value.trim().toLowerCase();
      if(v===it[0].toLowerCase()){ $("#spellFb").textContent="✓ Correct!"; markDone(lessonKey()+"|spell"+idx,10);
        $("#spellNext").style.display="inline-block"; }
      else { $("#spellFb").textContent="✗ Try again. Listen once more."; speak(it[0],0.6); }
    };
    $("#spellNext").onclick=function(){ idx++; idx<c.items.length?render():modal.close(); };
  }
  render();
}

// ENGINE: flashcards
function engineFlash(c){
  let i=0, flipped=false;
  function render(){
    flipped=false; const it=c.items[i];
    modal.open('<div class="activity-panel"><h3>🃏 Flashcards</h3>'+
      '<button class="cta" id="flipCard">'+esc(it[0])+'</button>'+
      '<small class="feedback" id="cardFb">Tap the card to see the meaning</small>'+
      '<div><button class="outline" id="prevCard">←</button> <span class="badge">'+(i+1)+'/'+c.items.length+'</span> <button class="outline" id="nextCard">→</button></div></div>');
    $("#flipCard").onclick=function(){ flipped=!flipped;
      $("#flipCard").textContent=flipped?it[1]:it[0]; if(flipped)speak(it[0]); };
    $("#prevCard").onclick=function(){ i=(i-1+c.items.length)%c.items.length; render(); };
    $("#nextCard").onclick=function(){ i=(i+1)%c.items.length; render(); };
  }
  render();
}

const ENGINES={ pairs:enginePairs, choice:engineChoice, order:engineOrder, blanks:engineBlanks,
  text:engineText, tts:engineTTS, spell:engineSpell, flashcards:engineFlash };

function openActivity(skillId, modeId){
  if(skillId==="vocabulary"){
    const bank=C.CONTENT[lessonKey()+"|words"]||C.CONTENT[pathState.level+"|"+pathState.unit+"|"+pathState.day+"|words"]||null;
    if(!bank){ modal.open('<div class="activity-panel"><h3>🚧 Vocabulary coming soon</h3>'+
      '<p>The word set for Level '+currentLevel().num+' · Unit '+pathState.unit+' · Day '+pathState.day+' will be added to the content file, and all 3 modes (Flashcards, Match &amp; Learn, Spell) will work instantly.</p></div>'); return; }
    const c={ items: bank.items };
    if(modeId==="flashcards") engineFlash(c);
    else if(modeId==="match") enginePairs(c);
    else if(modeId==="spell") engineSpell(c);
    else modal.open('<div class="activity-panel"><h3>🚧 Mode not found</h3></div>');
    return;
  }
  const c=findContent(skillId);
  if(c && ENGINES[c.type]){ ENGINES[c.type](c); }
  else modal.open('<div class="activity-panel"><h3>🚧 Activity coming soon</h3>'+
    '<p>This activity engine is ready. The specific content for <b>'+esc(skillId)+'</b> (Level '+currentLevel().num+' · Unit '+pathState.unit+' · Day '+pathState.day+') will be added to the content file, and it will work instantly here.</p>'+
    '<p class="project-note">All engines are active: pairs, choice, order, blanks, text, listen &amp; repeat (TTS + mic), spell and flashcards.</p></div>');
}

// ---------------------------------------------------------------------------
// JOURNEY RENDERERS
// ---------------------------------------------------------------------------
function activityCard(actName, skillId, lvlIdx, actIdx, xp){
  const key=lessonKey()+"|"+skillId+"|"+lvlIdx+"|"+actIdx;
  const done=data.done[key]?'<span class="badge" style="color:#0a7">✓ Done</span>':'<span class="badge">+'+xp+' XP</span>';
  return '<div class="grammar-card"><h4>'+esc(actName)+'</h4>'+done+
    '<button class="outline journey-act" data-skill="'+skillId+'" data-act="'+esc(actName)+'" data-lvl="'+lvlIdx+'">Open</button></div>';
}

function renderJourney(skillId, containerId){
  const j=C.SKILL_JOURNEYS[skillId]; if(!j)return;
  const el=$id(containerId);
  el.innerHTML='<p class="project-note">How it works: '+esc(j.howItWorks)+'</p>'+
    j.levels.map(function(lvl,li){
      return '<article><span>LEVEL '+(li+1)+' · '+esc(lvl.name)+'</span><h3>'+esc(lvl.name)+'</h3>'+
        '<div class="grammar-grid">'+lvl.activities.map(function(a,ai){return activityCard(a,skillId,li,ai,lvl.xp)}).join("")+'</div>'+
        '<small class="feedback">Level reward: +'+lvl.xp+' XP</small></article>';
    }).join("");
  el.querySelectorAll(".journey-act").forEach(function(b){
    b.onclick=function(){ openActivity(skillId, b.dataset.act); };
  });
}

function renderVocabulary(){
  const v=C.SKILL_JOURNEYS.vocabulary;
  const bank=C.CONTENT[lessonKey()+"|words"]||C.CONTENT[pathState.level+"|"+pathState.unit+"|"+pathState.day+"|words"]||null;
  const setInfo=bank?('<div class="activity-panel"><h3>🃏 Set: '+esc(bank.set||"Words of the day")+'</h3>'+
    '<p>'+esc(bank.items.length)+' words · '+esc(bank.note||"")+'</p>'+
    '<p class="project-note">🔊 Audio included: your browser reads every word aloud (TTS). No recordings needed.</p></div>')
    :'<div class="activity-panel"><h3>🚧 Word set coming soon</h3><p>The set for this day will be added to the content file.</p></div>';
  $id("vocabModeTabs").innerHTML=v.modes.map(function(m,i){
    return '<button class="nav-item'+(i===0?" active":"")+'" data-mode="'+m.id+'">'+m.icon+' <span>'+esc(m.name)+'</span></button>';
  }).join("");
  function showMode(m){
    $id("vocabModeBody").innerHTML=setInfo+
      '<div class="activity-panel"><h3>'+m.icon+' '+esc(m.name)+'</h3><p>'+esc(m.desc)+'</p>'+
      (bank?'<button class="cta" id="startMode">Start '+esc(m.name)+'</button>':'')+'<p class="feedback" id="modeFb"></p></div>';
    if(bank) $("#startMode").onclick=function(){ openActivity("vocabulary", m.id); };
  }
  $id("vocabModeTabs").querySelectorAll("[data-mode]").forEach(function(b){
    b.onclick=function(){ $id("vocabModeTabs").querySelectorAll("[data-mode]").forEach(function(x){x.classList.remove("active")});
      b.classList.add("active"); showMode(v.modes.find(function(m){return m.id===b.dataset.mode})); };
  });
  showMode(v.modes[0]);
}

// Embed slot: the teacher can paste an iframe / embed code (e.g. audio, video,
// Quizlet) for this specific day. Saved locally per lesson.
function renderVocabEmbed(){
  const key="embed:"+lessonKey();
  const saved=data.canvas[key]||"";
  $id("vocabEmbed").value=saved;
  function show(html){
    const host=$id("embedHost");
    host.innerHTML=html?"":'<p class="project-note">Nothing embedded yet for this day. Paste an iframe or embed code below (YouTube, SoundCloud, Quizlet, your own audio player...) and press "Show my embed". It is saved on this device only.</p>';
    if(html){
      if(/^https?:\/\/\S+$/i.test(html.trim())) host.innerHTML='<iframe src="'+esc(html.trim())+'" style="width:100%;height:360px;border:0;border-radius:16px" allowfullscreen></iframe>';
      else host.innerHTML=html;
    }
  }
  show(saved);
  $id("embedSave").onclick=function(){
    const v=$id("vocabEmbed").value.trim();
    data.canvas[key]=v; saveAll(); show(v);
    $id("embedSaved").textContent="✓ Embed saved locally for this day";
  };
}

function renderProject(){
  const lv=currentLevel(); const p=C.PROJECTS[lv.id];
  $id("projectLevelInfo").innerHTML='<h3>🚀 '+esc(p.title)+'</h3><p>'+esc(p.desc)+'</p>'+
    '<span class="badge">Base: Business Model Canvas · '+esc(p.scope)+'</span>';
  const saved=data.canvas["bmc:"+lv.id]||{};
  $id("bmcGrid").innerHTML=p.blocks.map(function(bl){
    return '<article class="grammar-card"><span>'+esc(bl)+'</span><h4>'+esc(bl)+'</h4>'+
      '<textarea data-bmc="'+esc(bl)+'" placeholder="Write your ideas for this block...">'+esc(saved[bl]||"")+'</textarea></article>';
  }).join("");
  $id("bmcSave").onclick=function(){
    const obj={}; $$("#bmcGrid textarea").forEach(function(t){ obj[t.dataset.bmc]=t.value; });
    data.canvas["bmc:"+lv.id]=obj; saveAll();
    $id("bmcSaved").textContent="✓ Canvas saved locally on this device";
    markDone(lessonKey()+"|bmc",15);
  };
}

// ---------------------------------------------------------------------------
// LAUNCH LESSON
// ---------------------------------------------------------------------------
function launchLesson(day){
  pathState.day=day;
  const lv=currentLevel(),u=lv.units[pathState.unit-1];
  const key=lv.id+"|"+pathState.unit+"|"+day;
  $id('selectorPortal').classList.add('hidden');
  $id('learningApp').classList.remove('hidden');
  $id('selectedPathLabel').textContent="Level "+lv.num+" ("+lv.cefr+") · Unit "+pathState.unit+": "+u[0]+" · Day "+day+": "+C.DAY_STRUCTURE[day-1].name;
  const select=$id('levelSelect');
  select.innerHTML=C.LEVELS.map(function(l){return '<option value="'+l.id+'"'+(l.id===lv.id?" selected":"")+'>Level '+l.num+' · '+l.cefr+'</option>'}).join("");
  select.onchange=function(){ pathState.level=select.value;pathState.unit=null;pathState.day=null;
    $id('learningApp').classList.add('hidden');$id('selectorPortal').classList.remove('hidden');showStage('grade'); };
  $id("dayPlanInfo").innerHTML="<b>"+u[0]+"</b> — Grammar focus: <b>"+u[1]+"</b> · Today: <b>"+C.DAY_STRUCTURE[day-1].name+"</b> ("+C.DAY_STRUCTURE[day-1].focus+")";
  $id("grammarFocusLabel").textContent=u[1];
  renderJourney("reading","readingJourney");
  renderJourney("listening","listeningJourney");
  renderJourney("speaking","speakingJourney");
  renderJourney("writing","writingJourney");
  renderJourney("grammar","grammarJourney");
  renderVocabulary();
  renderVocabEmbed();
  renderProject();
  refreshXP();
  openTab('home');
}

// Legacy reading check (supplied worksheets)
const readingData={
healthy:[
["What is Daniel's favorite subject?","Math and science"],
["Where does he play soccer?","At the playground"],
["How often does he go to the gym?","Twice a week"],
["What does he do to eat healthily?","He eats fruits and vegetables and drinks water."],
["What does a healthy lifestyle help him to do?","Be happy, learn better and achieve his dreams."]
],
special:[
["Where is Emma?","In the classroom"],
["What does she put on the desk?","Her schoolbag"],
["Where do they go after class?","To the library"],
["What does Emma eat for lunch?","An apple"],
["How does Emma feel at the end?","Happy"]
]};
let activeReading="healthy";
$$(".readBtn").forEach(function(b){
  b.onclick=function(){
    activeReading=b.dataset.reading;
    const title=activeReading==="healthy"?"A Healthy Lifestyle":"A Special Day";
    $("#readingTitle").textContent=title+" · Comprehension";
    $("#readingQuestions").innerHTML=readingData[activeReading].map(function(q,i){
      return '<div class="question"><b>'+(i+1)+'. '+q[0]+'</b><label><input name="rq'+i+'" value="'+q[1]+'"> <span>My answer</span></label><small>Tip: '+q[1]+'</small></div>';
    }).join("");
    $("#readingActivity").classList.remove("hidden");
    $("#readingActivity").scrollIntoView({behavior:"smooth"});
  };
});
$("#checkReading").onclick=function(){
  let good=0;
  readingData[activeReading].forEach(function(q,i){
    const el=$('input[name="rq'+i+'"]'); const v=el?el.value.trim().toLowerCase():"";
    if(v&&v===q[1].toLowerCase())good++;
  });
  $("#readingFeedback").textContent="You matched "+good+"/"+readingData[activeReading].length+" model answers.";
  if(good>=3)markDone(lessonKey()+"|legacyread",10);
};

$$(".complete").forEach(function(b){ b.onclick=function(){ markDone(lessonKey()+"|"+(b.dataset.skill||"x"),10); }; });

$$('[data-back]').forEach(b=>b.addEventListener('click',()=>showStage(b.dataset.back)));
$id('returnToMenu').addEventListener('click',function(){
  $id('learningApp').classList.add('hidden');
  $id('selectorPortal').classList.remove('hidden');
  showStage(pathState.day?'day':pathState.unit?'unit':'grade');
});

renderGrades();
showStage('grade');
refreshXP();
