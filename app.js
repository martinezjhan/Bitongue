// Bitongue Adventures — app logic (data-driven from curriculum.js)
const state={xp:0,done:{}};const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
function openTab(id){$$(".tab").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active");$$(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.tab===id));window.scrollTo({top:0,behavior:"smooth"});}
$$(".nav-item").forEach(b=>b.addEventListener("click",()=>openTab(b.dataset.tab)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>openTab(b.dataset.go)));
function award(skill,amount=10){if(state.done[skill])return;state.done[skill]=true;state.xp+=amount;$("#xp").textContent=state.xp;$("#status").textContent="+"+amount+" XP · "+skill+" completed";setTimeout(()=>$("#status").textContent="Ready",1800);}
const matchWords=["classmate","teacher","schoolbag","happy"];const matchGrid=$("#matchGrid");
matchWords.forEach((w,i)=>{const b=document.createElement("button");b.className="match-card";b.textContent=w;b.onclick=()=>b.classList.toggle("selected");matchGrid.appendChild(b)});
$("#checkMatch").onclick=()=>{const selected=$$(".match-card.selected").length;if(selected>=2){award("vocabulary");$("#matchFeedback").textContent="Good! You practiced source vocabulary."}else $("#matchFeedback").textContent="Choose at least two words and check again.";};

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
$$(".readBtn").forEach(b=>b.onclick=()=>{activeReading=b.dataset.reading;const title=activeReading==="healthy"?"A Healthy Lifestyle":"A Special Day";$("#readingTitle").textContent=title+" · Comprehension";$("#readingQuestions").innerHTML=readingData[activeReading].map((q,i)=>'<div class="question"><b>'+(i+1)+'. '+q[0]+'</b><label><input name="rq'+i+'" value="'+q[1]+'"> <span>My answer</span></label><small>Tip: '+q[1]+'</small></div>').join("");$("#readingActivity").classList.remove("hidden");$("#readingActivity").scrollIntoView({behavior:"smooth"})});
$("#checkReading").onclick=()=>{let good=0;readingData[activeReading].forEach((q,i)=>{const v=$('input[name="rq'+i+'"]')?.value.trim().toLowerCase();if(v&&v===q[1].toLowerCase())good++});$("#readingFeedback").textContent="You matched "+good+"/"+readingData[activeReading].length+" model answers.";if(good>=3)award("reading",10);};
$$(".complete").forEach(b=>b.onclick=()=>award(b.dataset.skill,10));
$$(".practice").forEach(b=>b.onclick=()=>{b.textContent="✓ Practiced";b.disabled=true;award("speaking",5)});

// ---------------------------------------------------------------------------
// CURRICULUM-DRIVEN SELECTOR: 13 levels -> 9 units -> 5 days
// ---------------------------------------------------------------------------
const C=window.CURRICULUM;
const pathState={level:null,unit:null,day:null};
const $id=id=>document.getElementById(id);
const tilePalette=["tile-blue","tile-teal","tile-pink","tile-yellow"];
const pad=n=>String(n).padStart(2,"0");
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
function launchLesson(day){
  pathState.day=day;
  const lv=currentLevel(),u=lv.units[pathState.unit-1];
  const key=lv.id+"|"+pathState.unit+"|"+day;
  $id('selectorPortal').classList.add('hidden');
  $id('learningApp').classList.remove('hidden');
  $id('selectedPathLabel').textContent="Level "+lv.num+" ("+lv.cefr+") · Unit "+pathState.unit+": "+u[0]+" · Day "+day+": "+C.DAY_STRUCTURE[day-1].name;
  const select=$id('levelSelect');
  select.innerHTML=C.LEVELS.map(function(l){return '<option value="'+l.id+'"'+(l.id===lv.id?" selected":"")+'>Level '+l.num+' · '+l.cefr+'</option>'}).join("");
  $id("dayPlanInfo").innerHTML="<b>"+u[0]+"</b> — Grammar focus: <b>"+u[1]+"</b> · Today: <b>"+C.DAY_STRUCTURE[day-1].name+"</b> ("+C.DAY_STRUCTURE[day-1].focus+")"+
    (C.READY_LESSONS[key]?' · <span style="color:#0a7">Full content available for this lesson.</span>':' · <span style="color:#b60">Detailed activity content will be added in the next update.</span>');
  $id("grammarFocusLabel").textContent=u[1];
  openTab('home');
}
$$('[data-back]').forEach(b=>b.addEventListener('click',()=>showStage(b.dataset.back)));
$id('returnToMenu').addEventListener('click',function(){
  $id('learningApp').classList.add('hidden');
  $id('selectorPortal').classList.remove('hidden');
  showStage(pathState.day?'day':pathState.unit?'unit':'grade');
});
renderGrades();
showStage('grade');
