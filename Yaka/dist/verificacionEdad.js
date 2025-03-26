function confirmAge(isOfAge) {
    console.log(isOfAge); // Verifica si está recibiendo true o false
    if (isOfAge) {
        localStorage.setItem("ageVerified", "true");
        document.getElementById("age-verification").style.display = "none";
    } else {
        window.location.href = "https://www.google.com"; // Redirige a otro sitio si es menor
    }
}

/* 
window.onload = function() {
    if (localStorage.getItem("ageVerified") === "true") {
        document.getElementById("age-verification").style.display = "none";
    }
} */