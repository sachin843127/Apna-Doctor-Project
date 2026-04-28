// Already logged in → dashboard
const token = localStorage.getItem("token");
if (token) {
  window.location.href = "../../dashboard/index.html";
}

const toggleBtn = document.getElementById("toggleBtn");
const toggleText = document.getElementById("toggleText");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const nameField = document.getElementById("name");
const authForm = document.getElementById("authForm");

let isLogin = true;

// toggle login/register
toggleBtn.addEventListener("click", () => {
  isLogin = !isLogin;

  if (isLogin) {
    formTitle.innerText = "Login";
    submitBtn.innerText = "Login";
    toggleText.innerText = "New user?";
    toggleBtn.innerText = "Create Account";
    nameField.classList.add("hidden");
  } else {
    formTitle.innerText = "Register";
    submitBtn.innerText = "Register";
    toggleText.innerText = "Already have an account?";
    toggleBtn.innerText = "Login";
    nameField.classList.remove("hidden");
  }
});

// submit
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: nameField.value,
    email: email.value,
    password: password.value,
  };

  const url = isLogin
    ? "http://localhost:5000/api/auth/login"
    : "http://localhost:5000/api/auth/register";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userName", data.user.name);
    localStorage.setItem("userId", data.user._id);

    window.location.href = "../../dashboard/index.html";
  } else {
    alert(data.message);
  }
});




document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();   // token + user clear
  window.location.href = "../auth/auth.html";
});
