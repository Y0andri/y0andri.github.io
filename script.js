  const SUPABASE_URL = 'https://pnsbpdksuateqsvwdyld.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuc2JwZGtzdWF0ZXFzdndkeWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NjA0ODcsImV4cCI6MjA1ODIzNjQ4N30.jJwBcM31Zw42PH5HrKxiSpxJsgFwZEeaTnYYUvKa2Ag';
        window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        while(supabase == undefined){
            setTimeout(()=>{
                window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                
                console.log("intento");
            },3000);
        }
        
        // Verifica al cargar la página
supabase.auth.onAuthStateChange((event, session) => {
  if (session) { // Usuario logeado
    console.log("Sesión activa:", session.user.email);
    document.getElementById("logout-btn").style.display = "block";
  } else { // No logeado
    console.log("No hay sesión");
  }
});


// async function getMyUser(){
//     const { data: { user }, error } = await supabase.auth.getUser();
//     const usuario = user;
//     console.log(usuario);
//     return user;
// }

// async function checkLog(){
//     const usuario = await getMyUser();
//     if(usuario){
//         return;
//     } else {
//     if(["/","/index.html","/log.html","/sign.html"].includes(location.pathname)) {
//         console.log("sitio publico");
//     } else {
//         if(!user) window.location.href = "log.html";
//     }
//     }
// }

// checkLog();



document.addEventListener("DOMContentLoaded",function(){
    
    
// const btnLogout = document.querySelector(".logout-btn");

// btnLogout.addEventListener("click", async ()=>{
//     const { error } = await supabase.auth.signOut();
//     if(error){
//         console.log("Error al cerrae sesion");
//         return;
//     }
//     console.log("sesion cerrada");
// });


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





