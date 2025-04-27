const btnGacha = document.querySelector('.gacha__button');
const errText = document.querySelector('.gacha__limite');
const gachaTreasures = document.querySelector('.gacha__treasures');
const yoandriLoad = document.querySelector('.yoandri-ludo');
const monedaCantidad = document.querySelector('.moneda-cantidad');
const soundCanjear = document.querySelector('.sound-canjear');
const soundCard1 = document.querySelector('.sound-card1');
const soundCard234 = document.querySelector('.sound-card234');
const soundCard5 = document.querySelector('.sound-card5');
const soundCard6 = document.querySelector('.sound-card6');
const popupCanjear = document.querySelector('.popup-canjear');
const valorColeccionP = document.querySelector('.valor-coleccion');
const canjCont1 = document.querySelector('.canje-container.n1');
const canjCont2 = document.querySelector('.canje-container.n2');
const canjCont3 = document.querySelector('.canje-container.n3');
const canjCont4 = document.querySelector('.canje-container.n4');
const cont = [
document.querySelectorAll('.level1'),
document.querySelectorAll('.level2'),
document.querySelectorAll('.level3'),
document.querySelectorAll('.level4'),
document.querySelectorAll('.level5'),
document.querySelectorAll('.level6')
];

const canjLevel2 = document.querySelector('.canjear-level2');
const canjLevel3 = document.querySelector('.canjear-level3');
const canjLevel4 = document.querySelector('.canjear-level4');
const canjLevel5 = document.querySelector('.canjear-level5');


const updateGacha = ()=>{
    showTreasure();
    showContadores();
    valorColeccion();
};

const canjear = (card1,cant1,card2)=>{
    let cartasString = localStorage.getItem("allTreasures");
    let cartas = JSON.parse(cartasString) || [];
    let cantidad = 0;
    let i = 0 ;
    while(i < cartas.length && cantidad < cant1 ){
        if(cartas[i] === card1 ){
            cartas.splice(i,1);
            cantidad++ ;
        }
        else {
            i++;
        }
    }
    cartas.push(card2);
    localStorage.setItem("allTreasures",JSON.stringify(cartas) );
};

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
    
};

function showContadores(){
    let treasuresString = localStorage.getItem('allTreasures');
    let treasuresArray = JSON.parse(treasuresString) || [];
    
    const contador = [
        0,0,0,0,0,0
        ];
    for(let i = 0; i < 6; i++){
    for(let element of treasuresArray) {
        if(element == (i + 1)){
            contador[i]++ ;
        }
    }
    }for(let i = 0; i < 6; i++) {
    for(let j = 0; j < cont[i].length; j++) {  // Uso de índice numérico.
        cont[i][j].innerText = contador[i];   // Acceso directo al elemento.
    }
}

    if(contador[0] >= 4){
        canjLevel2.classList.add('canjeable');
    } else {
        canjLevel2.classList.remove('canjeable');
    }
    if(contador[0] >= 5){
        canjLevel3.classList.add('canjeable');
    } else {
        canjLevel3.classList.remove('canjeable');
    }
    return contador ;
}

function playSound(a) {
    a.currentTime = 0;
    a.play();
}

