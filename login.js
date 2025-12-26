function login() {
  const user = document.getElementById("username").value;

  if (!user) {
    alert("Please enter your anime name 💖");
    return;
  }

  localStorage.setItem("animeUser", user);
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (!users.includes(user)) {
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }
  window.location.href = "index.html";
}
