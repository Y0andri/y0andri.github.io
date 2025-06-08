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

var db = new Dexie("GachaDB");
db.version(1).stores({ treasures: "++id,card,date" });

db.treasures.count().then(function (count) {
  if (count === 0) {
    var old = localStorage.getItem("allTreasures");
    if (old) {
      try {
        var datos = JSON.parse(old);
        if (Array.isArray(datos)) {
          var nuevos = datos.map(function(card) { return { card: card, date: "00" }; });
          db.treasures.bulkAdd(nuevos);
          
        }
      } catch (e) {}
    }
  }
});

function guardarCarta(card) {
  var fecha = new Date().toISOString();
  return db.treasures.add({ card: card, date: fecha });
}

function cargarCartas(callback) {
  db.treasures.toArray().then(callback);
}

function eliminarCartas(card, cantidad, callback) {
  db.treasures.where('card').equals(card).limit(cantidad).toArray().then(function (result) {
    var ids = result.map(function(x) { return x.id; });
    db.treasures.bulkDelete(ids).then(callback);
  });
}

function showTreasure() {
  cargarCartas(function (cartas) {
    gachaTreasures.innerHTML = " ";
    for (var i = 0; i < cartas.length; i++) {
      var c = cartas[i].card;
      var fecha = new Date(cartas[i].date)
      .toLocaleString()
      .split(",")
      .reverse()
      .join(" "); // Formato legible para el alt
      gachaTreasures.insertAdjacentHTML(
        'afterbegin',
        '<div class="treasure-card"><img id="img-level-' + c + '" src="recursos/gacha/card' + c + '.jpg" alt=""><p class="level'+c+'">'+fecha+'</p></div>' 
      );
    }
  });
}


function showContadores(callback) {
  cargarCartas(function (cartas) {
    var contador = [0, 0, 0, 0, 0, 0];
    for (var i = 0; i < cartas.length; i++) {
      var c = parseInt(cartas[i].card);
      if (c >= 1 && c <= 6) contador[c - 1]++;
    }
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < cont[i].length; j++) cont[i][j].innerText = contador[i];
    }
    actualizarClasesCanjeables(contador);
    if (callback) callback(contador);
  });
}

function actualizarClasesCanjeables(contador) {
  if (contador[0] >= 4) canjLevel2.classList.add('canjeable'); else canjLevel2.classList.remove('canjeable');
  if (contador[0] >= 5) canjLevel3.classList.add('canjeable'); else canjLevel3.classList.remove('canjeable');
  if (contador[1] >= 6) canjLevel4.classList.add('canjeable'); else canjLevel4.classList.remove('canjeable');
  if (contador[2] >= 7) canjLevel5.classList.add('canjeable'); else canjLevel5.classList.remove('canjeable');
}

function obtenerRecompensa() {
  var n = Math.floor(Math.random() * 1000 + 1);
  if (n <= 400) return "1";
  if (n <= 700) return "2";
  if (n <= 900) return "3";
  if (n <= 970) return "4";
  if (n <= 995) return "5";
  return "6";
}

function difHoras() {
  var tiradaDate = Number(localStorage.getItem("tiradaDate") || 0);
  return Math.floor((Date.now() - tiradaDate) / (1000 * 60 * 60));
}

function showMonedas() {
  if (!localStorage.getItem('numMonedas')){
    localStorage.setItem('numMonedas', 20);
    localStorage.setItem("tiradaDate", Date.now());
  }
  var monedas = Number(localStorage.getItem('numMonedas')) + difHoras();
  monedaCantidad.innerText = monedas;
}

function playSound(a) {
  a.currentTime = 0;
  a.play();
}

function updateGacha() {
  showTreasure();
  showContadores();
  valorColeccion();
}