function difHoras (){
    if(!localStorage.getItem('tiradaDate')) {
    return 0;
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
    gachaTreasures.innerHTML = " ";
    for (let treasure of treasuresArray) {
    gachaTreasures.insertAdjacentHTML('afterbegin', `<img id="img-level-${treasure}" src="recursos/gacha/card${treasure}.jpg"></img>`);
}
}


function showTreasureInventory(){
    let treasuresString = localStorage.getItem('allTreasures');
    let treasuresArray = JSON.parse(treasuresString) || [];
    gachaInventory.innerHTML = " ";
    for (let treasure of treasuresArray) {
    gachaInventory.insertAdjacentHTML('afterbegin', `<img id="img-level-${treasure}" src="recursos/gacha/card${treasure}.jpg"></img>`);
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


canjLevel2.addEventListener('click',()=>{
    let cantidad = 4;
    let ctn = showContadores();
    if(ctn[0] >= cantidad){
        playSound(soundCanjear);
        canjear("1",cantidad,"2");
        popupCanjear.innerHTML = '<img src="recursos/gacha/card2.jpg" alt="">' ;
        popupCanjear.classList.add("popup-active");
        updateGacha();
        setTimeout(()=>{
            popupCanjear.classList.remove("popup-active");
        },1500);
        
    }
    else {
        canjCont1.classList.add("shake");
        setTimeout(()=>{
        canjCont1.classList.remove("shake");

        }, 500);
    }
});
canjLevel3.addEventListener('click',()=>{
    let cantidad = 5;
    let ctn = showContadores();
    if(ctn[1] >= cantidad){
        playSound(soundCanjear);
        canjear("2",cantidad,"3");
        updateGacha();
        popupCanjear.innerHTML = '<img src="recursos/gacha/card3.jpg" alt="">' ;
        popupCanjear.classList.add("popup-active");
        setTimeout(()=>{
            popupCanjear.classList.remove("popup-active");
        },1500)
    }
    else {
        canjCont2.classList.add("shake");
        setTimeout(()=>{
        canjCont2.classList.remove("shake");

        }, 500);
    }
});
canjLevel4.addEventListener('click',()=>{
    let cantidad = 6;
    let ctn = showContadores();
    if(ctn[2] >= cantidad){
        playSound(soundCanjear);
        canjear("3",cantidad,"4");
        popupCanjear.innerHTML = '<img src="recursos/gacha/card4.jpg" alt="">' ;
        popupCanjear.classList.add("popup-active");
        updateGacha();
        setTimeout(()=>{
            popupCanjear.classList.remove("popup-active");
        },1500)
    }
    else {
        canjCont3.classList.add("shake");
        setTimeout(()=>{
        canjCont3.classList.remove("shake");

        }, 500);
    }
});
canjLevel5.addEventListener('click',()=>{
    let cantidad = 7;
    let ctn = showContadores();
    if(ctn[3] >= cantidad){
        playSound(soundCanjear);
        canjear("4",cantidad,"5");
        popupCanjear.classList.add("popup-active");
        popupCanjear.innerHTML = '<img src="recursos/gacha/card5.jpg" alt="">' ;
        updateGacha();
        setTimeout(()=>{
            popupCanjear.classList.remove("popup-active");
        },1500)
    }
    else {
        canjCont4.classList.add("shake");
        setTimeout(()=>{
        canjCont4.classList.remove("shake");

        }, 500);
    }
});

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
        }, 6000);
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
        updateGacha();
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




// valorColeccion


function valorColeccion(bonusPercent = 0.05){
  const contad = showContadores();            // [n1, n2, ..., n6]
  const probabilidades = { 1:0.40, 2:0.30, 3:0.20, 4:0.07, 5:0.025, 6:0.005 };
  const canjes         = { 1:4,    2:5,    3:6,    4:7   };
  const bonus = 1 + bonusPercent;             // 1.05 para 5%, 1.10 para 10%

  // 1) valor puro (inverso de la probabilidad)
  const valorPuro = {};
  for(let i = 1; i <= 6; i++){
    valorPuro[i] = 1 / probabilidades[i];
  }

  // 2) valor “base” por probabilidad ajustada (cantidad de cartas necesarias)
  const valorProbAjustado = {};
  for(let i = 1; i <= 6; i++){
    if(i >= 2 && i <= 5){
      valorProbAjustado[i] = valorPuro[i] * canjes[i - 1];
    } else {
      valorProbAjustado[i] = valorPuro[i];
    }
  }

  // 3) valor final por nivel: elegimos el mayor entre
  //    • el valorProbAjustado (sumar y “cobrar” cada carta por separado)  
  //    • el valor de canjear al nivel anterior + bonus
  const valorFinal = {};
  valorFinal[1] = valorProbAjustado[1];
  for(let i = 2; i <= 5; i++){
    const canjeVal = valorFinal[i - 1] * canjes[i - 1] * bonus;
    valorFinal[i] = Math.max(valorProbAjustado[i], canjeVal);
  }
  valorFinal[6] = valorProbAjustado[6];

  // 4) suma total de la colección
  let total = 0;
  for(let i = 1; i <= 6; i++){
    total += contad[i - 1] * valorFinal[i];
  }

  // 5) escalado/formateo (igual que antes)
  const valorDefinitivo = Math.ceil(total / 10);
  valorColeccionP.innerText = valorDefinitivo;
  return valorDefinitivo;
}




valorColeccion();

