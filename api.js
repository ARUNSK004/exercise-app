const API_URL = "https://script.google.com/macros/s/AKfycbzS1E3uSy8CUrt8hSY3cr9WqvXC5p-Iv6SfwrmPdbJJgmu_j3EOeIDZi39wtx5ORhF2/exec";

async function fetchExercises(category) {
  const res = await fetch(`${API_URL}?category=${category}`);
  return await res.json();
}

async function addExercise(data) {
  await fetch(API_URL, {
    method:"POST",
    body:JSON.stringify(data)
  });
}
