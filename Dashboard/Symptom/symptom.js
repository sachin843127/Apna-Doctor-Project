document.getElementById("checkBtn").addEventListener("click", async () => {
  const text = document.getElementById("symptomText").value.trim();

  if (!text) {
    alert("Please enter your symptoms");
    return;
  }

  const res = await fetch("http://localhost:5000/api/symptom/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({ text })
  });

  const data = await res.json();

  document.getElementById("disease").innerText = data.disease;
  document.getElementById("food").innerText = data.food;
  document.getElementById("remedy").innerText = data.remedy;

  fillList("doList", data.do);
  fillList("dontList", data.dont);

  document.getElementById("resultBox").classList.remove("hidden");
});

function fillList(id, arr) {
  const ul = document.getElementById(id);
  ul.innerHTML = "";
  arr.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    ul.appendChild(li);
  });
}
