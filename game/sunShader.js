var gx = require('../gx');

/**
 * Represents a SUN shader.
 */
var sunShader = gx.phongShader.extend({
    
    /**
     * Represents a SUN shader.
     * @constructor
     */
    initialize: function() {
        this.supr("sun");
    },    
    
    _setShaderParameters: function(shaderProgram, context, model) {
        this.supr(shaderProgram, context, model);

        shaderProgram.uniform2fv('uResolution',
                                 [context.glx.gl.canvas.width, context.glx.gl.canvas.height]);
/*
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
*/
    }
});
