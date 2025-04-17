  // Cargar el header
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
      
      
      
      
      //Menu
    
    const navOpenner = document.getElementById("nav_openner");
    const navCloser = document.getElementById("nav_closer");
    const nav = document.getElementById("nav");
    
    navOpenner.addEventListener("click", ()=>{
        nav.classList.toggle("nav--active");
    })
    navCloser.addEventListener("click", ()=>{
        nav.classList.remove("nav--active");
    })
      
    // Temas

      
    let tema = localStorage.getItem("tema");
    const themeOpenner = document.querySelector(".btn-theme");
    const themeBg = document.querySelector(".modal-theme-bg");
    const body = document.querySelector("body");
    const btnTheme = document.querySelectorAll('.modal-theme button');
    const btnDark = document.querySelector(".theme-dark");
    const btnLight = document.querySelector(".theme-light");
    const btnDbz = document.querySelector(".theme-dbz");
    
    const ponerTema = (tEma)=>{
        body.className = " ";
        body.classList.add(tEma);
        localStorage.setItem("tema", tEma);
    }
    

    btnLight.addEventListener('click', ()=>{
        ponerTema("Light");
    } )
    btnDark.addEventListener('click', ()=>{
        ponerTema("Dark");
    } )
    btnDbz.addEventListener('click', ()=>{
        ponerTema("Dbz");
    } )
    
    
    themeOpenner.addEventListener('click', function(e){
        themeBg.classList.toggle("desactivado");
        body.classList.add("non-scroll");
    } )
    
    for(let btn of btnTheme){
    btn.addEventListener("click",(e)=>{
        e.stopPropagation();
    })
    }
    
    themeBg.addEventListener('click', ()=>{
        themeBg.classList.toggle("desactivado");
        body.classList.remove("non-scroll");
    })
    
    
    
  
    
    
      
    });

  // Cargar el footer
  fetch('componentes/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    });