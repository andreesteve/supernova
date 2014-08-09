gx.projectionHelper = klass({
    initialize: function(options) {
        this._resolution = options.viewportResolution;        
    },
    
    update: function(camera, viewProjectionMatrix) {
        this._camera = camera;
        this._viewProjectionMatrix = viewProjectionMatrix;
    },
    
    unproject: function(screenCoords) {
        var directionScreenCoords = vec4.fromValues(
            -1 + 2 * screenCoords[0] / this._resolution[0], 
            1 - 2 * screenCoords[1] / this._resolution[1], 
            2.0 * (screenCoords[2] || 0) -1.0,
            1);
        
        var inverse = mat4.create();
        mat4.invert(inverse, this._viewProjectionMatrix);
        
        var directionWorldCoords = vec4.create();
        vec4.transformMat4(directionWorldCoords, directionScreenCoords, inverse);
        
        var w = directionWorldCoords[3];
        var directionWorldCoords = vec3.fromValues(directionWorldCoords[0] / w, directionWorldCoords[1] / w, directionWorldCoords[2] / w);
        
        return directionWorldCoords;
    },
});