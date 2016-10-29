var mainLoop = require('./mainLoop.js');

function webGLStart() {  
    var canvas = document.getElementById("canvas");
    canvas.height = $('body').height();
    canvas.width = $('body').width();
    new mainLoop(canvas).start();
}

webGLStart();
