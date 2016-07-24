gx.scene = gx.object.extend({

    initialize: function() {
        this.supr();
        this.objects = [];
    },
    
    addObject: function(object) {
        this.objects.push(object);
    },
    
    update: function(context) {
        this.supr(context);
        
        context.pushWorldMatrix(this._getWorldMatrix());
        
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].update(context);
        }
        
        context.popWorldMatrix();
    },
    
    draw: function(context) {
        this.supr(context);
        
        var worldMatrix = this._getWorldMatrix();
        
        context.pushWorldMatrix(worldMatrix);
        
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].draw(context);
        }
        
        context.popWorldMatrix();
    },
    
    accept: function(visitor) {
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].accept(visitor)) {
                return true;
            }
        }
        
        return false;
    },
});