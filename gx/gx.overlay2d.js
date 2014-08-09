gx.overlay2d = klass({

    initialize: function(options) {
        var canvas = options.canvas;
        var optionsViewport = options.viewport || [];
        var defaultViewport = [0, 0, canvas.clientWidth, canvas.clientHeight];
        
        var viewport = [
            optionsViewport[0] || defaultViewport[0],
            optionsViewport[1] || defaultViewport[1],
            optionsViewport[2] || defaultViewport[2],
            optionsViewport[3] || defaultViewport[3]
        ];
        
        this._baseCanvas = canvas;
        this._overlay = this._createCanvas(canvas, viewport);
        this._context = this._overlay.getContext('2d');
    },
    
    text: function(options) {
    
        var fontName    = options.font          || 'Calibri';
        var fontSize    = options.fontSize      || '40pt';
        var fontStyle   = options.fontStyle     || '';
        var fontColor   = options.fontColor     || 'black';
        var position    = options.position      || [0, 0];
        var text        = options.text          || '';
        
        
        var context = this._context;
        context.fillStyle = fontColor;
        context.font =  fontStyle + ' ' + fontSize + ' ' + fontName;
        context.fillText(text, position[0], position[1]);
    },
    
    circle: function(options) {
    
        var center = options.center || [0, 0];
        var radius = options.radius || 10;
        var color  = options.color  || 'black';
        
        var context = this._context;        
        context.strokeStyle = color;
        
        context.beginPath();
        context.arc(center[0], center[1], radius, 0, Math.PI2);
        context.stroke();
    },
    
    rectangle: function(options) {
        var color   = options.color     || 'white';
        var x       = options.x         || 0;
        var y       = options.y         || 0;
        var width   = options.width     || this._overlay.clientWidth;
        var height  = options.height    || this._overlay.clientHeight;
        
        this._context.fillStyle = color;
        this._context.fillRect(x, y, width, height);
    },
    
    clear: function(options) {
        options = options || {};
        var x = options.x || 0;
        var y = options.y || 0;
        var width = options.width || this._overlay.clientWidth;
        var height = options.height || this._overlay.clientHeigh;
        
        this._context.clearRect (x, y, width, height);
    },
    
    _createCanvas: function(originalCanvas, viewport) {
        var parent = originalCanvas.parentNode;
        
        var originalCanvasZIndex = parseInt(originalCanvas.style.zIndex || 0);

        originalCanvas.style.position = "absolute";
        originalCanvas.style.top = 0;
        
        var canvas = document.createElement('canvas');
        canvas.height = viewport[3];
        canvas.width = viewport[2];
        canvas.style.position = "absolute";
        canvas.style.top = viewport[1];
        canvas.style.left = viewport[0];
        canvas.style.zIndex = originalCanvasZIndex + 1;
        canvas.style.pointerEvents = "none";
        parent.appendChild(canvas);
        
        return canvas;
    }
});