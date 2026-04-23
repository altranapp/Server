const API = "https://crypto-app-y5vn.onrender.com/api";

// REGISTER
async function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    alert(data.message || "Registered!");

  } catch (err) {
    alert("Register error");
  }
}

// LOGIN
async function login() {
  const email = document.getElementById("logEmail").value;
  const password = document.getElementById("logPassword").value;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      // redirect to dashboard
      window.location.href = "dashboard.html";
    } else {
      alert(data.message);
    }

  } catch (err) {
    alert("Login error");
  }
}
