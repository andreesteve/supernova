gx.mainLoop = klass({
    /**
     * Initializes the main loop class.
     * @constructor
     * @param options argument to initialize this class.
     * @param options.canvas the canvas to be used for rendering.
     * @param options.projection projection configuration values.
     * @param options.shaderDefinition definition object for shaders to be loaded.
     * @param options.textureDefinition definition object for textures to be loaded.
     */
    initialize: function(options) {
    
        var canvas = options.canvas;

        this._shaderDefinition = options.shaderDefinition || [];

        // out of box shaders
        this._shaderDefinition.push({
            shaderName: 'main',
            vertexShaderName: 'main_vert',
            fragmentShaderName: 'main_frag'
        });
        
        this._textueDefinition = options.textureDefinition || [];
        this._canvas = canvas;
        
        this._glx = new gx();
        this._glx.initializeWebgl(canvas);
        this._glxInput = new gx.input(canvas);
        
        this._context = new gx.drawingContext({
            camera: new gx.camera(),
            projectionMatrix: this._createProjection(canvas, options.projection),
            glx: this._glx,
            glxInput: this._glxInput,
            shaderManager: new gx.shaderManager(this._glx),
            textureManager: new gx.textureManager(this._glx, 'assets/textures/')
        });
    },
    
    start: function() {
        this._setupInternal();
    },
    
    setup: function(context, onSetupComplete) {
    },
    
    update: function(context) {    
    },
    
    draw: function(context) {    
        var gl = this._glx.gl;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);    
    },
    
    _setupInternal: function() {
        var gl = this._glx.gl;
        
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthFunc(gl.GL_LEQUAL);

        // load shaders and textures
        this._context.shaderManager.loadShaders(this._shaderDefinition, function() {            
            this._context.textureManager.loadTextures(this._textueDefinition, function() {
                // then call child class setup
                this.setup(this._context, this._onSetupCompletedInternal.bind(this));
            }.bind(this));
        }.bind(this));
    },
    
    _onSetupCompletedInternal: function() {        
        window.setInterval(this._mainLoop.bind(this), 16.666);
    },
    
    _mainLoop: function() {
        this._context.tick();
        
        this.update(this._context);
        this.draw(this._context);
        
        this._glxInput.tick();
    },
    
    _createProjection: function(canvas, projectionOptions) {
        var aspectRatio = canvas.clientWidth / canvas.clientHeight;
                
        var projectionMatrix = mat4.create();
        mat4.perspective(
            projectionMatrix, 
            projectionOptions.fieldOfView, 
            aspectRatio, 
            projectionOptions.nearPlane, 
            projectionOptions.farPlane);        
            
        return projectionMatrix;
    }
});
