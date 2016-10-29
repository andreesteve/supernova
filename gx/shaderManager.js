var klass = require('klass');

var shaderManager = klass({
    initialize: function(glx) {    
        this._glx = glx;
        this._preparedShaders = {};
    },
     
    loadShaders: function(shaderDefinition, onLoadCompleated) {
        this._glx.loadShaders(function (shaders) {        
            this._prepareShaders(shaders, shaderDefinition);            
            onLoadCompleated();        
        }.bind(this));
    },
    
    getShader: function(shaderName) {
        return this._preparedShaders[shaderName];
    },
     
    _prepareShaders: function(shaders, shadersDefinition) {
        for (var i = 0; i < shadersDefinition.length; i++) {
            var shaderDef = shadersDefinition[i];            
            this._prepareShader(shaders, shaderDef.shaderName, shaderDef.vertexShaderName, shaderDef.fragmentShaderName);            
        }
    },
     
    _prepareShader: function(shaders, programName, vertShaderName, fragShaderName) {
        var vertexShader = shaders[vertShaderName];
        var fragShader = shaders[fragShaderName];

        if (!vertexShader) {
            throw "No vertex shader found with name: " + vertShaderName;
        }
        
        if (!fragShader) {
            throw "No vertex shader found with name: " + fragShaderName;
        }        
        
        var program = this._glx.createShaderProgram(vertexShader, fragShader);
        program.linkProgram();
        
        this._preparedShaders[programName] = program;
    }
});

module.exports = shaderManager;
