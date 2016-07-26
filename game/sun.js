supernova.sun = supernova.planet.extend({

    _drawInternal: function(context) {
        var worldMatrix = context.getWorldMatrix();
        var modelMatrix = this._model.getModelMatrix();
        
        mat4.translate(modelMatrix, modelMatrix, this._position);
        mat4.multiply(modelMatrix, worldMatrix, modelMatrix);
        
        var normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, modelMatrix);        
        
        var shader = context.shaderManager.getShader('sun');
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
        
/*
        var fieldOfViewRad = Math.PI * 45.0 / 180.0;
        var focalLength = focalLength = 1.0 / Math.tan(fieldOfViewRad / 2.0);

        var worldMatrix = context.getWorldMatrix();
        var modelMatrix = this._model.getModelMatrix();

        var viewMatrix = context._camera.getViewMatrix();
        var modelViewTransformMatrix = mat4.create();
        
        mat4.multiply(modelViewTransformMatrix, viewMatrix, modelMatrix);
        
//        mat4.translate(modelMatrix, modelMatrix, this._position);
//        mat4.multiply(modelMatrix, worldMatrix, modelMatrix);
        
        var shader = context.shaderManager.getShader('sun');
        shader.activate();
        
        shader.uniform2fv('uResolution', [context.glx.gl.canvas.width, context.glx.gl.canvas.height]);
        shader.uniform('uFocalLength', focalLength, 'f');
        shader.uniform('uRadius', this._planetRadius, 'f');        
        shader.uniform3fv('uSunCenter', this._position);
        shader.uniformMatrix("uModelViewTransformation", modelViewTransformMatrix);               
        
        shader.drawElements(this._model.modelData.indexBuffer);
*/
    }
});
