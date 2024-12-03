//.accordion-button para las otras energias en la pagina principal
document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
});

//Para el menu desplegable en Responsive
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links'); // Asegúrate de que sea .nav-links
    navLinks.classList.toggle('active');
}

// Cierra el menú al hacer clic en cualquier enlace de la navegación
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.remove('active'); // Remueve la clase 'active' para ocultar el menú
    });
});







