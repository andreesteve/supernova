var gx = require('../gx');

var solarSystem = gx.scene.extend({

    initialize: function() {
        this.supr();
    },
    
    update: function(context) {
        this.supr(context);
    },
    
    draw: function(context) {   
        this.supr(context);
    }
});

module.exports = solarSystem;
