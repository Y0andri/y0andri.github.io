const boton = document.querySelector('.btn-gen-html');
const resultadoDiv = document.querySelector('.resultado-codigo');

boton.addEventListener("click", ()=>{
const nombre = document.getElementById("nombre").value;
const imagen = document.getElementById("imagen").value;
const mensaje = document.getElementById("mensaje").value;
    
    if(nombre == "" || mensaje == "") {
        resultadoDiv.innerText = "Tanto el nombre como el mensaje deben rellenarse"
    }
    else {
        let imagenTag ;
        
        if (imagen == ""){
            imagenTag = "" ;
        }
        else {
            imagenTag = `<img src="${imagen}">` ;
        }
        
        let mensajeBr = mensaje.replaceAll('\n', "<br>");
        
        let codigo = `<div ${nombre}>${imagenTag}
        ${mensajeBr}
        </div>
        `
        resultadoDiv.innerText = codigo ;
        
    }
})