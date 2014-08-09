supernova.mainLoop = gx.mainLoop.extend({
    
    initialize: function(canvas) {
        this.supr({
            canvas: canvas,
            projection: {
                fieldOfView: 45 * Math.Degree,
                nearPlane: 0.1,
                farPlane: 100
            },
        });
        
        this._overlay = new gx.overlay2d({
            canvas: canvas
        });
        
        this._overlay.text({
            position: [100, 100],
            text: 'test',
            fontColor: 'white'
        });
        
        this._overlay.circle({
            center: [100, 100],
            radius: 100,
            color: 'white'
        });
        
        this._debug = new supernova.debugPrinter({
            canvas: canvas
        });
        
        // current time
        this._debug.addDebugCallback(function(context) {
            return "currentTime: " + context.currentTime;
        });
        
        var formatArray = this._debug.formatArray;
        
        // mouse position
        this._debug.addDebugCallback(function(context) {
            var pos = context.glxInput.getMousePosition();
            return "mouse: " + formatArray(pos);
        });

        // mouse projection
        this._debug.addDebugCallback(function(context) {
            var pos = context.glxInput.getMousePosition();
            var projected = context.getProjectionHelper().unproject(pos);
            return "mouse 3D: " + formatArray(projected);
        });
        
        this._scene = null;
        this._ambientLightColor = vec3.fromValues(0.3, 0.3, 0.3);
    },
    
    setup: function(context, onSetupComplete) {
        var glx = context.glx;
    
        var shaderDefinition = [
            { shaderName: 'main', vertexShaderName: 'main_vert', fragmentShaderName: 'main_frag' },
            { shaderName: 'sun', vertexShaderName: 'sun_vert', fragmentShaderName: 'sun_frag' }
        ];
        
        var textureDefinition = [
            { textureName: 'earth', texturePath: 'earth_flat_map.jpg' },
            { textureName: 'moon', texturePath: 'moon.bmp' },
            { textureName: 'sun', texturePath: 'sun.jpg' },
        ];
    
        var shaderManager = new supernova.shaderManager(glx);
        var textureManager = new supernova.textureManager(glx, 'assets/textures/');
    
        context.shaderManager = shaderManager;
        context.textureManager = textureManager;
    
        shaderManager.loadShaders(shaderDefinition, function() {            
            textureManager.loadTextures(textureDefinition, function() {
            
                this._setupScene(context);
                onSetupComplete();
            }.bind(this));
        }.bind(this));
    },
    
    update: function(context) {    
        this.supr(context);
        this._moveCameraInput(context);
        this._scene.update(context);
    },
    
    draw: function(context) {
        this.supr(context);
        
        context.ambientLightColor = new Float32Array(this._ambientLightColor);
        context.lightPosition = new Float32Array([0, 0, 0]);
    
        this._scene.draw(context);
                
        if (context.glxInput.isLeftButtonPressed())
        {
            var mousePos = context.glxInput.getMousePosition();
            //this.raytraceObject(resolution, context._camera._position, context.viewProjectionMatrix, this._scene.objects, mousePos);
        }
    },    
    
    raytraceObject: function(cameraPosition, viewProjectionMatrix, objectList, viewportPosition) {
        var directionScreenCoords = vec4.fromValues(
            -1 + 2 * viewportPosition[0] / resolution[0], 
            1 - 2 * viewportPosition[1] / resolution[1], 
            2.0 * (viewportPosition[2] || 0) -1.0,
            1);
        
        var inverse = mat4.create();
        mat4.invert(inverse, viewProjectionMatrix);
        
        var directionWorldCoords = vec4.create();
        vec4.transformMat4(directionWorldCoords, directionScreenCoords, inverse);
        
        var w = directionWorldCoords[3];
        var _directionWorldCoords = vec3.fromValues(directionWorldCoords[0] / w, directionWorldCoords[1] / w, directionWorldCoords[2] / w);
        
        for (var i = 0; i < objectList.length; i++) {
            var obj = objectList[i];
            
            var radius = obj._planetRadius;
            var pos = obj._position;
            
            if (this.raySphereIntersection(pos, radius, cameraPosition, _directionWorldCoords)) {
            
                this._overlay.circle({
                    center: viewportPosition,
                    radius: 10,
                    color: 'white'
                });
            
                break;
            }            
        }
    },
    
    raySphereIntersection: function(sphereCenter, sphereRadius, rayOrigin, rayDirection) {
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
    
    _setupScene: function(context) {
        var scene = new supernova.solarSystem();        
                   
        var moon = new supernova.planet({
            context: context,
            planetRadius: 0.5,
            rotationPeriod: 1000,
            orbitPeriod: 1000,
            orbitInclination: 20 * Math.Degree,
            orbitDistance: 5,
            textureName: 'moon'
        });
        
        var earth = new supernova.planet({
            context: context,
            planetRadius: 1,
            rotationPeriod: 1000,
            orbitPeriod: 2000,
            orbitInclination: 0,
            orbitDistance: 10,
            textureName: 'earth',
            satelites: [ moon ]
        });
        
        var earth = new supernova.planet({
            context: context,
            planetRadius: 1,
            rotationPeriod: 1000,
            orbitPeriod: 0,
            orbitInclination: 0,
            orbitDistance: 0,
            textureName: 'sun',
            satelites: [ earth ]
        });
            
        scene.addObject(earth);
        
        scene.addObject(this._debug);
        
        this._scene = scene;
        
        var camera = context._camera;
        camera.setPosition([0, 0, 0]);
        camera.setTarget([0, 0, 1]);
    },
    
    _moveCameraInput: function(context) {       
        var cameraDisplacement = vec3.create();
        var elapsedTime = context.elapsedTime;
        var camera = context._camera;
        var pitch = 0;
        var yaw = 0;
        var glxInput = context.glxInput;
        
        var ambientLightColor = this._ambientLightColor;
        
        if (glxInput.isKeyPressed('W')) {
            cameraDisplacement[2] = 1;
        } else if (glxInput.isKeyPressed('S')) {
            cameraDisplacement[2] = -1;
        } else if (glxInput.isKeyPressed('A')) {
            cameraDisplacement[0] = -1;
        } else if (glxInput.isKeyPressed('D')) {
            cameraDisplacement[0] = 1;
        } else if  (glxInput.isKeyPressed(37)) { // left arrow
            yaw = Math.PI * 0.01;
        } else if (glxInput.isKeyPressed(38)) { // up arrow
            pitch = Math.PI * 0.01;
        } else if (glxInput.isKeyPressed(39)) { // right arrow
            yaw = -Math.PI * 0.01;
        } else if (glxInput.isKeyPressed(40)) { // down arrow
            pitch = -Math.PI * 0.01;
        }
        
        if (glxInput.isKeySinglePress(107)) { // plus
            var v = Math.min(ambientLightColor[0] + 0.1, 1);
            ambientLightColor[0] = v;
            ambientLightColor[1] = v;
            ambientLightColor[2] = v;
        } else if (glxInput.isKeySinglePress(109)) { // minus
            var v = Math.max(ambientLightColor[0] - 0.1, 0);
            ambientLightColor[0] = v;
            ambientLightColor[1] = v;
            ambientLightColor[2] = v;
        }
        
        var rotationSpeed = Math.PI * 0.04 * elapsedTime;
        if (glxInput.isRightButtonPressed()) {            
            var mouseRelDisp = glxInput.getRelativeMouseDisplacement();
            pitch = -mouseRelDisp[1] * rotationSpeed;
            yaw = -mouseRelDisp[0] * rotationSpeed;
        }
        
        var deltaPitch = pitch * rotationSpeed;
        var deltaYaw = yaw * rotationSpeed;
        camera.rotate(deltaPitch, deltaYaw);
        
        var cameraSpeed = 0.01;
        vec3.scale(cameraDisplacement, cameraDisplacement, elapsedTime * cameraSpeed);
        camera.move(cameraDisplacement);
    }
});