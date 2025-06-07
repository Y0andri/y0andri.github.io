// Adaptación de compatibilidad para Chrome 50
// - Eliminación de async/await
// - Reemplazo de optional chaining y replaceAll
// - Uso de Promises tradicionales y funciones más compatibles
// - Corrección para mostrar SVG de carga en Chrome 50 (display: inline-block)

const formAlert = document.querySelector(".form-alert");
const loadingBlog = document.querySelector(".loading-blog");
const formBlog = document.querySelector(".form-blog");
const converter = new showdown.Converter();

/**
 * Intenta comprimir la imagen a ~70KB.
 * Si falla, devuelve la imagen original.
 */
function comprimirA70KB(imagen) {
    var opciones = {
        maxSizeMB: 0.06,
        useWebWorker: false,
        maxWidthOrHeight: 1920,
        fileType: 'image/png'
    };

    return imageCompression(imagen, opciones)
        .then(function(imagenComprimida) {
            console.log('[Compresión] Resultado:', {
                pesoOriginal: (imagen.size / 1024).toFixed(2) + ' KB',
                pesoComprimido: (imagenComprimida.size / 1024).toFixed(2) + ' KB',
                reduccion: ((1 - (imagenComprimida.size / imagen.size)) * 100).toFixed(2) + ' %'
            });
            return imagenComprimida;
        })
        .catch(function(error) {
            console.warn('[Compresión] No se pudo comprimir, usando archivo original', { mensaje: error.message });
            return imagen;
        });
}

function uploadArticle() {
    formAlert.innerHTML = "";
    try {
        var elements = {
            image: document.querySelector(".input-image"),
            title: document.querySelector(".input-title"),
            description: document.querySelector(".input-description"),
            author: document.querySelector(".input-author")
        };

        if (!elements.description.value.trim()) {
            throw new Error('Escriba una descripción');
        }

        // Mostrar SVG de carga (inline-block para compatibilidad)
        loadingBlog.style.display = "inline-block";
        formBlog.querySelector('button[type="submit"]').style.display = "none";

        var promesaImagen = Promise.resolve(null);

        if (elements.image.files && elements.image.files.length !== 0) {
            promesaImagen = comprimirA70KB(elements.image.files[0])
                .then(function(compressedFile) {
                    var formData = new FormData();
                    formData.append("image", compressedFile);

                    return fetch("https://api.imgbb.com/1/upload?key=" + keyImgBb, {
                        method: "POST",
                        body: formData
                    })
                    .then(function(responseImgBb) {
                        return responseImgBb.json().then(function(dataImgBb) {
                            if (!dataImgBb.success) {
                                console.error('[ImgBB] Error en respuesta:', dataImgBb);
                                throw new Error('API ImgBB: ' + (dataImgBb.error && dataImgBb.error.message ? dataImgBb.error.message : 'Error desconocido'));
                            }
                            return dataImgBb.data.url;
                        });
                    });
                });
        }

        promesaImagen
            .then(function(urlImagen) {
                articlesPromise.then(function(articles) {
                    var sanitizedDescription = DOMPurify.sanitize(
                        converter.makeHtml(elements.description.value.split('\n').join("\n<br>\n"))
                    ).split('\n').join('').split('<p>').join('').split('</p>').join('');

                    var newArticle = {
                        title: elements.title.value,
                        description: sanitizedDescription,
                        author: elements.author.value
                    };
                    if (urlImagen) newArticle.img = urlImagen;

                    return fetch("https://api.jsonbin.io/v3/b/" + keyBin, {
                        method: 'PUT',
                        headers: {
                            'X-Master-Key': xMasterKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(articles.concat([newArticle]))
                    });
                })
                .then(function(response) {
                    if (!response.ok) {
                        return response.json().then(function(err) {
                            console.error('[JSONBin] Error:', err);
                            throw new Error(err.message || 'Error en actualización');
                        });
                    }
                    formAlert.innerHTML = "<strong>Artículo subido correctamente</strong>";
                    formBlog.reset();
                    window.articlesPromise = getArticlesPromise();
                })
                .catch(mostrarError);
            })
            .catch(mostrarError)
            .finally(function() {
                // Ocultar SVG de carga
                loadingBlog.style.display = "none";
                formBlog.querySelector('button[type="submit"]').style.display = "block";
            });

    } catch (error) {
        mostrarError(error);
        loadingBlog.style.display = "none";
        formBlog.querySelector('button[type="submit"]').style.display = "block";
    }
}

function mostrarError(error) {
    console.error("[Error General] ", error);
    formAlert.innerHTML = "<strong>⚠️ Error al subir el artículo:</strong><br>" +
        (error.message || 'Error desconocido');
}

formBlog.addEventListener("submit", function(event) {
    event.preventDefault();
    uploadArticle();
});
