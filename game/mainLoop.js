supernova.mainLoop = gx.mainLoop.extend({
    
    initialize: function(canvas) {
        var shaderDefinition = [
            { shaderName: 'sun', vertexShaderName: 'main_vert', fragmentShaderName: 'sun2_frag' }
        ];
        
        var textureDefinition = [
            { textureName: 'earth', texturePath: 'earth_flat_map.jpg' },
            { textureName: 'moon', texturePath: 'moon.bmp' },
            { textureName: 'sun', texturePath: 'sun.jpg' },
        ];

        this.supr({
            canvas: canvas,
            projection: {
                fieldOfView: 45 * Math.Degree,
                nearPlane: 0.1,
                farPlane: 100
            },
            shaderDefinition: shaderDefinition,
            textureDefinition: textureDefinition
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
            var projected = context.getProjectionHelper().unprojectScreenCoordinates(pos);
            return "mouse 3D: " + formatArray(projected);
        });
        
        this._scene = null;
        this._ambientLightColor = vec3.fromValues(0.3, 0.3, 0.3);
    },
    
    setup: function(context, onSetupComplete) {
        this._setupScene(context);
        onSetupComplete();
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

        this._overlay.clear();
        var mousePos = context.glxInput.getMousePosition();
        this.raytraceObject(context, context._camera._position, this._scene, mousePos);
    },    
    
    raytraceObject: function(context, cameraPosition, scene, viewportPosition) {
        var helper = context.getProjectionHelper();
        var worldPosition = helper.unprojectScreenCoordinates(viewportPosition);
        var rayDirection = vec3.create();
        vec3.sub(rayDirection, worldPosition, cameraPosition);
        vec3.normalize(rayDirection, rayDirection);
        
        var intersector = new gx.rayIntersector({
            rayOrigin: cameraPosition,
            rayDirection: rayDirection
        });
        
        var intersectedObject = intersector.intersects(scene);
        
        if (intersectedObject != null) {
            this._overlay.circle({
                    center: viewportPosition,
                    radius: 10,
                    color: 'white'
            });
        }
    },
    
    _setupScene: function(context) {
        var scene = new supernova.solarSystem();        
                   
        var moon = new supernova.planet({
            context: context,
            planetRadius: 0.3,
            rotationPeriod: 1000,
            orbitPeriod: 1000,
            orbitInclination: 20 * Math.Degree,
            orbitDistance: 5,
            textureName: 'moon'
        });
        
        var earth = new supernova.planet({
            context: context,
            planetRadius: 0.8,
            rotationPeriod: 1000,
            orbitPeriod: 2000,
            orbitInclination: 0,
            orbitDistance: 10,
            textureName: 'earth',
            satelites: [ moon ]
        });
        
        var me = this;
        this._debug.addDebugCallback(function(context) {
            return "earth: " + me._debug.formatArray(earth.getPosition());
        });
        
        var sun = new supernova.sun({
            context: context,
            planetRadius: 1,
            rotationPeriod: 1000,
            orbitPeriod: 0,
            orbitInclination: 0,
            orbitDistance: 0,
            textureName: 'sun',
            satelites: [ earth ]
        });
        
        scene.addObject(sun);
        
        scene.addObject(this._debug);
        
        this._scene = scene;
        
        var camera = context._camera;
        camera.setPosition([0, 0, -20]);
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
