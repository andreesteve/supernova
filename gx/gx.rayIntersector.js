gx.rayIntersector = klass({
    initialize: function(options) {
        this._rayOrigin = options.rayOrigin;
        this._rayDirection = options.rayDirection;
        this._intersectedObj = null;
    },
    
    intersects: function(scene) {
        scene.accept(this);    
        return this._intersectedObj;
    },
    
    visit: function(obj) {
        // TODO: using game specific values, fix this
        var intersects = this._raySphereIntersection(
            obj._worldPosition, 
            obj._planetRadius, 
            this._rayOrigin,
            this._rayDirection);
            
        if (intersects) {
            this._intersectedObj = obj;
        }
        
        return intersects;
    },
    
    _raySphereIntersection: function(sphereCenter, sphereRadius, rayOrigin, rayDirection) {
        // http://en.wikipedia.org/wiki/Line%E2%80%93sphere_intersection
        
        var rayOriginMinusSphereCenter = vec3.create();
        vec3.subtract(rayOriginMinusSphereCenter, rayOrigin, sphereCenter);
        
        var a = vec3.dot(rayDirection, rayOriginMinusSphereCenter);
        var rayOriginMinusSphereCenterLengthSquare = vec3.dot(rayOriginMinusSphereCenter, rayOriginMinusSphereCenter);
        var radiusSquare = sphereRadius * sphereRadius;
        var aSquare = a * a;
        
        var b = aSquare - rayOriginMinusSphereCenterLengthSquare + radiusSquare;
        
        if (b < 0) {
            return false;
        }
        
        return true;
    },
});