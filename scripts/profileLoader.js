//при открытии страницы
let loginDiv = document.getElementById('loginDiv');
let login = sessionStorage.getItem("Login");
loginDiv.style.fontSize = '5vh';
loginDiv.innerText = login;


