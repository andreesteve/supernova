/**
 * Represents a PHONG shader.
 */
gx.phongShader = gx.shader.extend({

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
    initialize: function() {
        this.supr("main");
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
