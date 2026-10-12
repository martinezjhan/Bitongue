const state={xp:0,done:{}};const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
function openTab(id){$$(".tab").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active");$$(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.tab===id));window.scrollTo({top:0,behavior:"smooth"});}
$$(".nav-item").forEach(b=>b.addEventListener("click",()=>openTab(b.dataset.tab)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>openTab(b.dataset.go)));
function award(skill,amount=10){if(state.done[skill])return;state.done[skill]=true;state.xp+=amount;$("#xp").textContent=state.xp;$("#status").textContent=`+${amount} XP · ${skill} completed`;setTimeout(()=>$("#status").textContent="Ready",1800);}
const matchWords=["classmate","teacher","schoolbag","happy"];const matchGrid=$("#matchGrid");
matchWords.forEach((w,i)=>{const b=document.createElement("button");b.className="match-card";b.textContent=w;b.dataset.ok=i===0?"classmate":i===1?"teacher":i===2?"schoolbag":"happy";b.onclick=()=>b.classList.toggle("selected");matchGrid.appendChild(b)});
$("#checkMatch").onclick=()=>{const selected=$$(".match-card.selected").length;if(selected>=2){award("vocabulary");$("#matchFeedback").textContent="Good! You practiced source vocabulary. Replace these cards with the exact Quizlet terms when you finalize the unit."}else $("#matchFeedback").textContent="Choose at least two words and check again.";};

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
$$(".readBtn").forEach(b=>b.onclick=()=>{activeReading=b.dataset.reading;const title=activeReading==="healthy"?"A Healthy Lifestyle":"A Special Day";$("#readingTitle").textContent=title+" · Comprehension";$("#readingQuestions").innerHTML=readingData[activeReading].map((q,i)=>`<div class="question"><b>${i+1}. ${q[0]}</b><label><input name="rq${i}" value="${q[1]}"> <span>My answer</span></label><small>Tip: ${q[1]}</small></div>`).join("");$("#readingActivity").classList.remove("hidden");$("#readingActivity").scrollIntoView({behavior:"smooth"})});
$("#checkReading").onclick=()=>{let good=0;readingData[activeReading].forEach((q,i)=>{const v=$(`input[name="rq${i}"]`)?.value.trim().toLowerCase();if(v&&v===q[1].toLowerCase())good++});$("#readingFeedback").textContent=`You matched ${good}/${readingData[activeReading].length} model answers. You can replace this with a richer question engine later.`;if(good>=3)award("reading",10);};
$$(".complete").forEach(b=>b.onclick=()=>award(b.dataset.skill,10));
$$(".practice").forEach(b=>b.onclick=()=>{b.textContent="✓ Practiced";b.disabled=true;award("speaking",5)});
$("#levelSelect").onchange=e=>{$("#status").textContent=`Selected ${e.target.options[e.target.selectedIndex].text}`};


// Big-button entry menu: Grade -> Unit -> Day.
const pathState={grade:null,unit:null,day:null};
const gradeNames={initial:'Grade 1 · Initial Level',fifth:'Grade 5 · 5th Level'};
const unitOptions={initial:[{n:1,ready:false},{n:2,ready:true},{n:3,ready:false},{n:4,ready:false},{n:5,ready:false},{n:6,ready:false}],fifth:[{n:1,ready:true},{n:2,ready:false},{n:3,ready:false},{n:4,ready:false},{n:5,ready:false},{n:6,ready:false}]};
const dayNames=['Discover','Explore','Practice','Create','Show what you know'];
const dayIcons=['fa-compass','fa-book-open','fa-puzzle-piece','fa-palette','fa-trophy'];
const $id=id=>document.getElementById(id);
function showStage(name){['grade','unit','day'].forEach(n=>$id(n+'Stage').classList.toggle('hidden',n!==name));['grade','unit','day'].forEach((n,i)=>$id('dot'+n[0].toUpperCase()+n.slice(1)).classList.toggle('active',['grade','unit','day'].indexOf(name)>=i));const labels={grade:'STEP 1 OF 3 · CHOOSE YOUR GRADE',unit:'STEP 2 OF 3 · CHOOSE YOUR UNIT',day:'STEP 3 OF 3 · CHOOSE YOUR DAY'};$id('progressLabel').textContent=labels[name];window.scrollTo({top:0,behavior:'smooth'});}
function renderUnits(){const items=unitOptions[pathState.grade]||[];$id('unitSubtitle').textContent=gradeNames[pathState.grade]+' · choose a unit';$id('unitTiles').innerHTML=items.map(u=>`<button class="choice-tile unit-tile ${u.ready?'tile-teal':'tile-muted'}" ${u.ready?'data-unit="'+u.n+'"':'disabled'}><span class="tile-icon"><i class="fa-solid ${u.ready?'fa-book-open':'fa-lock'}"></i></span><span class="tile-kicker">UNIT ${String(u.n).padStart(2,'0')}</span><strong>${u.ready?(pathState.grade==='initial'?'Who am I?':'Unit One'):'Coming soon'}</strong><small>${u.ready?'Ready to explore':'Content will be added'}</small><span class="tile-arrow"><i class="fa-solid ${u.ready?'fa-arrow-right':'fa-lock'}"></i></span></button>`).join('');$id('unitTiles').querySelectorAll('[data-unit]').forEach(b=>b.onclick=()=>{pathState.unit=Number(b.dataset.unit);renderDays();showStage('day')});}
function renderDays(){const activeDay=1;$id('daySubtitle').textContent=gradeNames[pathState.grade]+' · Unit '+pathState.unit+' · select a day';$id('dayTiles').innerHTML=Array.from({length:5},(_,i)=>{const ready=i===activeDay-1;return `<button class="choice-tile day-tile ${ready?'tile-yellow':'tile-muted'}" ${ready?'data-day="'+(i+1)+'"':'disabled'}><span class="tile-icon"><i class="fa-solid ${dayIcons[i]}"></i></span><span class="tile-kicker">DAY ${String(i+1).padStart(2,'0')}</span><strong>${dayNames[i]}</strong><small>${ready?'Open today’s activities':'Coming in a future update'}</small><span class="tile-arrow"><i class="fa-solid ${ready?'fa-arrow-right':'fa-lock'}"></i></span></button>`}).join('');$id('dayTiles').querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>launchLesson(Number(b.dataset.day)));}
function launchLesson(day){pathState.day=day;$id('selectorPortal').classList.add('hidden');$id('learningApp').classList.remove('hidden');$id('selectedPathLabel').textContent=gradeNames[pathState.grade]+' · Unit '+pathState.unit+' · Day '+day;const select=$id('levelSelect');select.value=pathState.grade;select.dispatchEvent(new Event('change'));openTab('home');}
$$('.grade-tile').forEach(b=>b.addEventListener('click',()=>{pathState.grade=b.dataset.grade;pathState.unit=null;renderUnits();showStage('unit')}));
$$('[data-back]').forEach(b=>b.addEventListener('click',()=>showStage(b.dataset.back)));
$id('returnToMenu').addEventListener('click',()=>{$id('learningApp').classList.add('hidden');$id('selectorPortal').classList.remove('hidden');showStage(pathState.day?'day':pathState.unit?'unit':'grade')});
