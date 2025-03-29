// Mostrar/Ocultar menú
document.getElementById("accessibilityIcon").addEventListener("click", function() {
    const menu = document.getElementById("accessibilityMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
});

// Activar modo blanco y negro
document.getElementById("smartContrast").addEventListener("click", function() {
    document.body.classList.toggle("contrast-bn");
});

// Agrandar texto
document.getElementById("increaseText").addEventListener("click", function() {
    document.body.classList.add("large-text");
});

// Reducir texto
document.getElementById("decreaseText").addEventListener("click", function() {
    document.body.classList.remove("large-text");
});

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault(); // Evita que se recargue la página o se haga scroll
        document.querySelector('.accessibility-button').focus(); // Mantiene el foco en el botón
    });
});