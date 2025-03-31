document.addEventListener("DOMContentLoaded", function () {

  // Comprobar si ya se ha preguntado el nombre del usuario
  if (!localStorage.getItem('nombreUsuario')) {
    // Preguntar el nombre del usuario
    var nombre = prompt('Hola ¿Cómo te llamas?');

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

  // Inicializador de Tema
  let tema = localStorage.getItem("tema");
if(localStorage.getItem("tema")) {
      document.body.classList.add(tema);
    }






