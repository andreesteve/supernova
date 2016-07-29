gx.drawingContext = klass({
    initialize: function(options) {        
        this.glx = options.glx;
        this.glxInput = options.glxInput;        
        
        this.currentTime = Date.now();
        this.elapsedTime = 0;        
        
        // private members
        this._worldMatrixStack = [];        
        this._camera = options.camera;
        this._projectionMatrix = options.projectionMatrix;
        this._projectionHelper = new gx.projectionHelper(this.glx);

        this.shaderManager = options.shaderManager;
        this.textureManager = options.textureManager;
    },
    
    getProjectionHelper: function() {
        this._projectionHelper.update(this.viewProjectionMatrix);
        return this._projectionHelper;
    },
    
    getWorldMatrix: function(worldMatrix) {
        var m = mat4.create();
        
        this._worldMatrixStack.length > 0
            ? mat4.copy(m, this._worldMatrixStack[0])
            : mat4.identity(m);

        for (var i = 1; i < this._worldMatrixStack.length; i++) {
            mat4.multiply(m, m, this._worldMatrixStack[i]);
        }

        if (worldMatrix) {
            mat4.multiply(m, m, worldMatrix);
        }
        
        return m;
    },
    
    pushWorldMatrix: function(worldMatrix) {
        this._worldMatrixStack.push(worldMatrix);
    },
    
    popWorldMatrix: function() {
        return this._worldMatrixStack.pop();
    },
    
    tick: function() {
        var now = Date.now();
        
        this.elapsedTime = now - this.currentTime;
        this.currentTime = now;
        
        this._updateViewProjection();
    },
    
    _updateViewProjection: function() {
        var viewProjectionMatrix = this._camera.getViewMatrix();        
        mat4.multiply(viewProjectionMatrix, this._projectionMatrix, viewProjectionMatrix);
        this.viewProjectionMatrix = viewProjectionMatrix;
    }
});
