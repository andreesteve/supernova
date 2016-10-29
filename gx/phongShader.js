var shader = require('./shader.js');
var glmatrix = require('gl-matrix');
var mat4 = glmatrix.mat4;
var vec3 = glmatrix.vec3;
var mat3 = glmatrix.mat3;

/**
 * Represents a PHONG shader.
 */
var phongShader = shader.extend({

    /**
     * The world matrix.
     */
    worldMatrix: null,

    /**
     * The texture used to render the model.
     */
    texture: null,
    
    /**
     * Represents a PHONG shader.
     * @constructor
     */
    initialize: function(shaderName) {
        this.supr(shaderName || "main");
    },    

    draw: function(context, model) {
        if (this.texture) {
            this.setTextures([this.texture]);
        }
        
        this.supr(context, model);
    },
    
    _attachTexture: function(shaderProgram, texture, index) {
        this.supr(shaderProgram, texture, index);
        shaderProgram.uniform("uSampler2D", 0, 'i');
    },
    
    _setShaderParameters: function(shaderProgram, context, model) {
        this.supr(shaderProgram);

        var normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, this.worldMatrix);
        
        shaderProgram.uniformMatrix("uModelMatrix", this.worldMatrix);
        shaderProgram.uniformMatrix("uViewProjectionMatrix", context.viewProjectionMatrix);        
        shaderProgram.uniformMatrix("uNormalMatrix", normalMatrix);

        shaderProgram.uniform3fv('uAmbientLightColor', context.ambientLightColor);
        shaderProgram.uniform3fv('uLightPosition', context.lightPosition);
        
        shaderProgram.attributeBuffer("aVertexPosition", model.modelData.vertexBuffer);
        shaderProgram.attributeBuffer("aTexCoord", model.modelData.texCoordBuffer);
        shaderProgram.attributeBuffer("aNormal", model.modelData.normalBuffer);        
    }
});

module.exports = phongShader;
