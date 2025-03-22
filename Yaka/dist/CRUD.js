
document.addEventListener('DOMContentLoaded', function() {
    
    const registerForm = document.querySelector('.register-container form');    
    
    registerForm.addEventListener('submit', function(event) {
       
        event.preventDefault();
        
        // obtener valores de inputs
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const email = document.getElementById('reg-email').value;
        const edad = document.getElementById('edad').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        // Objeto para enviar a la API
        const usuario = {
            nombre: nombre,
            apellido: apellido,
            email: email,
            edad: parseInt(edad),
            password: password
        };
        
        // Enviar data al servidor
        fetch('http://localhost:8080/usuario/postUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en el registro');
            }
            return response.json();
        })
        .then(data => {
            alert('Registro exitoso');
            // Limpiar formulario
            registerForm.reset();
            // Opcional xd 
            // document.querySelector('.close-register').click();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error en el registro: ' + error.message);
        });
    });
    
    // Funciones del modal
    const loginModal = document.getElementById("login-modal");
    const loginBtn = document.getElementById("login-btn");
    const closeLoginBtn = document.getElementsByClassName("close")[0];
    const registerLink = document.querySelector(".register-link a");
    const registerModal = document.getElementById('register-modal');
    const closeRegisterBtn = document.querySelector('.close-register');
    const loginLink = document.getElementById('login-link');
    
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

    // Cuando se da click en el span (x)        
    if (closeRegisterBtn || closeLoginBtn) {
        closeLoginBtn.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
        closeRegisterBtn.addEventListener('click', function() {
            registerModal.style.display = 'none';
        });
    }

    // Para cerrar cuando se da click afuera
    window.onclick = function(event) {
        if (event.target == loginModal) {
            loginModal.style.display = "none";
        }
        if (event.target == registerModal) {
            registerModal.style.display = "none";
        }}
});