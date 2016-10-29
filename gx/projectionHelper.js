var klass = require('klass');
var glmatrix = require('gl-matrix');
var mat4 = glmatrix.mat4;
var vec3 = glmatrix = vec3;
var vec4 = glmatrix = vec4;

var projectionHelper = klass({
    initialize: function(glx) {

        var canvas = glx.gl.canvas;

        this._resolution = [glx.gl.drawingBufferWidth, glx.gl.drawingBufferHeight];
        
        this._viewportToDrawingResolutionRatio = [
            this._resolution[0] / canvas.clientWidth,
            this._resolution[1] / canvas.clientHeight
        ]
    },
    
    update: function(viewProjectionMatrix) {
        this._viewProjectionMatrix = viewProjectionMatrix;
    },
    
    unproject: function(point) {
        var directionScreenCoords = vec4.fromValues(
            -1 + 2 * point[0] / this._resolution[0], 
            1 - 2 * point[1] / this._resolution[1], 
            2.0 * (point[2] || 0) -1.0,
            1);
        
        var inverse = mat4.create();
        mat4.invert(inverse, this._viewProjectionMatrix);
        
        var directionWorldCoords = vec4.create();
        vec4.transformMat4(directionWorldCoords, directionScreenCoords, inverse);
        
        var w = directionWorldCoords[3];
        directionWorldCoords = vec3.fromValues(directionWorldCoords[0] / w, directionWorldCoords[1] / w, directionWorldCoords[2] / w);
        
        return directionWorldCoords;
    },
    
    /**
    * Unprojects a point in the screen coordinate system into the world coordinate system.
    * Does the same as {@link unproject} but adjusting the point argument to account for screen resizing.
    * @param {vec3} point - The point in screen coordinates.    
    * @returns {vec3} The unprojected point in world coordinates.
    * @see {@link unproject}
    */
    unprojectScreenCoordinates: function(point) {
        // there is an issue when the canvas width/height does not match
        // the actual canvas display on the screen, i.e. when the canvas
        // get resized. This skew the projection and I'm yet to find a solution for it.

        var drawingPoint = vec3.clone(point);
        drawingPoint[0] *= this._viewportToDrawingResolutionRatio[0];
        drawingPoint[1] *= this._viewportToDrawingResolutionRatio[1];
        
        return this.unproject(drawingPoint);
    }
});

module.exports = projectionHelper;
