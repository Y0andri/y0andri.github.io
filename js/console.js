const inputConsole = document.querySelector(".console-comand-input");
const contentConsole = document.querySelector(".console-scroll");
const mainConsole = document.querySelector(".console-main");

const comands = {
    yoandri:"Viva Yoandri el Negro!",
    
};

inputConsole.addEventListener("keypress",function(e){
    if(e.key === "Enter" || e.keyCode === 13){
        e.preventDefault();
        if(comands.hasOwnProperty(inputConsole.value.toLocaleLowerCase())){
            mainConsole.insertAdjacentHTML("beforeend",
            
            "<p class='console-log-input'><span style='color:#eef;'>~ bash$: </span>"+inputConsole.value+"</p>"+
            "<p>"+comands[inputConsole.value.toLocaleLowerCase()]+"</p>"
            );
            
        } else {
            mainConsole.insertAdjacentHTML("beforeend",
            
            "<p class='console-log-input'><span style='color:#eef;'>~ bash$: </span>"+inputConsole.value+"</p>"+
            "<p style='color:#f44;'>Socio, tu eres anormal o que</p>"
            );
        }
        inputConsole.value = ""
    }
});
