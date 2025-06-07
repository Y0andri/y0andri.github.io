// Adaptado para compatibilidad con Chrome 50
// - Sin async/await
// - Sin replaceAll, optional chaining, etc.

const keyImgBb = "42c2035207510686c7c9d6f3301059b3";
const keyBin = "6843670a8561e97a50207460";
const xMasterKey = "$2a$10$wvBBvlgwlGvRYa9Fxhn2peWhelUGxVHKEmhBXVpzJJg3x6oSnqDM.";

function getArticlesPromise() {
    return new Promise(function(resolve) {
        function intentarCargar() {
            fetch("https://api.jsonbin.io/v3/b/" + keyBin, {
                headers: {
                    'X-Master-Key': xMasterKey,
                    'Content-Type': 'application/json'
                }
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                console.log("Promesa Resuelta JsonBin");
                resolve(data.record);
            }).catch(function(error) {
                console.error("Error cargando el json:" + error);
                setTimeout(intentarCargar, 3000);
            });
        }
        intentarCargar();
    });
}

window.articlesPromise = getArticlesPromise();

document.addEventListener("DOMContentLoaded", function() {

    function htmlArticle(img, d, a, t) {
        return '<div data-title="' + t + '" class="articulo">' +
            (img ? '<img class="articulo__img" src="' + img + '">' : '') +
            '<h3 class="articulo__title">' + t + '</h3>' +
            '<p class="articulo__p">' + d + '</p>' +
            '</div>';
    }

    function deleteArticle(title) {
        articlesPromise.then(function(articleOriginal) {
            var articleUpdated = articleOriginal.filter(function(e) {
                return e.title !== title;
            });

            fetch("https://api.jsonbin.io/v3/b/" + keyBin, {
                method: 'PUT',
                headers: {
                    'X-Master-Key': xMasterKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articleUpdated)
            }).then(function(response) {
                if (!response.ok) {
                    console.log("Error al eliminar el artículo");
                    throw new Error("Error al eliminar de la BD el artículo");
                }
                var elementos = document.querySelectorAll('[data-title="' + title + '"]');
                for (var i = 0; i < elementos.length; i++) {
                    var el = elementos[i];
                    el.parentElement.parentElement.removeChild(el.parentElement);
                }
                console.log("eliminado con exito");
            }).catch(function(error) {
                console.error(error);
            });
        });
    }

    function showArticles() {
        articlesPromise.then(function(articles) {
            var articleGeneral = "";
            var itemListElement = [];
            var schema = {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": itemListElement
            };

            for (var i = 0; i < articles.length; i++) {
                var p = articles[i];
                var article = htmlArticle(p.img, p.description, p.author, p.title);
                articleGeneral = article + articleGeneral;

                itemListElement.push({
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": "Título del artículo",
                    "description": "Descripción breve del artículo (meta descripción, 150-160 caracteres).",
                    "author": {
                        "@type": "Person",
                        "name": p.author,
                        "url": "https://yoandri.vercel.app/blog-page.html"
                    },
                    "datePublished": new Date(Date.now() - 86400000).toLocaleDateString('en-CA'),
                    "dateModified": new Date().toLocaleDateString('en-CA'),
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

            try {
                document.querySelector("#blog").innerHTML = articleGeneral;
                var script = document.createElement('script');
                script.type = 'application/ld+json';
                script.textContent = JSON.stringify(schema);
                document.head.appendChild(script);
            } catch (e) {
                console.log("Error al mostrar articulos:" + e);
            }
        });
    }

    showArticles();
});
