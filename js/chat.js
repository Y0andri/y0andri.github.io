// CONFIGURA ESTOS VALORES 👇 (obténlos en jsonbin.io)
const API_KEY = "$2a$10$QBpnVlqFPhaiynczLJl7fuotcF3IAww5INCQXiVp8H3k7jXZuwDy2";
const BIN_ID = "6808165f8561e97a500552df";

// Elementos del DOM
const form = document.querySelector(".tankegram-bar-form");
const mensajesList = document.querySelector(".mensaje-list");

// Estado global
let ultimosMensajes = [];
let ultimaVersion = null;
let ultimaActualizacion = null;

// Función principal
async function init() {
  await verificarYActualizarMensajes();
  form.addEventListener("submit", enviarMensaje);
  
  // Verificar cambios cada 3 segundos
  setInterval(verificarYActualizarMensajes, 3000);
}

// Verifica cambios y actualiza si es necesario
async function verificarYActualizarMensajes() {
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 
        "X-Master-Key": API_KEY,
        "If-None-Match": ultimaVersion // Envía la versión conocida
      },
      cache: 'no-store'
    });

    // Si no hay cambios (304 Not Modified)
    if (response.status === 304) {
      console.log('No hay cambios en los mensajes');
      return;
    }

    // Si hay cambios
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();
    const nuevaVersion = response.headers.get('etag');
    
    // Comparar contenido (por si acaso)
    if (JSON.stringify(data.record) !== JSON.stringify(ultimosMensajes)) {
      ultimosMensajes = data.record || [];
      ultimaVersion = nuevaVersion;
      ultimaActualizacion = new Date();
      mostrarMensajes(ultimosMensajes);
      notificarNuevosMensajes();
    }
  } catch (error) {
    console.error("Error verificando mensajes:", error);
    // Reintentar después de 10 segundos si falla
    setTimeout(verificarYActualizarMensajes, 10000);
  }
}

// Mostrar mensajes en el HTML (optimizado)
function mostrarMensajes(mensajes) {
  // Solo actualiza el DOM si hay cambios reales
  if (document.querySelectorAll('.mensaje').length !== mensajes.length) {
    mensajesList.innerHTML = mensajes.map(mensaje => `
      <div class="mensaje">
        <h3>${escapeHTML(mensaje.nombre)}</h3>
        <p>${escapeHTML(mensaje.mensaje)}</p>
        <small>${new Date(mensaje.fecha).toLocaleString()}</small>
      </div>
    `).join("");
  }
}

// Notificar nuevos mensajes
function notificarNuevosMensajes() {
  // Opcional: reproducir sonido o mostrar notificación
  if (Notification.permission === 'granted') {
    new Notification('Nuevos mensajes en Tankegram');
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
}

// Seguridad: escapar HTML
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));
}

// Enviar mensaje (optimizado)
async function enviarMensaje(e) {
  e.preventDefault();
  
  const nombre = localStorage.getItem("userName");
  const mensaje = document.querySelector(".mensaje-box").value.trim();

  if (!nombre || !mensaje) return;

  try {
    // Optimización: no necesitamos cargar mensajes si ya los tenemos
    const nuevosMensajes = [...ultimosMensajes, {
      nombre: nombre,
      mensaje: mensaje,
      fecha: new Date().toISOString()
    }];

    // Actualizar servidor
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
        "X-Bin-Versioning": "false"
      },
      body: JSON.stringify(nuevosMensajes)
    });

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    // Actualizar estado local
    ultimosMensajes = nuevosMensajes;
    ultimaVersion = response.headers.get('etag');
    mostrarMensajes(ultimosMensajes);
    form.reset();
    
  } catch (error) {
    console.error("Error enviando mensaje:", error);
    alert("Error al enviar. Intenta nuevamente.");
  }
}

// Iniciar la aplicación
init();