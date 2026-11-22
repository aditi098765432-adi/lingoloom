const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const storageKey = "lingoloom_progress_v1";
const initial = { learned: [], completed: [], best: 0, minutes: 0, streak: 1, language: "es" };
let progress = {...initial, ...JSON.parse(localStorage.getItem(storageKey) || "{}")};
const words = {
  es: [
    ["Hola","Hello","oh-lah","greetings"],["Gracias","Thank you","grah-see-ahs","greetings"],["Por favor","Please","por fah-vor","greetings"],["Adiós","Goodbye","ah-dee-ohs","greetings"],
    ["Agua","Water","ah-gwah","daily"],["Comida","Food","koh-mee-dah","daily"],["Amigo","Friend","ah-mee-goh","daily"],["Casa","House","kah-sah","daily"]
  ],
  fr: [
    ["Bonjour","Hello","bohn-zhoor","greetings"],["Merci","Thank you","mehr-see","greetings"],["S'il vous plaît","Please","seel voo pleh","greetings"],["Au revoir","Goodbye","oh ruh-vwahr","greetings"],
    ["Eau","Water","oh","daily"],["Nourriture","Food","noo-ree-toor","daily"],["Ami","Friend","ah-mee","daily"],["Maison","House","meh-zohn","daily"]
  ],
  de: [
    ["Hallo","Hello","hah-loh","greetings"],["Danke","Thank you","dahn-kuh","greetings"],["Bitte","Please","bit-uh","greetings"],["Tschüss","Goodbye","choos","greetings"],
    ["Wasser","Water","vah-ser","daily"],["Essen","Food","es-en","daily"],["Freund","Friend","froynt","daily"],["Haus","House","howss","daily"]
  ]
};
const langNames = {es:"Spanish",fr:"French",de:"German"};
let activeFilter="all", cardIndex=0, revealed=false, quizIndex=0, selectedAnswer=null, score=0, answerChecked=false;
const quizSets = {
  es:[["Hola","Hello","Goodbye","Water","Friend",0],["Gracias","Please","Thank you","Food","House",1],["Agua","Friend","Goodbye","Water","Hello",2],["Amigo","Food","Friend","Please","Water",1],["Adiós","Goodbye","Thank you","Hello","House",0]],
  fr:[["Bonjour","Hello","Goodbye","Water","Friend",0],["Merci","Please","Thank you","Food","House",1],["Eau","Friend","Goodbye","Water","Hello",2],["Ami","Food","Friend","Please","Water",1],["Au revoir","Goodbye","Thank you","Hello","House",0]],
  de:[["Hallo","Hello","Goodbye","Water","Friend",0],["Danke","Please","Thank you","Food","House",1],["Wasser","Friend","Goodbye","Water","Hello",2],["Freund","Food","Friend","Please","Water",1],["Tschüss","Goodbye","Thank you","Hello","House",0]]
};
function save(){localStorage.setItem(storageKey,JSON.stringify(progress));updateDashboard()}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2100)}
function updateDashboard(){
  $("#wordsCount").textContent=progress.learned.length; $("#lessonsCount").textContent=progress.completed.length;
  $("#quizCount").textContent=progress.best+"%"; $("#quizBar").style.width=progress.best+"%";
  $("#streakCount").textContent=progress.streak; $("#sideStreak").textContent=progress.streak+" day streak";
  $("#goalNumber").textContent=progress.minutes; $("#goalRing").style.background=`conic-gradient(#a98bff ${Math.min(progress.minutes/10*360,360)}deg,#3a304c 0deg)`;
  $("#bestScoreSide").textContent=progress.best+"%"; $("#lessonProgress").style.width=(progress.completed.length/3*100)+"%";
}
function showView(name){
  ["overview","vocabulary","lessons","quiz"].forEach(v=>$("#"+v+"View").classList.toggle("hidden",v!==name));
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
  $("#pageName").textContent=name==="overview"?"Overview":name==="vocabulary"?"Vocabulary":name==="lessons"?"Daily lessons":"Practice quiz";
  $("#sidebar").classList.remove("open"); if(name==="vocabulary")renderCard(); if(name==="quiz" && quizIndex===0)renderQuiz();
  window.scrollTo({top:0,behavior:"smooth"});
}
$$(".nav-item").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.go)));
$("#menuBtn").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#languageSelect").value=progress.language;
$("#languageSelect").addEventListener("change",e=>{progress.language=e.target.value;cardIndex=0;save();renderCard();toast("Learning language changed to "+langNames[progress.language]);});
function filteredWords(){return words[progress.language].map((w,i)=>({...{word:w[0],meaning:w[1],pron:w[2],category:w[3]},index:i})).filter(w=>activeFilter==="all"||w.category===activeFilter)}
function renderCard(){
  const list=filteredWords();if(cardIndex>=list.length)cardIndex=0;if(cardIndex<0)cardIndex=list.length-1;
  const w=list[cardIndex]; if(!w)return;
  $("#wordCategory").textContent=w.category.toUpperCase();$("#wordFront").textContent=w.word;$("#wordTranslation").textContent=w.meaning;$("#wordPronunciation").textContent="Pronunciation: "+w.pron;
  $("#wordHint").textContent="Tap to reveal the meaning";$("#wordBack").classList.add("hidden");$("#revealWord").textContent="Show meaning";revealed=false;
  $("#cardPosition").textContent=`Card ${cardIndex+1} of ${list.length}`;$("#saveWord").textContent=progress.learned.includes(w.word)?"✓ Saved":"＋ Save word";
  renderSaved();
}
function renderSaved(){
  $("#savedWordsLabel").textContent=progress.learned.length+" words saved";
  const list=$("#savedWords");list.innerHTML="";
  if(!progress.learned.length){list.innerHTML='<p class="muted">Words you save will appear here.</p>';return}
  progress.learned.forEach(word=>{const w=words[progress.language].find(x=>x[0]===word);if(!w)return;const chip=document.createElement("span");chip.className="saved-chip";chip.textContent=w[0]+" ";const small=document.createElement("span");small.textContent="· "+w[1];chip.appendChild(small);list.appendChild(chip)});
}
$$(".filter").forEach(b=>b.addEventListener("click",()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeFilter=b.dataset.filter;cardIndex=0;renderCard()}));
$("#prevCard").addEventListener("click",()=>{cardIndex--;renderCard()});$("#nextCard").addEventListener("click",()=>{cardIndex++;renderCard()});
$("#revealWord").addEventListener("click",()=>{revealed=!revealed;$("#wordBack").classList.toggle("hidden",!revealed);$("#wordHint").textContent=revealed?"Meaning and pronunciation":"Tap to reveal the meaning";$("#revealWord").textContent=revealed?"Hide meaning":"Show meaning"});
$("#saveWord").addEventListener("click",()=>{const w=filteredWords()[cardIndex];if(!progress.learned.includes(w.word)){progress.learned.push(w.word);save();renderCard();toast("Word added to your collection!")}else toast("This word is already saved.")});
$("#speakWord").addEventListener("click",()=>{const w=filteredWords()[cardIndex];if(!("speechSynthesis" in window)){toast("Speech is not supported in this browser.");return}const utter=new SpeechSynthesisUtterance(w.word);utter.lang={es:"es-ES",fr:"fr-FR",de:"de-DE"}[progress.language];speechSynthesis.cancel();speechSynthesis.speak(utter)});
$$(".lesson-complete").forEach(b=>b.addEventListener("click",()=>{if(!progress.completed.includes(b.dataset.lesson)){progress.completed.push(b.dataset.lesson);save();b.textContent="Completed ✓";b.classList.add("completed");toast("Lesson completed. Great work!")}else toast("You have already completed this lesson.")}));
$("#addMinute").addEventListener("click",()=>{progress.minutes=Math.min(10,progress.minutes+1);save();toast("One minute added to today's goal!")});
function renderQuiz(){
  const q=quizSets[progress.language][quizIndex];if(!q)return;
  selectedAnswer=null;answerChecked=false;$("#quizContent").classList.remove("hidden");$("#quizResult").classList.add("hidden");
  $("#quizProgress").textContent=`QUESTION ${quizIndex+1} / 5`;$("#quizProgressBar").style.width=((quizIndex)/5*100)+"%";
  $("#quizQuestion").textContent=`What does “${q[0]}” mean?`;$("#quizNext").disabled=true;$("#quizNext").textContent=quizIndex===4?"Finish quiz ✓":"Check answer →";
  const box=$("#answerOptions");box.innerHTML="";
  q.slice(1,5).forEach((answer,i)=>{const btn=document.createElement("button");btn.className="answer-option";btn.textContent=answer;btn.addEventListener("click",()=>{selectedAnswer=i;$$(".answer-option").forEach(x=>x.classList.remove("selected"));btn.classList.add("selected");$("#quizNext").disabled=false});box.appendChild(btn)});
}
$("#quizNext").addEventListener("click",()=>{
  if(answerChecked){
    quizIndex++;
    if(quizIndex<5) renderQuiz(); else showResults();
    return;
  }
  if(selectedAnswer===null)return;
  const q=quizSets[progress.language][quizIndex];
  $$(".answer-option").forEach((b,i)=>{
    if(i===q[5]) b.classList.add("correct");
    else if(i===selectedAnswer) b.classList.add("wrong");
  });
  if(selectedAnswer===q[5]) score++;
  answerChecked=true;
  $("#quizNext").textContent=quizIndex===4?"See results":"Next question →";
});
function showResults(){
  $("#quizContent").classList.add("hidden");$("#quizResult").classList.remove("hidden");const pct=Math.round(score/5*100);progress.best=Math.max(progress.best,pct);save();
  $("#resultScore").textContent=score+"/5";$("#resultTitle").textContent=pct===100?"Perfectly done!":pct>=60?"Lovely effort!":"Keep practising!";
  $("#resultMessage").textContent=pct>=60?"You're building a great foundation. Come back for another round soon.":"Every practice session is progress. Review your saved words and try again.";
  $("#quizProgress").textContent="COMPLETED";$("#quizProgressBar").style.width="100%";
  $("#quizNext").onclick=null;
}
$("#restartQuiz").addEventListener("click",()=>{quizIndex=0;score=0;renderQuiz()});
updateDashboard();renderCard();
