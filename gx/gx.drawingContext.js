gx.drawingContext = klass({
    initialize: function(options) {
        this._worldMatrixStack = [];
        
        this._camera = options.camera;
        this._projectionMatrix = options.projectionMatrix;
        this.glx = options.glx;
        this.glxInput = options.glxInput;
        
        this.currentTime = Date.now();
        this.elapsedTime = 0;
    },
    
    getWorldMatrix: function() {
        // TODO: improve this
        var worldMatrix = mat4.create();
        
        this._worldMatrixStack.length > 0
            ? mat4.copy(worldMatrix, this._worldMatrixStack[0])
            : mat4.identity(worldMatrix);
        
        for (var i = 1; i < this._worldMatrixStack.length; i++) {
            mat4.multiply(worldMatrix, worldMatrix, this._worldMatrixStack[i]);
        }
        
        return worldMatrix;
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