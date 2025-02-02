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
        
        
        // Comprobar si ya se ha preguntado el nombre del usuario
    if (!localStorage.getItem('nombreUsuario')) {
        // Preguntar el nombre del usuario
        var nombre = prompt('Hola ¿Como te llamas?');
        
        // Guardar el nombre en localStorage
        localStorage.setItem('nombreUsuario', nombre);
        
        // Seleccionar el elemento por su ID
        var elemento = document.getElementById('user_name');
        
        // Mostrar el nombre del usuario en el elemento
        if (nombre) {
            elemento.innerHTML = 'Bienvenido, ' + nombre + '!';
        } else {
            elemento.innerHTML = 'Hola, visitante!';
        }
    } else {
        // Si ya se ha guardado el nombre, mostrarlo directamente
        var nombreGuardado = localStorage.getItem('nombreUsuario');
        var elemento = document.getElementById('user_name');
        elemento.innerHTML = 'Hola de nuevo, ' + nombreGuardado + '!';
    }

});


