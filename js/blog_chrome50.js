// Convertir constantes globales a var
var keyImgBb = "42c2035207510686c7c9d6f3301059b3";
var keyBin = "6843670a8561e97a50207460";
var xMasterKey = "$2a$10$wvBBvlgwlGvRYa9Fxhn2peWhelUGxVHKEmhBXVpzJJg3x6oSnqDM.";

// Reemplazar async/await con Promesas y XHR
function getArticlesPromise() {
  return new Promise(function(resolve) {
    function fetchWithRetry() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://api.jsonbin.io/v3/b/' + keyBin);
      xhr.setRequestHeader('X-Master-Key', xMasterKey);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log("Promesa Resuelta JsonBin");
          resolve(JSON.parse(xhr.responseText).record);
        } else {
          handleError();
        }
      };
      
      xhr.onerror = handleError;
      
      function handleError() {
        console.error("Error cargando el json");
        setTimeout(fetchWithRetry, 3000);
      }
      
      xhr.send();
    }
    
    fetchWithRetry();
  });
}
window.articlesPromise = getArticlesPromise();

document.addEventListener("DOMContentLoaded", function() {
  var isAdmin = document.getElementById("admin") ? true : false;

  // Plantilla con concatenación de strings
  function htmlArticle(img, d, a, t) {
    var html = '<div '+a+' data-title="' + t + '" class="articulo';
    if(img){
        html = html.concat(
            ' articulo-bg"', ' style="--bg-url:',"url(",img,");");
    }
    
    html += '"><div class="articulo-container">';
    console.log(html);
    if (img) {
      html += '<img class="articulo__img" src="' + img + '">';
    }
    html += '<h3 class="articulo__title">' + t + '</h3>' +
            '<div class="articulo__div">' + d + '</div>';
    
    if (isAdmin) {
      html += '<button class="articulo__delete" data-title="' + t + '">Eliminar</button>';
    }
    
    return html + '</div></div>';
  };

  // Eliminar artículo con XHR
  function deleteArticle(title) {
      
      var seguro = confirm("¿Seguro que quieres eliminar '" + title + "'?");
  
  if (!seguro) {
    console.log("Eliminación cancelada.");
    return;
  }
      
    articlesPromise.then(function(articleOriginal) {
      var articleUpdated = articleOriginal.filter(function(e) {
        return e.title !== title;
      });
      
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', 'https://api.jsonbin.io/v3/b/' + keyBin);
      xhr.setRequestHeader('X-Master-Key', xMasterKey);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Eliminar del DOM
          var elements = document.querySelectorAll('[data-title="' + title + '"]');
          for (var i = 0; i < elements.length; i++) {
            elements[i].parentNode.parentNode.removeChild(elements[i].parentNode);
          }
          console.log("Eliminado con éxito");
          location.reload();
        } else {
          console.error("Error al eliminar el artículo");
        }
      };
      
      xhr.onerror = function() {
        console.error("Error de conexión");
      };
      
      xhr.send(JSON.stringify(articleUpdated));
    });
  };

  function showArticles() {
    articlesPromise.then(function(articles) {
      var articleGeneral = "";
      var itemListElement = [];
      
      // Formateador de fechas compatible
      function formatDate(date) {
        var d = new Date(date);
        return d.getFullYear() + '-' + 
               ('0' + (d.getMonth() + 1)).slice(-2) + '-' + 
               ('0' + d.getDate()).slice(-2);
      }

      // Generar artículos
      for (var i = 0; i < articles.length; i++) {
        var p = articles[i];
        articleGeneral = htmlArticle(p.img, p.description, p.author, p.title) + articleGeneral;
        
        // Schema
        itemListElement.push({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": p.title,
          "description": p.description.substring(0, 160),
          "author": {
            "@type": "Person",
            "name": p.author,
            "url": "https://yoandri.vercel.app/blog-page.html"
          },
          "datePublished": formatDate(Date.now() - 86400000),
          "dateModified": formatDate(Date.now()),
          "image": {
            "@type": "ImageObject",
            "url": p.img,
            "width": 1200,
            "height": 630
          },
          "publisher": {
            "@type": "Organization",
            "name": "El Blog de Yoandri",
            "logo": {
              "@type": "ImageObject",
              "url": "https://yoandri.vercel.app/recursos/LDY_portada.jpg",
              "width": 600,
              "height": 60
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://yoandri.vercel.app/blog-page.html"
          }
        });
      }

      // Insertar artículos
      try {
        document.getElementById("blog").innerHTML = articleGeneral;
        
        // Insertar schema
        var script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": itemListElement
        });
        document.head.appendChild(script);

        // Eventos de eliminación
        if (isAdmin) {
          var buttons = document.getElementsByClassName('articulo__delete');
          for (var j = 0; j < buttons.length; j++) {
            buttons[j].addEventListener('click', function(e) {
              deleteArticle(e.target.getAttribute('data-title'));
            });
          }
        }
      } catch (e) {
        console.log("Error al mostrar articulos:", e);
      }
    });
  };

  showArticles();
});