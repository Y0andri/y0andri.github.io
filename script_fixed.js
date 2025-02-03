document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".nav_openner input");
    const nav = document.querySelector(".nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("change", function () {
            if (this.checked) {
                nav.classList.add("nav_active"); // Agrega clase para mostrar el menú
            } else {
                nav.classList.remove("nav_active"); // Oculta el menú
            }
        });
    }

    const navCloser = document.querySelector(".nav_closer");
    if (navCloser) {
        navCloser.addEventListener("click", function () {
            nav.classList.remove("nav_active");
            menuToggle.checked = false; // Asegura que el checkbox se desactive
        });
    }
});
