const saludo = ()=>{
    let fecha = new Date();
    let hora = fecha.getHours();
    if(fecha <= 5 || fecha >= 20) {
        return "Buenas noches";
    }
    if(fecha < 20 || fecha > 12) {
        return "Buenas tardes";
    }
    if(fecha <= 12 || fecha > 5) {
        return "Buenas tardes";
    }
}




  const containerName = document.getElementById('user_name');

  if (!localStorage.getItem('userName')) {
    const modalNameBg = document.querySelector(".modal-username-bg");
    const buttonName = document.querySelector(".modal-username__button");
    const inputName = document.querySelector(".modal-username__input"); // Referencia al input, no al value
    const body = document.querySelector("body");
    
    modalNameBg.classList.remove("desactivado");
    body.classList.add("non-scroll");

    buttonName.addEventListener("click", () => {
      const nombre = inputName.value; // Obtener el valor y eliminar espacios en blanco
      console.log(nombre);
      if (nombre) { // Solo si el nombre no está vacío
        // Guardar el nombre en localStorage
        localStorage.setItem('userName', nombre);

        // Mostrar el nombre del usuario en el elemento
        containerName.innerHTML = 'Bienvenido, ' + nombre + '!';

        // Ocultar el modal
        modalNameBg.classList.add("desactivado");
        body.classList.remove("non-scroll");
      } 
      else {
        inputName.classList.add("sacudir");
        setTimeout(()=>{inputName.classList.remove("sacudir");
        }, 1000);
      }
    });
  } else {
    // Si ya se ha guardado el nombre, mostrarlo directamente
    const nombreGuardado = localStorage.getItem('userName');
    containerName.innerHTML = saludo() + " " +  nombreGuardado + '!';
  }