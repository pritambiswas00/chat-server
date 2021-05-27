const socket = io();
const myForm = document.getElementById("agent");
const username = document.getElementById("username");
const password = document.getElementsById("password");

socket.on("connection", (data) => {
  console.log(data);
});

myForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = username.value;
  const password = password.value;
  const res = await fetch("http://localhost:5000/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      email: username,
      password: password,
    },
  });

  const response = await res.json();
  console.log(response);
});
