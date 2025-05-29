



document.addEventListener("DOMContentLoaded",function(){


const body = document.querySelector("body");
  // Inicializador de Tema
  let tema = localStorage.getItem("tema");
if(localStorage.getItem("tema")) {
      document.body.classList.add(tema);
    }
    
    
    
    
    
    
    
    
    //Chrome 50 Compatibility
    
    function ponerTema(tEma){
        body.className = " ";
        body.classList.add(tEma);
        localStorage.setItem("tema", tEma);
        themeBg.classList.toggle("desactivado");
        body.classList.remove("non-scroll");
    }
    
    const lightAlt = document.querySelector(".btn-light-alt");
    const darkAlt = document.querySelector(".btn-dark-alt");
    const dbzAlt = document.querySelector(".btn-dbz-alt");
    
    lightAlt.addEventListener('click', function(){
        ponerTema("Light");
    } );
    darkAlt.addEventListener('click', function(){
        ponerTema("Dark");
    } );
    dbzAlt.addEventListener('click', function(){
        ponerTema("Dbz");
    } );
    
    
    
    
});





