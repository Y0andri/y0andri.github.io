let formBlog = document.getElementById('form_blog') ;

formBlog.addEventListener('submit', function(event) {
    event.preventDefault();
    let nombre = document.getElementById('nombre').value ;
    let texto = document.getElementById('texto').value ;

    let textArea = document.getElementById('areatext');
    textArea.innerText = `El nombre es ${nombre} y el texto es ${texto}` ;
} )
