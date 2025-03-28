// Mostrar/Ocultar menú
document.getElementById("accessibilityIcon").addEventListener("click", function() {
    const menu = document.getElementById("accessibilityMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
});

// Leer página
document.getElementById("readPage").addEventListener("click", function() {
    const speech = new SpeechSynthesisUtterance();

    // Captura solo el texto visible en la página
    const visibleText = Array.from(document.body.querySelectorAll("*:not(script):not(style)"))
        .map(element => element.innerText.trim())
        .filter(text => text.length > 0)
        .join(' ');

    if (visibleText.length > 0) {
        speech.text = visibleText;
        speech.lang = "es-ES"; // Idioma en español
        speech.rate = 1; // Velocidad normal
        window.speechSynthesis.speak(speech);
    } else {
        alert("No se encontró texto para leer.");
    }
});

// Detener lectura
document.getElementById("stopReading").addEventListener("click", function() {
    window.speechSynthesis.cancel();
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
