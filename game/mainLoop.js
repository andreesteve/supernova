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
        
        this._scene = scene;
        
        var camera = context._camera;
        camera.setPosition([0, 50, 0]);
        camera.setTarget([0, 0, 0]);
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
        if (glxInput.isLeftButtonPressed()) {            
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