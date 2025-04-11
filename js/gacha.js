const btnGacha = document.querySelector('.gacha__button');
const errText = document.querySelector('.gacha__limite');
const gachaTreasures = document.querySelector('.gacha__treasures');
const yoandriLoad = document.querySelector('.yoandri-ludo');
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

function showTreasure(){
    let treasuresString = localStorage.getItem('allTreasures');
    let treasuresArray = JSON.parse(treasuresString) || [];
    for (treasure of treasuresArray) {
    gachaTreasures.insertAdjacentHTML('afterbegin', `<article class="rango${treasure}"></article>`);
}
}

if (!localStorage.getItem("allTreasures") || localStorage.getItem("allTreasures") == undefined || localStorage.getItem("allTreasures") == null){
        let allTreasures = [];
        localStorage.setItem("allTreasures", JSON.stringify(allTreasures));
        }
    
showTreasure();

showContadores();



btnGacha.addEventListener("click", ()=>{
    let date = new Date();
    let año = date.getFullYear();
    let mes = date.getMonth() + 1;
    let dia = date.getDate();
    let hora = date.getHours();
    let fecha = `${dia},${mes},${año}`;
    
    const ultHoraTirada = Number(localStorage.getItem("tiradaHora")) || -100;
    const ultDiaTirada = Number(localStorage.getItem('tiradaDia')) || -1;
    
    if( dia === ultDiaTirada && hora < ultHoraTirada + 1) {
        let horaVolver = ultHoraTirada + 1;
        if (horaVolver >= 12) {
            horaVolver = (horaVolver - 12) + "pm";
        }
        else {
            horaVolver = horaVolver + "am"
        }
        errText.classList.add('show-text');
        errText.innerHTML = `Tu ludopatía tendrá que esperar una hora. <br> <b class="b-gacha">Vuelve a las `  + horaVolver + "</b>";
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
        localStorage.setItem("tiradaDia", dia );
        localStorage.setItem("tiradaHora", hora );
        localStorage.setItem("tiradaMes", mes)
        gachaTreasures.innerHTML = " ";
        showTreasure();
        showContadores();
        yoandriLoad.classList.remove('show-yoandri');
        }, 4000)
    }
})

