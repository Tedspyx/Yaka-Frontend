const menuDesplegable = document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navigationMenu = document.querySelector('nav.navigation ul');

    if (hamburgerMenu && navigationMenu) {
        hamburgerMenu.addEventListener('click', function() {
            navigationMenu.classList.toggle('active');
            hamburgerMenu.classList.toggle('active'); // Opcional: para animar el botón
        });
    }
});