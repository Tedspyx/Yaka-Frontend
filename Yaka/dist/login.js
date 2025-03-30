const ingresarBtn = document.getElementById("login-btn");
const loginModal = document.getElementById("login-modal");
const loginLink = document.getElementById("login-link");
const registerModal = document.getElementById('register-modal');
const registerLink = document.querySelector(".register-link a");
const closeLoginBtn = document.getElementsByClassName("close")[0];
const closeRegisterBtn = document.querySelector('.close-register');

ingresarBtn.addEventListener("click", ()=>{
    loginModal.style.display = "block";
    if(registerLink){
        registerLink.onclick = (e)=>{
        e.preventDefault();
        loginModal.style.display = "none";
        registerModal.style.display = "block";
    }}
})