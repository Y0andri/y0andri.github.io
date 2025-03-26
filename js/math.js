
const outResultado = document.getElementById('resultado');
const btnMediana = document.getElementById('btn_mediana');
const btnPuntoMedio = document.getElementById('btn_puntomedio'); 
const btnLongitud = document.getElementById('btn_longitud');

const inputs = ()=>{
    aX = document.getElementById('aX').value;
    aY = document.getElementById('aY').value;
    bX = document.getElementById('bX').value;
    bY = document.getElementById('bY').value;
}

const mediana = ()=>{
    inputs();
    while (!aX || !aY || !bX || !bY) {
        return "rellena todos los campos";
    }
    let y = aY - bY;
    let x = aX - bX;
    if(x == 0) {
    return "no tiene solución";
    }
    if(true == Number.isInteger(y / x)) {
    return y / x ;
    } 
    else {
    return y + "/" + x ;
    }
}

const longitud = ()=>{
    inputs();
    while (!aX || !aY || !bX || !bY) {
        return "rellena todos los campos";
    }
    let y = aY - bY;
    let x = aX - bX;
    let sDeP = Math.pow(x,2) + Math.pow(y,2);
    if(true == Number.isInteger(Math.sqrt(sDeP))) {
    return Math.sqrt(sDeP);
    }
    else {
    return "√" + sDeP ;
    }
}

const puntoMedio = ()=>{
    inputs();
    while (!aX || !aY || !bX || !bY) {
        return "rellena todos los campos";
    }
    let y = aY + bY;
    let x = aX + bX;
    return "(" + x / 2 + ";" + y / 2 + ")";
}



btnMediana.addEventListener('click', function(event){
    outResultado.innerText = mediana();
})
btnPuntoMedio.addEventListener('click', function(event){
    outResultado.innerText = puntoMedio();
})
btnLongitud.addEventListener('click', function(event){
    outResultado.innerText = longitud();
})




