var defaultLatEdgeSize = 50;
var defaultLongEdgeSize = 30;
    
supernova.planet = gx.object.extend({

    initialize: function(planetInfo) {
        this.supr();
        
        planetInfo = planetInfo || {};
        
        this._orbitDistance = planetInfo.orbitDistance || 0;
        this._orbitInclination = planetInfo.orbitInclination || 0;
        this._orbitPeriod = planetInfo.orbitPeriod || 1000; // milliseconds
        
        this._rotationPeriod = planetInfo.rotationPeriod || 1000; // milliseconds
        this._planetRadius = planetInfo.planetRadius || 1;        
        
        this._model = new gx.models.sphere(planetInfo.context.glx, this._planetRadius, defaultLatEdgeSize, defaultLongEdgeSize);        
        this._texture = planetInfo.context.textureManager.getTexture(planetInfo.textureName);
        
        this._satelites = planetInfo.satelites || [];
        
        this._worldPosition = vec3.create();
    },
    
    update: function(context) {
        this.supr();
        
        this._position = this._calculateOrbitPosition(context.currentTime);        
        this._model.rotation[1] = (context.currentTime / this._rotationPeriod) % Math.PI2;
        
        // update world position
        vec3.transformMat4(this._worldPosition, this._position, context.getWorldMatrix());

        context.pushWorldMatrix(this._getWorldMatrix());
        
        for (var i = 0; i < this._satelites.length; i++) {
            this._satelites[i].update(context);
        }
        
        context.popWorldMatrix();
    },
    
    draw: function(context) {
        this.supr();
        
        var worldMatrix = context.getWorldMatrix();
        var modelMatrix = this._model.getModelMatrix();        
               
        this._drawSatelites(context);

        mat4.translate(modelMatrix, modelMatrix, this._position);
        mat4.multiply(modelMatrix, worldMatrix, modelMatrix);
        
        var normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, modelMatrix);        
        
        var shader = context.shaderManager.getShader('main');
        shader.activate();
    
        shader.uniformMatrix("uModelMatrix", modelMatrix);
        shader.uniformMatrix("uViewProjectionMatrix", context.viewProjectionMatrix);        
        shader.uniformMatrix("uNormalMatrix", normalMatrix);

        this._texture.attach(0);
        shader.uniform("uSampler2D", 0, 'i');
           
        shader.uniform3fv('uAmbientLightColor', context.ambientLightColor);
        shader.uniform3fv('uLightPosition', context.lightPosition);
        
        shader.attributeBuffer("aVertexPosition", this._model.modelData.vertexBuffer);
        shader.attributeBuffer("aTexCoord", this._model.modelData.texCoordBuffer);
        shader.attributeBuffer("aNormal", this._model.modelData.normalBuffer);

        shader.drawElements(this._model.modelData.indexBuffer);
    },
    
    accept: function(visitor) {
        var result = this.supr(visitor);
        
        if (result) {
            return result;
        }
        
        for (var i = 0; i < this._satelites.length; i++) {
            result = this._satelites[i].accept(visitor);
            if (result) {
                return result;
            }
        }
        
        return null;
    },
    
    _drawSatelites: function(context) {
        var objectWorldMatrix = this._getWorldMatrix();
        
        context.pushWorldMatrix(objectWorldMatrix);
        
        for (var i = 0; i < this._satelites.length; i++) {
            this._satelites[i].draw(context);
        }
        
        context.popWorldMatrix();
    },
    
    _calculateOrbitPosition:  function(currentTime) {
        // puts element on inclined orbit
        var position = vec3.fromValues(this._orbitDistance * Math.cos(this._orbitInclination), this._orbitDistance * Math.sin(this._orbitInclination), 0);
                
        var matrix = mat4.create();
        mat4.identity(matrix);
        mat4.rotateY(matrix, matrix, (currentTime / this._orbitPeriod) % Math.PI2); // rotates element around center
        //mat4.translate(matrix, matrix, orbitCenter); // translates element to orbit center
        vec3.transformMat4(position, position, matrix);
        
        return position;
    }
});