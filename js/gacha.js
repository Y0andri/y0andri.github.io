const btnGacha = document.querySelector('.gacha__button');
const errText = document.querySelector('.gacha__limite');
const gachaTreasures = document.querySelector('.gacha__treasures');
const yoandriLoad = document.querySelector('.yoandri-ludo');
const monedaCantidad = document.querySelector('.moneda-cantidad');
const soundCard1 = document.querySelector('.sound-card1');
const soundCard234 = document.querySelector('.sound-card234');
const soundCard5 = document.querySelector('.sound-card5');
const soundCard6 = document.querySelector('.sound-card6');
const cont1 = document.querySelector('p.level1');
const cont2 = document.querySelector('p.level2');
const cont3 = document.querySelector('p.level3');
const cont4 = document.querySelector('p.level4');
const cont5 = document.querySelector('p.level5');
const cont6 = document.querySelector('p.level6');

const obtenerRecompensa = ()=>{
    let numRandom = Math.floor(Math.random()*1000+1);
    if(numRandom <= 400) {
        return "1" ;
    }
    if(numRandom <= 700) {
        return "2" ;
    }
    if(numRandom <= 900) {
        return "3" ;
    }
    if(numRandom <= 970) {
        return "4" ;
    }
    if(numRandom <= 995) {
        return "5" ;
    }
    if(numRandom <= 1000) {
        return "6" ;
    }
    
}

function showContadores(){
    let treasuresString = localStorage.getItem('allTreasures');
    let treasuresArray = JSON.parse(treasuresString) || [];
    var contador1 = 0;
    var contador2 = 0;
    var contador3 = 0;
    var contador4 = 0;
    var contador5 = 0;
    var contador6 = 0;
    for(element of treasuresArray) {
        if(element == 1){
            contador1++;
        }
        if(element == 2){
            contador2++;
        }
        if(element == 3){
            contador3++;
        }
        if(element == 4){
            contador4++;
        }
        if(element == 5){
            contador5++;
        }
        if(element == 6){
            contador6++;
        }
    }
    cont1.innerText = contador1;
    cont2.innerText = contador2;
    cont3.innerText = contador3;
    cont4.innerText = contador4;
    cont5.innerText = contador5;
    cont6.innerText = contador6;
}

function playSound(a) {
    a.currentTime = 0;
    a.play();
}

function difHoras (){
    if(!localStorage.getItem('tiradaDate')) {
    return 0
    }
    else {
    var tiradaDateStr = localStorage.getItem('tiradaDate');
    var tiradaDate = Number(tiradaDateStr);
    }
    let date = new Date();
    diferencia = Math.floor((date - tiradaDate) / (1000 * 60 * 60));
    return diferencia ;
}

function showTreasure(){
    let treasuresString = localStorage.getItem('allTreasures');
    let treasuresArray = JSON.parse(treasuresString) || [];
    for (treasure of treasuresArray) {
    gachaTreasures.insertAdjacentHTML('afterbegin', `<img src="recursos/gacha/card${treasure}.jpg"></img>`);
}
}

if (!localStorage.getItem("allTreasures") || localStorage.getItem("allTreasures") == undefined || localStorage.getItem("allTreasures") == null){
        let allTreasures = [];
        localStorage.setItem("allTreasures", JSON.stringify(allTreasures));
        }
        

function showMonedas(){
if(!localStorage.getItem('cantMonedas')) {
    localStorage.setItem('cantMonedas', 3);
}
var monedasActual = Number(localStorage.getItem('cantMonedas')) + difHoras();
monedaCantidad.innerText = monedasActual;
}

showMonedas();
    
showTreasure();

showContadores();



btnGacha.addEventListener("click", ()=>{
    let date = new Date();
    let año = date.getFullYear();
    let mes = date.getMonth() + 1;
    let dia = date.getDate();
    let hora = date.getHours();
    let fecha = `${dia},${mes},${año}`;
    monedasActual = Number(localStorage.getItem('cantMonedas')) + difHoras();
    
    
    
    if( monedasActual == 0) {
        errText.classList.add('show-text');
        errText.innerHTML = `La ludopatía no acepta pobres. <br> <b class="b-gacha">Vuelve cuando tengas monedas</b> `;
        setTimeout(()=>{
            errText.classList.remove('show-text');
        }, 6000)
    }
    else {
        yoandriLoad.classList.add('show-yoandri');
        setTimeout(()=>{
        let recompensa = obtenerRecompensa();
        let treasuresString = localStorage.getItem('allTreasures');
        let treasuresArray = JSON.parse(treasuresString) || [];
        treasuresArray.push(recompensa);
        localStorage.setItem('allTreasures', JSON.stringify(treasuresArray));
        localStorage.setItem("tiradaDate", Date.now());
        localStorage.setItem('cantMonedas', monedasActual - 1);
        showMonedas();
        gachaTreasures.innerHTML = " ";
        showTreasure();
        showContadores();
        yoandriLoad.classList.remove('show-yoandri');
        if(recompensa == 1) {
        soundCard1.currentTime = 0;
        soundCard1.playbackRate = 2.0;
        soundCard1.play();
        }
        if(recompensa == 2 || recompensa == 3 || recompensa == 4) {
            playSound(soundCard234);
        }
        if(recompensa == 5) {
            playSound(soundCard5);
        }
        if(recompensa == 6) {
            playSound(soundCard6);
        }
        }, 4000)
    }
})

