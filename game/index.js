var mainLoop = require('./mainLoop.js');

function webGLStart() {  
    var canvas = document.getElementById("canvas");
    canvas.height = $('body').height();
    canvas.width = $('body').width();
    var mainLoop = new mainLoop(canvas);
    window.mainLoop = mainLoop;                    
    mainLoop.start();
}

webGLStart();
