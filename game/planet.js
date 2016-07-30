var defaultLatEdgeSize = 50;
var defaultLongEdgeSize = 30;
var defaultOrbitModelWidth = 0.1;

supernova.planet = gx.scene.extend({

    initialize: function(planetInfo) {
        this.supr();
        
        planetInfo = planetInfo || {};

        var context = planetInfo.context;

        this._orbitDistance = planetInfo.orbitDistance || 0;
        this._orbitInclination = planetInfo.orbitInclination || 0;
        this._orbitPeriod = planetInfo.orbitPeriod; // milliseconds
        
        this._rotationPeriod = planetInfo.rotationPeriod; // milliseconds
        this._planetRadius = planetInfo.planetRadius || 1;
        
        var model = new gx.models.sphere(
            context.glx,
            this._planetRadius,
            defaultLatEdgeSize,
            defaultLongEdgeSize);        
        var texture = context.textureManager.getTexture(planetInfo.textureName);

        this._planet = new gx.drawableObject(context, {
            model: model,
            texture: texture
        });
               
        this.addObject(this._planet);
        
        planetInfo.satelites = planetInfo.satelites || [];
        for (var i = 0; i < planetInfo.satelites.length; i++) {
            var satelite = planetInfo.satelites[i];
            var d = satelite._orbitDistance;

            // fix orbit inclination
            // TODO create this only once and reuse
            var orbit = new gx.models.disk(context.glx, d, d - defaultOrbitModelWidth, 50);
            
            var orbitPlanet = new gx.drawableObject(context, {
                model: orbit,
                texture: texture
            });
            
            this.addObject(satelite);
            this.addObject(orbitPlanet);
        }
    },
    
    update: function(context) {
        this.supr(context);

        // position is set on this scene
        this.setPosition(this._calculateOrbitPosition(context.currentTime));

        // rotation is set on the internal planet object, because we don't want it
        // to propagate to child objects
        if (this._rotationPeriod) {
            this._planet.setRotationY((context.currentTime / this._rotationPeriod) % Math.PI2);
        }
    },
    
    draw: function(context) {
        this.supr(context);                      
    },
    
    _calculateOrbitPosition:  function(currentTime) {
        // puts element on inclined orbit
        var position = vec3.fromValues(this._orbitDistance * Math.cos(this._orbitInclination), this._orbitDistance * Math.sin(this._orbitInclination), 0);
        
        var matrix = mat4.create();
        mat4.identity(matrix);

        var yrotation = this._orbitPeriod
                ? (currentTime / this._orbitPeriod) % Math.PI2
                : 0;
        
        mat4.rotateY(matrix, matrix, yrotation); // rotates element around center
        //mat4.translate(matrix, matrix, orbitCenter); // translates element to orbit center
        vec3.transformMat4(position, position, matrix);
        
        return position;
    }
});
