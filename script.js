let exercises = [];
let currentIndex = 0;
let timerInterval;
let startTime;
let currentCategory;

document.addEventListener("DOMContentLoaded", () => {

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }

  document.querySelectorAll(".openBtn").forEach(btn=>{
    btn.onclick = async function(){
      currentCategory = this.parentElement.dataset.category;
      exercises = await fetchExercises(currentCategory);
      localStorage.setItem("currentExercises", JSON.stringify(exercises));
      location.href = "workout.html";
    }
  });

  if(document.getElementById("workoutContainer")){
    exercises = JSON.parse(localStorage.getItem("currentExercises"));
    startWorkout();
  }

  document.getElementById("hasTimer")?.addEventListener("change", e=>{
    document.getElementById("timerSeconds").classList.toggle("hidden", !e.target.checked);
  });

  document.getElementById("darkToggle")?.addEventListener("click", toggleDark);
});

function startWorkout(){
  currentIndex = 0;
  startTime = Date.now();
  renderExercise();
}

function renderExercise(){
  const ex = exercises[currentIndex];
  const container = document.getElementById("workoutContainer");

  container.innerHTML = `
    <h2>${ex.exercise_name}</h2>
    <img src="${ex.gif_url}" width="100%">
    ${ex.has_timer==="TRUE" ? `
      <h3 id="timer">${ex.timer_seconds}</h3>
      <button onclick="startTimer(${ex.timer_seconds})">Start</button>
    ` : `
      <h3 id="count">0 / ${ex.reps}</h3>
      <button onclick="updateCount(1)">+</button>
      <button onclick="updateCount(-1)">-</button>
    `}
    <button onclick="nextExercise()">Next</button>
    <button onclick="previousExercise()">Back</button>
  `;
}

let count=0;
function updateCount(val){
  count+=val;
  document.getElementById("count").innerText=`${count}`;
}

function startTimer(seconds){
  let time=seconds;
  const el=document.getElementById("timer");
  timerInterval=setInterval(()=>{
    time--;
    el.innerText=time;
    if(time<=0){
      clearInterval(timerInterval);
      nextExercise();
    }
  },1000);
}

function nextExercise(){
  if(currentIndex<exercises.length-1){
    currentIndex++;
    count=0;
    renderExercise();
  }else{
    completeWorkout();
  }
}

function previousExercise(){
  if(currentIndex>0){
    currentIndex--;
    renderExercise();
  }
}

function completeWorkout(){
  const totalTime = Math.floor((Date.now()-startTime)/1000);
  saveWorkoutHistory(totalTime);
  document.getElementById("workoutContainer").innerHTML=`
    <h2>Workout Completed 🎉</h2>
    <p>Total Time: ${totalTime}s</p>
    <button onclick="goHome()">Home</button>
  `;
}

function saveWorkoutHistory(time){
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push({date:new Date().toDateString(),time});
  localStorage.setItem("history", JSON.stringify(history));
}

function showHistory(){
  const history = JSON.parse(localStorage.getItem("history")) || [];
  alert(JSON.stringify(history,null,2));
}

function goHome(){ location.href="index.html"; }
function goWorkout(){ location.href="workout.html"; }

function toggleDark(){
  document.body.classList.toggle("dark");
}
