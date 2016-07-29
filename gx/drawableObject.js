gx.drawableObject = gx.object.extend({

    /**
     * @constructor.
     * @param options the set of options to create this object.
     * @param options.model the model that this object should use when rendering.
     * @param options.texture the texture to be used when rendering this object.
     * @param options.shader the shader to be used when rendering this object.
     * If not provided, the default shader is used.
     */
    initialize: function(context, options) {
        this.supr();

        this._model = options.model;
        this._texture = options.texture;
        this._shader = options.shader || new gx.phongShader();
    },
    
    draw: function(context) {
        this.supr(context);

        this._shader.worldMatrix = this.getWorldMatrix(context);
        this._shader.texture = this._texture;
        this._shader.draw(context, this._model);
    }
});
