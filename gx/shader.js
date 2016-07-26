/**
 * Represents a shader that can render models.
 */
gx.shader = klass({
    /**
     * Represents a shader that can render models.
     * @constructor
     */
    initialize: function(shaderName) {
        this.shaderName = shaderName;
        this._textures = null;
    },

    /**
     * Set textures, in order, to be use on render.
     * @param {texture array} array of textures to be used for rendering.
     */
    setTextures(textures) {
        this._textures = textures;
    },

    /**
     * Draws a model using this shader.
     * @param {context} context th current context used for drawing.
     * @param {model} model the model to be rendered.
     */
    draw: function(context, model) {
        var shaderProgram = context.shaderManager.getShader(this.shaderName);
        shaderProgram.activate();

        this._setShaderParameters(shaderProgram, context, model);
        
        shaderProgram.drawElements(model.modelData.indexBuffer);

        this._textures = null;
    },

    _attachTexture: function(shaderProgram, texture, index) {
        texture.attach(index);
    },
    
    _setShaderParameters: function(shaderProgram, context) {
        if (this._textures) {
            for (var i = 0; i < this._textures.length; i++) {
                this._attachTexture(shaderProgram, this._textures[i], i);
            }
        }
    }
});