function hacerTirada() {
  var monedas = Number(localStorage.getItem('numMonedas')) + difHoras();
  if (monedas === 0) {
    errText.classList.add('show-text');
    errText.innerHTML = 'La ludopatía no acepta pobres. <br> <b class="b-gacha">Vuelve cuando tengas monedas</b>';
    setTimeout(function () { errText.classList.remove('show-text'); }, 6000);
    return;
  }
  yoandriLoad.classList.add('show-yoandri');
  setTimeout(function () {
    var recompensa = obtenerRecompensa();
    guardarCarta(recompensa).then(function () {
      localStorage.setItem("tiradaDate", Date.now());
      localStorage.setItem("numMonedas", monedas - 1);
      showMonedas();
      updateGacha();
      yoandriLoad.classList.remove('show-yoandri');
      if (recompensa == "1") {
        soundCard1.currentTime = 0;
        soundCard1.playbackRate = 2.0;
        soundCard1.play();
      } else if (["2", "3", "4"].indexOf(recompensa) !== -1) {
        playSound(soundCard234);
      } else if (recompensa == "5") {
        playSound(soundCard5);
      } else if (recompensa == "6") {
        playSound(soundCard6);
      }
    });
  }, 4000);
}

function hacerCanje(cartaBase, cantidad, cartaNueva, contenedor) {
  showContadores(function (contador) {
    var index = parseInt(cartaBase) - 1;
    if (contador[index] >= cantidad) {
      playSound(soundCanjear);
      eliminarCartas(cartaBase, cantidad, function () {
        guardarCarta(cartaNueva).then(function () {
          popupCanjear.innerHTML = '<img src="recursos/gacha/card' + cartaNueva + '.jpg" alt="">';
          popupCanjear.classList.add("popup-active");
          updateGacha();
          setTimeout(function () { popupCanjear.classList.remove("popup-active"); }, 1500);
        });
      });
    } else {
      contenedor.classList.add("shake");
      setTimeout(function () { contenedor.classList.remove("shake"); }, 500);
    }
  });
}

canjLevel2.addEventListener('click', function () { hacerCanje("1", 4, "2", canjCont1); });
canjLevel3.addEventListener('click', function () { hacerCanje("2", 5, "3", canjCont2); });
canjLevel4.addEventListener('click', function () { hacerCanje("3", 6, "4", canjCont3); });
canjLevel5.addEventListener('click', function () { hacerCanje("4", 7, "5", canjCont4); });
btnGacha.addEventListener("click", hacerTirada);

function valorColeccion(bonusPercent) {
  if (typeof bonusPercent === 'undefined') bonusPercent = 0.05;
  cargarCartas(function (cartas) {
    var contad = [0, 0, 0, 0, 0, 0];
    for (var i = 0; i < cartas.length; i++) {
      contad[parseInt(cartas[i].card) - 1]++;
    }
    var probabilidades = { 1: 0.40, 2: 0.30, 3: 0.20, 4: 0.07, 5: 0.025, 6: 0.005 };
    var canjes = { 1: 4, 2: 5, 3: 6, 4: 7 };
    var bonus = 1 + bonusPercent;
    var valorPuro = {}, valorProbAjustado = {}, valorFinal = {};

    for (var i = 1; i <= 6; i++) {
      valorPuro[i] = 1 / probabilidades[i];
      valorProbAjustado[i] = (i >= 2 && i <= 5) ? valorPuro[i] * canjes[i - 1] : valorPuro[i];
    }

    valorFinal[1] = valorProbAjustado[1];
    for (var i = 2; i <= 5; i++) {
      var canjeVal = valorFinal[i - 1] * canjes[i - 1] * bonus;
      valorFinal[i] = Math.max(valorProbAjustado[i], canjeVal);
    }
    valorFinal[6] = valorProbAjustado[6];

    var total = 0;
    for (var i = 1; i <= 6; i++) total += contad[i - 1] * valorFinal[i];
    valorColeccionP.innerText = Math.ceil(total / 10);
  });
}

showMonedas();
showTreasure();
showContadores();
valorColeccion();
