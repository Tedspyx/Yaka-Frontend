let nextBtn = document.querySelector('.derecha');
let prevBtn = document.querySelector('.izquierda');
let slider = document.querySelector('.deslizador');
let sliderList = slider.querySelector('.deslizador .lista');
let thumbnail = document.querySelector('.deslizador .miniatura');
let puntos = document.querySelectorAll('.punto');
let contenidos = document.querySelectorAll('.contenidos .contenido');
let currentIndex = 0; // Índice del contenido visible
let isAnimating = false; // Evita múltiples clics rápidos

// Función para mover el slider y actualizar el contenido
function moveSlider(direction) {
    if (isAnimating) return; // Evita ejecutar la función si hay una animación en curso
    isAnimating = true; // Bloquea nuevos clics

    let sliderItems = document.querySelectorAll('.deslizador .lista .elemento');
    let thumbnailItems = document.querySelectorAll('.miniatura .elemento');

    // Ocultar el contenido actual
    contenidos[currentIndex].classList.remove('activo');

    if (direction === 'derecha') {
        sliderList.appendChild(sliderItems[0]);
        thumbnail.appendChild(thumbnailItems[0]);
        slider.classList.add('derecha');
        currentIndex = (currentIndex + 1) % contenidos.length;
    } else {
        sliderList.prepend(sliderItems[sliderItems.length - 1]);
        thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1]);
        slider.classList.add('izquierda');
        currentIndex = (currentIndex - 1 + contenidos.length) % contenidos.length;
    }

    slider.addEventListener('animationend', function () {
        slider.classList.remove('derecha', 'izquierda');
        actualizarIndicador();
        isAnimating = false; // Permite nuevos clics

        // Mostrar el nuevo contenido con animación
        contenidos[currentIndex].classList.add('activo');
    }, { once: true });
}

// Función para actualizar el indicador de posición
function actualizarIndicador() {
    let thumbnailItems = document.querySelectorAll('.miniatura .elemento');
    let indiceActivo = Array.from(thumbnailItems).indexOf(thumbnail.querySelector('.elemento:first-child'));

    puntos.forEach((punto, index) => {
        punto.classList.toggle('activo', index === indiceActivo);
    });
}

// Asignar eventos a los botones
nextBtn.onclick = () => moveSlider('derecha');
prevBtn.onclick = () => moveSlider('izquierda');

// Inicializar el primer contenido como visible
contenidos[currentIndex].classList.add('activo');
actualizarIndicador();
