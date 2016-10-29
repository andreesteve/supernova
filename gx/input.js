var glmatrix = require('gl-matrix');
var vec2 = glmatrix.vec2;

var input = function(canvas) {    
    this.currentKeys = [];
    this.previousKeys = [];
    this.mousePosition = vec2.create();
    this.lastMousePosition = vec2.create();
    this.mouseButtons = [];
    this.canvas = canvas;
    this.enableContextMenu = false;
    
    document.addEventListener('keydown', this.keydown.bind(this), false);
    document.addEventListener('keyup', this.keyup.bind(this), false);
    canvas.addEventListener('mousemove', this.mousemove.bind(this), false);
    canvas.addEventListener('mousedown', this.mousedown.bind(this), false);
    canvas.addEventListener('mouseup', this.mouseup.bind(this), false);
    canvas.addEventListener('contextmenu', this.contextMenu.bind(this), false);
};

input.prototype.contextMenu = function (e) {   
    if (e.button == 2 && !this.enableContextMenu) {
        e.preventDefault();
        return false;
    }
    
    return true;
};

input.prototype.keydown = function (e) {
    this.currentKeys[e.keyCode] = true;    
};

input.prototype.keyup = function (e) {
    this.currentKeys[e.keyCode] = false;
};

input.prototype.getKeyCode = function (keyValueCode) {
    var isKeyCode = keyValueCode + 0 === keyValueCode;
    if (isKeyCode) {
        return keyValueCode;
    }
    return keyValueCode.charCodeAt(0);
};

/**
*   returns whether the key is currently being held or not.
*/
input.prototype.isKeyBeingHeld = function (keyValue) {
    var keyCode = this.getKeyCode(keyValue);
    return this.currentKeys[keyCode] && this.previousKeys[keyCode];
};

/**
*   returns true in case this key has been pressed but is not being held
*/
input.prototype.isKeySinglePress = function (keyValue) {
    var keyCode = this.getKeyCode(keyValue);
    return this.currentKeys[keyCode] && !this.previousKeys[keyCode];
};

input.prototype.isKeyPressed = function (keyValue) {    
    var keyCode = this.getKeyCode(keyValue);
    return this.currentKeys[keyCode];
};

input.prototype.isKeyReleased = function (keyValue) {
    return !this.isKeyPressed(keyValue);
};

input.prototype.isLeftButtonPressed = function () {
    return this.mouseButtons[0];
};

input.prototype.isRightButtonPressed = function () {
    return this.mouseButtons[2];
};

input.prototype.getMousePosition = function () {
    return vec2.clone(this.mousePosition);
};

input.prototype.getMouseDisplacement = function () {
    var d = vec2.create();
    return vec2.sub(d, this.mousePosition, this.lastMousePosition);
};

input.prototype.getRelativeMouseDisplacement = function () {
    var d = this.getMouseDisplacement();
    var rec = this.canvas.getBoundingClientRect();
    
    vec2.set(d,
        d[0] / rec.width,
        d[1] / rec.height);
    
    return d;
};

input.prototype.mousemove = function(e) {   
    var canvas = e.target;
    var rect = canvas.getBoundingClientRect();
    
    vec2.set(this.mousePosition,
        e.clientX - rect.left,
        e.clientY - rect.top);
};

input.prototype.mousedown = function(e) {   
    var canvas = e.target;
    this.mouseButtons[e.button] = true;
};

input.prototype.mouseup = function(e) {   
    var canvas = e.target;
    this.mouseButtons[e.button] = false;
};

input.prototype.tick = function(e) {   
    vec2.set(this.lastMousePosition,
        this.mousePosition[0],
        this.mousePosition[1]);
        
    for (var keyCode in this.currentKeys) {
        this.previousKeys[keyCode] = this.currentKeys[keyCode];
    }
};

module.exports = input;
