var gx = require('../gx');
var glmatrix = require('gl-matrix');
var mat4 = glmatrix.mat4;
var mat3 = glmatrix.mat4;
var vec3 = glmatrix = vec3;
var vec4 = glmatrix = vec4;

var orbit = gx.drawableObject.extend({

    /**
     * Initializes the orbit.
     * @param {number} options.period the orbit's period in milliseconds.
     * @param {number} options.inclination the orbit's inclication in radians.
     * @param {number} options.radius the orbit's radius.
     * @param {vec3} options.focus the orbit's focus (center position).
     */
    initialize: function(context, options) {
        if (!options.radius) {
            throw 'radius must be greater than 0.';
        }

        this._radius = options.radius;
        this._period = options.period || 0;
        this._inclination = options.inclination || 0;
        this._focus = options.focus || vec3.create();
        
        var defaultOrbitModelWidth = 0.1;
        var defaultOrbitSlices = 50;
        var model = new gx.models.disk(context.glx, this._radius, this._radius - defaultOrbitModelWidth, defaultOrbitSlices);

        // call base
        this.supr(context, {
            model: model
        });

        this.setPosition(this._focus);
        this.setRotationX(this._inclination);
    },
    
    calculateOrbitPosition:  function(currentTime) {
        var m = mat4.create();
        var position = vec4.create();
        position[3] = 1;
        
        var yrotation = this._period
                ? (currentTime / this._period) % Math.PI2
                : 0;

        mat4.identity(m);      
        // translate to orbit
        position[0] = this._radius;
        
        // inclinate orbit
        mat4.rotateX(m, m, this._inclination);

        // rotate around center
        mat4.rotateY(m, m, yrotation);
        
        vec4.transformMat4(position, position, m);
        
        return position;
    }
});

module.exports = orbit;
