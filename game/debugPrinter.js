supernova.debugPrinter = gx.object.extend({
    initialize: function(options) {
        this.supr();
        
        var width = 500;
        var height = 200;
        var x = options.canvas.clientWidth - width;
        var y = 0;
        
        this._callbacks = [];
        this._fontColor = 'white';
        this._fontSize = 10;
        this._lineDistance = 5;
        
        this._overlay = new gx.overlay2d({
            canvas: options.canvas,
            viewport: [x, y, width, height]
        });
    },
    
    addDebugCallback: function(callback) {
        this._callbacks.push(callback);
    },
    
    formatArray: function(array) {
        var result = "(";

        for (var i = 0; i < array.length; i++) {
            var value = array[i];
            var valueAsNumber = parseFloat(value);
            
            if (!isNaN(valueAsNumber)) {
                value = Math.round(valueAsNumber * 1000) / 1000;
            }            
            
            result += value + ', '
        }
        
        result = result.substring(0, result.length - 2);
        result += ')';
        
        return result;
    },
    
    update: function(context) {
        this.supr();
    },
    
    draw: function(context) {
        this.supr();

        this._overlay.rectangle({
            color: 'black',
        });
        
        var position = [10, this._lineDistance + this._fontSize];
        var fontSize = this._fontSize + 'pt';
        
        for (var i = 0; i < this._callbacks.length; i++) {
            var value = this._callbacks[i](context);
            
            this._overlay.text({
                text: value,
                fontColor: this._fontColor,
                fontSize: fontSize,
                position: position
            });
            
            position[1] += this._fontSize + this._lineDistance;
        }
    }
});