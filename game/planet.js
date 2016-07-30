var defaultLatEdgeSize = 50;
var defaultLongEdgeSize = 30;
var defaultOrbitModelWidth = 0.1;

supernova.planet = gx.scene.extend({

    initialize: function(planetInfo) {
        this.supr();
        
        planetInfo = planetInfo || {};

        var context = planetInfo.context;
       
        this._rotationPeriod = planetInfo.rotationPeriod; // milliseconds
        this._planetRadius = planetInfo.planetRadius || 1;
        
        var model = new gx.models.sphere(
            context.glx,
            this._planetRadius,
            defaultLatEdgeSize,
            defaultLongEdgeSize);        
        var texture = context.textureManager.getTexture(planetInfo.textureName);

        if (planetInfo.orbitDistance) {
            this._orbit = new supernova.orbit(context, {
                period: planetInfo.orbitPeriod,
                inclination: planetInfo.orbitInclination,
                radius: planetInfo.orbitDistance
            });
        }
        
        this._planet = new gx.drawableObject(context, {
            model: model,
            texture: texture
        });
               
        this.addObject(this._planet);
        
        planetInfo.satelites = planetInfo.satelites || [];
        for (var i = 0; i < planetInfo.satelites.length; i++) {
            var satelite = planetInfo.satelites[i];
            
            this.addObject(satelite);

            // we add the satelite's orbit to this scene becase we don't want the orbit
            // moving along or rotating with the satelite, but along with this planet itself
            this.addObject(satelite._orbit);
        }
    },
    
    update: function(context) {
        this.supr(context);

        // position is set on this scene
        if (this._orbit) {
            this.setPosition(this._orbit.calculateOrbitPosition(context.currentTime));
        }

        // rotation is set on the internal planet object, because we don't want it
        // to propagate to child objects
        if (this._rotationPeriod) {
            this._planet.setRotationY((context.currentTime / this._rotationPeriod) % Math.PI2);
        }
    },
    
    draw: function(context) {
        this.supr(context);                      
    }
});
