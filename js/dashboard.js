const formAlert = document.querySelector(".form-alert");
const loadingBlog = document.querySelector(".loading-blog");
const formBlog = document.querySelector(".form-blog");
const converter = new showdown.Converter();



//Function Comprimir Imagenes a 70KB
async function comprimirA70KB(imagen) {
    const opciones = {
        maxSizeMB: 0.06,
        useWebWorker: true,
        maxWidthOrHeight: 1920,
        fileType: 'image/png'
    };

    try {
        const imagenComprimida = await imageCompression(imagen, opciones);
        console.log('[Compresión] Resultado:', {
            pesoOriginal: `${(imagen.size / 1024).toFixed(2)} KB`,
            pesoComprimido: `${(imagenComprimida.size / 1024).toFixed(2)} KB`,
            reduccion: `${((1 - (imagenComprimida.size / imagen.size))) * 100}`
        });
        return imagenComprimida;
    } catch (error) {
        console.error('[Compresión] Error:', {
            error: error.message,
            archivo: imagen.name,
            tipo: imagen.type
        });
        throw new Error('Error en compresión de imagen. Usando original');
    }
}

// Function Comprimir-ImgBB-JSONBin
async function uploadArticle() {
    try {
    formAlert.innerHTML = "";
    let errorMessage = "";
        // Obtener valores del formulario
        
        const elements = {
            image: document.querySelector(".input-image"),
            title: document.querySelector(".input-title"),
            description: document.querySelector(".input-description"),
            author: document.querySelector(".input-author"),
        };

        // Validaciones básicas
        if (!elements.image.files[0]) {
            errorMessage = "❌ Inserte una imagen";
            throw new Error('Imagen no seleccionada');
        }
        if (!elements.description.value.trim()) {
            errorMessage = "Escriba una descripción";
            throw new Error('No hay descripción');
        }

        loadingBlog.style.display = "block";
        formBlog.querySelector('button[type="submit"]').style.display = "none";

        // Proceso de compresión
        const compressedFile = await comprimirA70KB(elements.image.files[0]);
        
        // Subir imagen a ImgBB
        const formData = new FormData();
        formData.append("image", compressedFile);
        
        const responseImgBb = await fetch(`https://api.imgbb.com/1/upload?key=${keyImgBb}`, {
            method: "POST",
            body: formData
        });
        
        const dataImgBb = await responseImgBb.json();
        if (!dataImgBb.success) {
            console.error('[ImgBB] Error en respuesta:', dataImgBb);
            throw new Error(`API ImgBB: ${dataImgBb.error?.message || 'Error desconocido'}`);
        }

        // Actualizar JSON con nuevo producto
        const articles = await articlesPromise;
        const newArticle = {
            img: dataImgBb.data.url,
            title:elements.title.value,
            description: DOMPurify.sanitize(converter.makeHtml(elements.description.value.replaceAll('\n',"\n<br>"))),
            author:elements.author.value
        };
        
        const response = await fetch(`https://api.jsonbin.io/v3/b/${keyBin}`, {
            method: 'PUT',
            headers: {
                'X-Master-Key': xMasterKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([...articles, newArticle])
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('[JSONBin] Error:', {
                status: response.status,
                error: errorData
            });
            throw new Error(`API JSONBin: ${errorData.message || 'Error en actualización'}`);
        }

        console.log('[Éxito] Artículo publicado:', newArticle);
        formAlert.innerHTML = "<strong>Artículo subido correctamente</strong>";
        
        // Resetear formulario
        formBlog.reset();
        window.articlesPromise = getArticlesPromise(); // Actualizar lista

    } catch (error) {
        console.error(`[Error General] ${error.message}`, {
            stack: error.stack,
            cause: error.cause
        });
        
        formAlert.innerHTML = errorMessage || `
            <strong>⚠️ Error al subir el artículo:</strong><br>
            ${error.message.replace('API JSONBin: ', '').replace('API ImgBB: ', '')}
        `;
        
    } finally {
        loadingBlog.style.display = "none";
        formBlog.querySelector('button[type="submit"]').style.display = "block";
    }
}

formBlog.addEventListener("submit",function(event){
    event.preventDefault();
    uploadArticle();
});