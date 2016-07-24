gx.object = klass({
    initialize: function() {
        this._position = vec3.create();
    },
    
    update: function(context) {
    },
    
    draw: function(context) {
    },
    
    accept: function(visitor) {
        return visitor.visit(this);
    },
    
    _getWorldMatrix: function() {
        var worldMatrix = mat4.create();
        mat4.identity(worldMatrix);
        mat4.translate(worldMatrix, worldMatrix, this._position);
        
        return worldMatrix;
    }    
});