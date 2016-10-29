var klass = require('klass');
var glmatrix = require('gl-matrix');
var mat4 = glmatrix.mat4;
var vec3 = glmatrix = vec3;

var object = klass({
    initialize: function() {
        this._position = vec3.create();
        this._rotation = vec3.create();
    },
    
    update: function(context) {
    },
    
    draw: function(context) {
    },
    
    accept: function(visitor) {
        return visitor.visit(this);
    },

    getPosition: function() {
        return vec3.clone(this._position);
    },
    
    setPosition: function(position) {
        this._position[0] = position[0];
        this._position[1] = position[1];
        this._position[2] = position[2];
    },

    setRotation: function(rotation) {
        this._rotation[0] = rotation[0];
        this._rotation[1] = rotation[1];
        this._rotation[2] = rotation[2];
    },

    setRotationX: function(rad) {
        this._rotation[0] = rad;
    },

    setRotationY: function(rad) {
        this._rotation[1] = rad;
    },

    setRotationZ: function(rad) {
        this._rotation[2] = rad;
    },
    
    getWorldMatrix: function(context) {
        var worldMatrix = mat4.create();
        mat4.identity(worldMatrix);
        mat4.rotateX(worldMatrix, worldMatrix, this._rotation[0]);
        mat4.rotateY(worldMatrix, worldMatrix, this._rotation[1]);
        mat4.rotateZ(worldMatrix, worldMatrix, this._rotation[2]);
        mat4.translate(worldMatrix, worldMatrix, this._position);

        // if context is provided, return world matrix multiplied by the current world context matrix
        if (context) {
            worldMatrix = context.getWorldMatrix(worldMatrix);
        }
        
        return worldMatrix;
    }    
});
