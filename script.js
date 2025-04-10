document.addEventListener("DOMContentLoaded", function () {

document.addEventListener("DOMContentLoaded", function () {
  // Comprobar si ya se ha preguntado el nombre del usuario
  if (!localStorage.getItem('Usuarios')) {
    const modalName = document.querySelector(".modal-username");
    const buttonName = document.querySelector(".modal-username__button");
    const inputName = document.querySelector(".modal-username__input"); // Referencia al input, no al value
    
    modalName.classList.remove("desactivado");

    buttonName.addEventListener("click", () => {
      const nombre = inputName.value; // Obtener el valor y eliminar espacios en blanco
      
      if (nombre) { // Solo si el nombre no está vacío
        // Guardar el nombre en localStorage
        localStorage.setItem('Usuarios', nombre);

        // Mostrar el nombre del usuario en el elemento
        const elemento = document.getElementById('user_name');
        elemento.innerHTML = 'Bienvenido, ' + nombre + '!';

        // Ocultar el modal
        modalName.classList.add("desactivado");
      } else {
        alert("Por favor, introduce tu nombre.");
      }
    });
  } else {
    // Si ya se ha guardado el nombre, mostrarlo directamente
    const nombreGuardado = localStorage.getItem('Usuarios');
    const elemento = document.getElementById('user_name');
    elemento.innerHTML = 'Hola de nuevo, ' + nombreGuardado + '!';
  }
});
});

  // Inicializador de Tema
  let tema = localStorage.getItem("tema");
if(localStorage.getItem("tema")) {
      document.body.classList.add(tema);
    }
    
    






