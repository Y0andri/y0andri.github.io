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
          ultimosMensajes = data.record || [];
          ultimaVersion = nuevaVersion;
          ultimaActualizacion = new Date();
          mostrarMensajes(ultimosMensajes);
          notificarNuevosMensajes();
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
  if (document.querySelectorAll('.mensaje').length !== mensajes.length) {
    var html = '';
    for (var i = 0; i < mensajes.length; i++) {
      html += '<div class="mensaje">' +
                '<h3>' + escapeHTML(mensajes[i].nombre) + '</h3>' +
                '<p>' + escapeHTML(mensajes[i].mensaje) + '</p>' +
                '<small>' + new Date(mensajes[i].fecha).toLocaleString() + '</small>' +
              '</div>';
    }
    mensajesList.innerHTML = html;
  }
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
    })
    .catch(function(error) {
      console.error("Error enviando mensaje:", error);
      alert("Error al enviar. Intenta nuevamente.");
    });
}

// Iniciar
document.addEventListener('DOMContentLoaded', init);