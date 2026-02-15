const API_URL = "https://script.google.com/macros/s/AKfycbycWbvwYIXxqCJx6oLHOXOkAqdiExzfrpzwLcI1FKIzxuvL8HT6nP1JdSPsSZLvcRxI/exec";

let exercises = [];
let currentIndex = 0;
let timerInterval = null;
let remainingTime = 0;

async function loadSession(session) {
  document.getElementById("loading").classList.remove("hidden");

  const res = await fetch(API_URL);
  const data = await res.json();

  exercises = data.filter(e => e.session === session);

  currentIndex = 0;
  document.getElementById("home").classList.add("hidden");
  document.getElementById("workout").classList.remove("hidden");

  document.getElementById("loading").classList.add("hidden");

  if (exercises.length === 0) {
    document.getElementById("exercise-container").innerHTML = "<h2>No Exercises Found</h2>";
    return;
  }

  renderExercise();
}

function renderExercise() {
  const exercise = exercises[currentIndex];
  let html = `
    <h2>${exercise.exercise_name}</h2>
    <img src="${exercise.gif_url}">
  `;

  if (exercise.has_timer === "Yes") {
    remainingTime = exercise.timer_duration;
    html += `
      <h3 id="timer">${formatTime(remainingTime)}</h3>
      <button onclick="startTimer()">Start</button>
      <button onclick="pauseTimer()">Pause</button>
      <button onclick="resetTimer()">Reset</button>
    `;
  } else {
    html += `<h3>Reps: ${exercise.reps}</h3>`;
  }

  html += `
    <button onclick="prevExercise()" ${currentIndex===0?'disabled':''}>Back</button>
    <button onclick="nextExercise()">Continue</button>
  `;

  document.getElementById("exercise-container").innerHTML = html;
}

function nextExercise() {
  if (currentIndex < exercises.length - 1) {
    currentIndex++;
    renderExercise();
  } else {
    document.getElementById("exercise-container").innerHTML = "<h2>Workout Completed 🎉</h2>";
  }
}

function prevExercise() {
  if (currentIndex > 0) {
    currentIndex--;
    renderExercise();
  }
}

function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      document.getElementById("timer").innerText = formatTime(remainingTime);
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      alert("Time's up!");
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  remainingTime = exercises[currentIndex].timer_duration;
  document.getElementById("timer").innerText = formatTime(remainingTime);
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2,'0');
  const s = String(seconds % 60).padStart(2,'0');
  return `${m}:${s}`;
}

function openModal(session) {
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("sessionType").value = session;
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

document.getElementById("exerciseForm").addEventListener("submit", async function(e){
  e.preventDefault();

  const data = {
    session: document.getElementById("sessionType").value,
    exercise_name: document.getElementById("exercise_name").value,
    gif_url: document.getElementById("gif_url").value,
    reps: document.getElementById("reps").value,
    has_timer: document.getElementById("has_timer").value,
    timer_duration: document.getElementById("timer_duration").value
  };

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  });

  closeModal();
  alert("Exercise Added!");
});
