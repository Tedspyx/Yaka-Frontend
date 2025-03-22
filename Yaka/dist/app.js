// Obtener los modales
const loginModal = document.getElementById("login-modal");
const registerModal = document.getElementById("register-modal");

// Obtener el botón que abre el modal de login
const loginBtn = document.getElementById("login-btn");

// Obtener los elementos <span> que cierran los modales
const closeLoginBtn = document.getElementsByClassName("close")[0];
const closeRegisterBtn = document.getElementsByClassName("close-register")[0];

// Obtener los enlaces para cambiar entre modales
const registerLink = document.querySelector(".register-link a");
const loginLink = document.getElementById("login-link");

// Para abrir login cuando clickee iniciar sesion
loginBtn.onclick = function() {
    loginModal.style.display = "block";
}

// Para abrir registro desde login
registerLink.onclick = function(e) {
    e.preventDefault();
    loginModal.style.display = "none";
    registerModal.style.display = "block";
}

// Para abrir login desde registro
loginLink.onclick = function(e) {
    e.preventDefault();
    registerModal.style.display = "none";
    loginModal.style.display = "block";
}

// 
closeLoginBtn.onclick = function() {
    loginModal.style.display = "none";
}

closeRegisterBtn.onclick = function() {
    registerModal.style.display = "none";
}

// Para cerrar cuando se da click afuera
window.onclick = function(event) {
    if (event.target == loginModal) {
        loginModal.style.display = "none";
    }
    if (event.target == registerModal) {
        registerModal.style.display = "none";
    }
}