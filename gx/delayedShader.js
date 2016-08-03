/**
 * Represents a shader that is draw delayed, after all other objects have been drawn.
 */
gx.delayedShader = function (){};

/**
 * Transforms the actualShader into a delayed shader.
 */
gx.delayedShader.makeDelayed = function(actualShader) {
    actualShader.__immediateDraw = actualShader.draw;
    actualShader.draw = gx.delayedShader.delayedDraw;
    return actualShader;
};

gx.delayedShader._drawQueue = [];

gx.delayedShader.delayedDraw = function(context, model) {
    gx.delayedShader._drawQueue.push({
        shader: this,
        model: model
    });
};

gx.delayedShader.drawDelayed = function (context) {
    var queue = gx.delayedShader._drawQueue;
    for (var i = 0; i < queue.length; i++) {
        var item = queue[i];
        item.shader.__immediateDraw(context, item.model);
    }
};

gx.delayedShader.clearDelayedQueue = function() {
    gx.delayedShader._drawQueue = [];
};
