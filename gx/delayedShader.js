/**
 * Represents a shader that is draw delayed, after all other objects have been drawn.
 */
var delayedShader = function (){};

/**
 * Transforms the actualShader into a delayed shader.
 */
delayedShader.makeDelayed = function(actualShader) {
    actualShader.__immediateDraw = actualShader.draw;
    actualShader.draw = delayedShader.delayedDraw;
    return actualShader;
};

delayedShader._drawQueue = [];

delayedShader.delayedDraw = function(context, model) {
    delayedShader._drawQueue.push({
        shader: this,
        model: model
    });
};

delayedShader.drawDelayed = function (context) {
    var queue = delayedShader._drawQueue;
    for (var i = 0; i < queue.length; i++) {
        var item = queue[i];
        item.shader.__immediateDraw(context, item.model);
    }
};

delayedShader.clearDelayedQueue = function() {
    delayedShader._drawQueue = [];
};

module.exports = delayedShader;
