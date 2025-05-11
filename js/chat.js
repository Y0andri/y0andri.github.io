// chat.js modificado (compatible con navegadores antiguos)
// Agrega estos polyfills en tu HTML ANTES de este script:
// <script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/whatwg-fetch@3.6.2/dist/fetch.umd.min.js"></script>

// CONFIGURA ESTOS VALORES 👇
var API_KEY = "$2a$10$QBpnVlqFPhaiynczLJl7fuotcF3IAww5INCQXiVp8H3k7jXZuwDy2";
var BIN_ID = "6808165f8561e97a500552df";

// Elementos del DOM
var form = document.querySelector(".tankegram-bar-form");
var mensajesList = document.querySelector(".mensaje-list");

// Estado global
var ultimosMensajes = [];
var ultimaVersion = null;
var ultimaActualizacion = null;
var mensajesAnteriores = parseInt(localStorage.getItem("cantidadMensajes") || "0");

// Función principal
function init() {
  verificarYActualizarMensajes()
    .then(function() {
      form.addEventListener("submit", function(e) {
        enviarMensaje(e);
      });
      
      // Verificar cambios cada 3 segundos
      setInterval(verificarYActualizarMensajes, 3000);
    })
    .catch(function(error) {
      console.error("Error en init:", error);
    });
}

// Verificar cambios y actualizar
function verificarYActualizarMensajes() {
  return fetch('https://api.jsonbin.io/v3/b/' + BIN_ID + '/latest', {
    headers: { 
      "X-Master-Key": API_KEY,
      "If-None-Match": ultimaVersion
    },
    cache: 'no-store'
  })
    .then(function(response) {
      if (response.status === 304) {
        console.log('Sin cambios');
        return;
      }

      if (!response.ok) throw new Error('Error HTTP: ' + response.status);

      return response.json().then(function(data) {
        var nuevaVersion = response.headers.get('etag');
        
        if (JSON.stringify(data.record) !== JSON.stringify(ultimosMensajes)) {
          // Si hay mensajes nuevos y ya teníamos mensajes cargados, quitamos los estilos de nuevo
          if (ultimosMensajes.length > 0 && data.record && data.record.length > ultimosMensajes.length) {
            quitarEstiloNuevosMensajes();
          }
          
          ultimosMensajes = data.record || [];
          ultimaVersion = nuevaVersion;
          ultimaActualizacion = new Date();
          mostrarMensajes(ultimosMensajes);
          notificarNuevosMensajes();
          
          // Guardar cantidad actual de mensajes en localStorage
          localStorage.setItem("cantidadMensajes", ultimosMensajes.length.toString());
        }
      });
    })
    .catch(function(error) {
      console.error("Error verificando mensajes:", error);
      setTimeout(verificarYActualizarMensajes, 10000);
    });
}

// Mostrar mensajes
function mostrarMensajes(mensajes) {
  var mensajesActuales = document.querySelectorAll('.mensaje').length;
  
  // Si no hay mensajes en el DOM o hay menos que los que tenemos en datos, los mostramos
  if (mensajesActuales === 0) {
    // Primera carga: mostrar todos los mensajes
    var html = '';
    for (var i = 0; i < mensajes.length; i++) {
      var esNuevo = i >= mensajesAnteriores;
      var claseNuevo = esNuevo ? ' mensaje-nuevo' : '';
      
      html += '<div class="mensaje' + claseNuevo + '" data-id="' + i + '">' +
                '<h3>' + escapeHTML(mensajes[i].nombre) + '</h3>' +
                '<p>' + escapeHTML(mensajes[i].mensaje) + '</p>' +
                '<small>' + new Date(mensajes[i].fecha).toLocaleString() + '</small>' +
              '</div>';
    }
    mensajesList.innerHTML = html;
  } 
  else if (mensajesActuales < mensajes.length) {
    // Solo añadir mensajes nuevos
    for (var i = mensajesActuales; i < mensajes.length; i++) {
      var nuevoMensaje = document.createElement('div');
      nuevoMensaje.className = 'mensaje mensaje-nuevo';
      nuevoMensaje.setAttribute('data-id', i);
      
      var nombre = document.createElement('h3');
      nombre.textContent = mensajes[i].nombre;
      
      var texto = document.createElement('p');
      texto.textContent = mensajes[i].mensaje;
      
      var fecha = document.createElement('small');
      fecha.textContent = new Date(mensajes[i].fecha).toLocaleString();
      
      nuevoMensaje.appendChild(nombre);
      nuevoMensaje.appendChild(texto);
      nuevoMensaje.appendChild(fecha);
      
      mensajesList.appendChild(nuevoMensaje);
    }
  }
  
  // Actualizar la variable de mensajes anteriores después de mostrarlos
  mensajesAnteriores = mensajes.length;
}

// Notificaciones
function notificarNuevosMensajes() {
  if (Notification.permission === 'granted') {
    new Notification('Nuevos mensajes en Tankegram');
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
}

// Escapar HTML
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, function(tag) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag];
  });
}

// Enviar mensaje
function enviarMensaje(e) {
  e.preventDefault();
  
  var nombre = localStorage.getItem("userName");
  var mensaje = document.querySelector(".mensaje-box").value.trim();

  if (!nombre || !mensaje) return;

  var nuevosMensajes = ultimosMensajes.slice();
  nuevosMensajes.push({
    nombre: nombre,
    mensaje: mensaje,
    fecha: new Date().toISOString()
  });

  // Quitar la clase 'mensaje-nuevo' de todos los mensajes cuando se envía uno nuevo
  quitarEstiloNuevosMensajes();

  fetch('https://api.jsonbin.io/v3/b/' + BIN_ID, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY,
      "X-Bin-Versioning": "false"
    },
    body: JSON.stringify(nuevosMensajes)
  })
    .then(function(response) {
      if (!response.ok) throw new Error('Error HTTP: ' + response.status);
      return response.headers.get('etag');
    })
    .then(function(etag) {
      ultimosMensajes = nuevosMensajes;
      ultimaVersion = etag;
      mostrarMensajes(ultimosMensajes);
      form.reset();
      
      // Guardar nueva cantidad de mensajes
      localStorage.setItem("cantidadMensajes", ultimosMensajes.length.toString());
    })
    .catch(function(error) {
      console.error("Error enviando mensaje:", error);
      alert("Error al enviar. Intenta nuevamente.");
    });
}

// Función para quitar el estilo de mensajes nuevos
function quitarEstiloNuevosMensajes() {
  var mensajesNuevos = document.querySelectorAll('.mensaje-nuevo');
  for (var i = 0; i < mensajesNuevos.length; i++) {
    mensajesNuevos[i].classList.remove('mensaje-nuevo');
  }
}

// Iniciar
document.addEventListener('DOMContentLoaded', init);