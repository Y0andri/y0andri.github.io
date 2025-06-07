const keyImgBb = "42c2035207510686c7c9d6f3301059b3";
const keyBin = "6843670a8561e97a50207460";
const xMasterKey = "$2a$10$wvBBvlgwlGvRYa9Fxhn2peWhelUGxVHKEmhBXVpzJJg3x6oSnqDM.";

// Obtener productos desde la API (reintenta cada 3s si falla)
const getArticlesPromise = async () => {
    while (true) {
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${keyBin}`, {
                headers: {
                    'X-Master-Key': xMasterKey,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log("Promesa Resuelta JsonBin");
            return data.record;
        } catch (error) {
            console.error("Error cargando el json:" + error);
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
};
window.articlesPromise = getArticlesPromise();

document.addEventListener("DOMContentLoaded", () => {

// Plantilla HTML para productos
const htmlArticle = (img,d,a,t) => {
    return `<div ${a} class="articulo">
    ${img ? `<img class="articulo__img" src="${img}">` : ''}
    <h3 class='articulo__title'>${t}</h3>
    <div class="articulo__div">${d}</div>
    </div>`;
};

// Eliminar producto de la API
const deleteArticle = async title => {
    try {
        let articleOriginal = await articlesPromise;
        let articleUpdated = articleOriginal.filter(e => e.title !== title);
        
        const response = await fetch(`https://api.jsonbin.io/v3/b/${keyBin}`, {
            method: 'PUT',
            headers: {
                'X-Master-Key': xMasterKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(articleUpdated)
        });
        
        if (!response.ok) {
            formAlert.innerText = "Error al eliminar el artículo";
            throw new ConectionError("Error al eliminar de la BD el artículo");
        }
        
        // Eliminar elementos del DOM
        document.querySelectorAll(`[data-title="${title}"]`).forEach(el => {
            el.parentElement.parentElement.remove();
        });
        console.log("eliminado con exito");
    } catch (error) {
        console.error(error);
    }
};

const showArticles = async () => {
        const articles = await articlesPromise;
        let articleGeneral = "";
        let itemListElement = [];
        const schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": itemListElement
        };

        // Generar HTML para cada producto
        articles.forEach((p,i) => {
            let article = htmlArticle(p.img, p.description, p.author,p.title);
            
            articleGeneral = article + articleGeneral ;
            
            
            //alamcenar schema de productos
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
            });
        

        try {
            
            document.querySelector("#blog").innerHTML = articleGeneral;
            //inyectar schema en el body
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(schema);
            document.head.appendChild(script);
            
            

            // Agregar listeners de eliminación (solo admin)
            /* 
            if (isAdmin) {
                document.querySelectorAll(".btn-delete").forEach(btn => {
                    btn.addEventListener("click", e => {
                        const title = e.target.dataset.title;
                        deleteArticle(title);
                    });
                }); 
            } 
            */
            
  
  
        } catch (e) {
            console.log("Error al mostrar articulos:" + e);
        }
    };

    showArticles();
    
    
    
});