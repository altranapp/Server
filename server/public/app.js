const API = "https://crypto-app-y5vn.onrender.com/api";

// REGISTER
async function register() {
  const email = regEmail.value;
  const password = regPassword.value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  alert(data.message);
}

// LOGIN
async function login() {
  const email = logEmail.value;
  const password = logPassword.value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!data.token) return alert("Login failed");

  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.userId);

  window.location.href = "dashboard.html";
}

// LOAD BALANCE
async function loadBalance() {
  const userId = localStorage.getItem("userId");

  const res = await fetch(`${API}/user/balance/${userId}`);
  const data = await res.json();

  balance.innerText = "Balance: $" + data.balance;
}

// DEPOSIT
async function deposit() {
  const amount = Number(depositAmount.value);
  const userId = localStorage.getItem("userId");

  const res = await fetch(`${API}/user/deposit`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ userId, amount })
  });

  const data = await res.json();
  alert(data.message);
  loadBalance();
}

// WITHDRAW
async function withdraw() {
  const amount = Number(withdrawAmount.value);
  const userId = localStorage.getItem("userId");

  const res = await fetch(`${API}/user/withdraw`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ userId, amount })
  });

  const data = await res.json();
  alert(data.message);
  loadBalance();
}

// KYC
async function submitKYC() {
  const userId = localStorage.getItem("userId");

  const body = {
    userId,
    name: name.value,
    country: country.value,
    phone: phone.value,
    sex: sex.value
  };

  const res = await fetch(`${API}/kyc/submit`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body)
  });

  const data = await res.json();
  alert(data.message);
}

// LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// AUTO LOAD
if (window.location.pathname.includes("dashboard")) {
  loadBalance();
}
