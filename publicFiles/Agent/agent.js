const socket = io();
const myForm = document.getElementById("agent");

myForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = e.target.elements.username.value;
  const password = e.target.elements.password.value;
  const res = await fetch("http://26e0ffa9b326.ngrok.io/signin", {
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
