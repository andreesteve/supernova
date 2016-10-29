Math.PI2 = 2 * Math.PI;
Math.Degree = Math.PI / 180;

var shaderUnit = require('./shaderUnit').shaderUnit;
var shaderProgram = require('./shaderUnit').shaderProgram;
var buffer = require('./buffer');
var texture = require('./texture');

var gx = function(gl) {
    this.gl = gl;
};

gx.prototype.initializeWebgl = function(canvas) {
    this.gl = canvas.getContext("webgl");
    this.canvas = canvas;
};

gx.prototype.loadShaders = function(onLoadComplete) {
    
    var shaders = {
        _all: []
    };
    
    var shaderFounds = 0;
    var allScriptsChecked = false;    
    var loadingDone = false;
    var me = this;
    
    function createShader(shaderString, shaderType, shaderId) {
        var gxShader = new shaderUnit(shaderId, shaderString, shaderType);
        
        gxShader.compile(me.gl);
               
        shaders._all.push(gxShader);
        
        if (shaderId) {
            shaders[shaderId] = gxShader;
        }
        
        shaderFounds--;
        
        if (allScriptsChecked && shaderFounds == 0) {
            loadingDone = true;
            
            onLoadComplete(shaders);
        }
    };
    
    var scripts = document.getElementsByTagName('script');                
    
    for (var i = 0; i < scripts.length; i++) {
        var shaderScript = scripts[i];
        
        if (shaderScript.type.indexOf("x-shader") != 0) {
            continue;
        }
        
        shaderFounds++;
        
        var shaderType;
        if (shaderScript.type == "x-shader/x-fragment") {
            shaderType = this.gl.FRAGMENT_SHADER;
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shaderType = this.gl.VERTEX_SHADER;
        } else {
            throw 'Invalid shader script type " + shaderScript.type + ".';
        }
        
        if (shaderScript.src) {       
            // need to get file
            $.ajax({
                url: shaderScript.src,
                dataType: 'text',
                success: function() {
                    var _shaderType = shaderType;
                    var _id = shaderScript.id;
                    return function(shaderString) {
                        createShader(shaderString, _shaderType, _id);
                    };
                }(),
                error: function(jhr, error, msg) {
                    throw error + ' ' + msg;
                }
            });
        } else {
            var str = "";            
            var k = shaderScript.firstChild;
            while (k) {
                if (k.nodeType == 3) {
                    str += k.textContent;
                }
                k = k.nextSibling;
            }
            
            createShader(result, shaderType, shaderScript.id);
        }
    }
    
    allScriptsChecked = true;
    
    if (loadingDone) {
        onLoadComplete(shaders);
    }
    
    return shaders;
};

/**
*   fragmentShader: gxShader
*   vertexShader: gxShader
*/
gx.prototype.createShaderProgram = function(vertexShader, fragmentShader) {
    var shaderProgram = new shaderProgram(this.gl, vertexShader, fragmentShader);
    return shaderProgram;
};

gx.prototype.createBuffer = function(itemSize, elementArray, bufferType) {   
    var bType;
    if (bufferType) {
        bType = this.gl[bufferType];
    }
    
    var buffer = new buffer(this.gl, itemSize, bType);
    
    buffer.fill(elementArray);
    
    return buffer;
};

// TODO: review this for nodejs
gx.prototype.createTexture = function(url, onLoadComplete) {
    var img = new Image();
	    
	img.onload = function() {
        var texture = new texture(this.gl, img);
		onLoadComplete(texture);
	}.bind(this);
    
    img.src = url;
};

module.exports = gx;
