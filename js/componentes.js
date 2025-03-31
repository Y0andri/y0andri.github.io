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
      
      
    // Temas

      
    


    let tema = localStorage.getItem("tema");
    const themeSwitch = document.getElementById("theme-changer");
    const body = document.querySelector("body");

    
    
    themeSwitch.addEventListener('click', function(){
        body.classList.toggle("light");
        if(body.classList.contains("light")) {
          localStorage.setItem("tema", 'light');
        }
        else {
          localStorage.removeItem("tema");
        }
    } )
      
    });

  // Cargar el footer
  fetch('componentes/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    });