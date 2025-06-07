
// Adaptación de compatibilidad para Chrome 50
// - Eliminación de async/await
// - Reemplazo de optional chaining y replaceAll
// - Uso de Promises tradicionales y funciones más compatibles

const formAlert = document.querySelector(".form-alert");
const loadingBlog = document.querySelector(".loading-blog");
const formBlog = document.querySelector(".form-blog");
const converter = new showdown.Converter();

function comprimirA70KB(imagen) {
    var opciones = {
        maxSizeMB: 0.06,
        useWebWorker: true,
        maxWidthOrHeight: 1920,
        fileType: 'image/png'
    };

    return imageCompression(imagen, opciones).then(function(imagenComprimida) {
        console.log('[Compresión] Resultado:', {
            pesoOriginal: (imagen.size / 1024).toFixed(2) + ' KB',
            pesoComprimido: (imagenComprimida.size / 1024).toFixed(2) + ' KB',
            reduccion: ((1 - (imagenComprimida.size / imagen.size)) * 100)
        });
        return imagenComprimida;
    }).catch(function(error) {
        console.error('[Compresión] Error:', {
            error: error.message,
            archivo: imagen.name,
            tipo: imagen.type
        });
        throw new Error('Error en compresión de imagen. Usando original');
    });
}

function uploadArticle() {
    formAlert.innerHTML = "";
    var errorMessage = "";
    
    try {
        var elements = {
            image: document.querySelector(".input-image"),
            title: document.querySelector(".input-title"),
            description: document.querySelector(".input-description"),
            author: document.querySelector(".input-author")
        };

        if (!elements.description.value.trim()) {
            errorMessage = "Escriba una descripción";
            throw new Error('No hay descripción');
        }

        loadingBlog.style.display = "block";
        formBlog.querySelector('button[type="submit"]').style.display = "none";

        var promesaImagen = Promise.resolve(null);

        if (elements.image.files && elements.image.files.length !== 0) {
            promesaImagen = comprimirA70KB(elements.image.files[0]).then(function(compressedFile) {
                var formData = new FormData();
                formData.append("image", compressedFile);

                return fetch("https://api.imgbb.com/1/upload?key=" + keyImgBb, {
                    method: "POST",
                    body: formData
                }).then(function(responseImgBb) {
                    return responseImgBb.json().then(function(dataImgBb) {
                        if (!dataImgBb.success) {
                            console.error('[ImgBB] Error en respuesta:', dataImgBb);
                            throw new Error("API ImgBB: " + (dataImgBb.error && dataImgBb.error.message ? dataImgBb.error.message : 'Error desconocido'));
                        }
                        return dataImgBb.data.url;
                    });
                });
            });
        }

        promesaImagen.then(function(urlImagen) {
            articlesPromise.then(function(articles) {
                var sanitizedDescription = DOMPurify.sanitize(
                    converter.makeHtml(elements.description.value.split('\n').join("\n<br>\n"))
                ).split('\n').join('').split('<p>').join('').split('</p>').join('');

                var newArticle = {
                    title: elements.title.value,
                    description: sanitizedDescription,
                    author: elements.author.value
                };

                if (urlImagen) {
                    newArticle.img = urlImagen;
                }

                fetch("https://api.jsonbin.io/v3/b/" + keyBin, {
                    method: 'PUT',
                    headers: {
                        'X-Master-Key': xMasterKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(articles.concat([newArticle]))
                }).then(function(response) {
                    if (!response.ok) {
                        return response.json().then(function(errorData) {
                            console.error('[JSONBin] Error:', {
                                status: response.status,
                                error: errorData
                            });
                            throw new Error("API JSONBin: " + (errorData.message || 'Error en actualización'));
                        });
                    }

                    console.log('[Éxito] Artículo publicado:', newArticle);
                    formAlert.innerHTML = "<strong>Artículo subido correctamente</strong>";
                    formBlog.reset();
                    window.articlesPromise = getArticlesPromise();
                }).catch(mostrarError);
            });
        }).catch(mostrarError);

    } catch (error) {
        mostrarError(error);
    } finally {
        loadingBlog.style.display = "none";
        formBlog.querySelector('button[type="submit"]').style.display = "block";
    }
}

function mostrarError(error) {
    console.error("[Error General] " + error.message, {
        stack: error.stack,
        cause: error.cause
    });
    formAlert.innerHTML = "<strong>⚠️ Error al subir el artículo:</strong><br>" +
        error.message.replace("API JSONBin: ", '').replace("API ImgBB: ", '');
}

formBlog.addEventListener("submit", function(event) {
    event.preventDefault();
    uploadArticle();
});
