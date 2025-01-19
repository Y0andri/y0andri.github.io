document.addEventListener("DOMContentLoaded", function() {
    fetch('componentes/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
            // Resaltar el enlace activo
            const navLinks = document.querySelectorAll('.nav a');
            const currentPage = window.location.pathname.split('/').pop();
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('nav_btn_active');
                }
            });
        });

    fetch('componentes/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });
});