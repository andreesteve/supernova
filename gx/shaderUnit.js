/**
*   type = gl.FRAGMENT_SHADER | gl.VERTEX_SHADER
*/
var shaderUnit = function(shaderId, shaderString, type) {
    this.id = shaderId;
    this.glShader = null;
    this.shaderString = shaderString;
    this.shaderType = type;
};

shaderUnit.prototype.compile = function(gl) {
    this.glShader = gl.createShader(this.shaderType);
    
    gl.shaderSource(this.glShader, this.shaderString);
    
    gl.compileShader(this.glShader);
    
    if (!gl.getShaderParameter(this.glShader, gl.COMPILE_STATUS)) {
        throw 'Shader compilation error for shader "' + this.id + '": ' + gl.getShaderInfoLog(this.glShader);
    }
};

/* SHADER PROGRAM */

var shaderProgram = function(gl, vertexShader, fragmentShader) {
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.glShaderProgram = null;
    this.gl = gl;
};

shaderProgram.prototype.linkProgram = function() {   
    this.glShaderProgram = this.gl.createProgram();
    
    this.gl.attachShader(this.glShaderProgram, this.vertexShader.glShader);
    this.gl.attachShader(this.glShaderProgram, this.fragmentShader.glShader);
    this.gl.linkProgram(this.glShaderProgram);

    if (!this.gl.getProgramParameter(this.glShaderProgram, this.gl.LINK_STATUS)) {
        throw this.gl.getProgramInfoLog(this.glShaderProgram);
    }
};

shaderProgram.prototype.activate = function() {
    this.gl.useProgram(this.glShaderProgram);
};

shaderProgram.prototype.attributeBuffer = function(attributeName, buffer) {  
    var attributeLocation = this.gl.getAttribLocation(this.glShaderProgram, attributeName);    
    this.gl.enableVertexAttribArray(attributeLocation);
        
    buffer.activate();
    this.gl.vertexAttribPointer(attributeLocation, buffer.itemSize, buffer.dataType, false, 0, 0);
};

shaderProgram.prototype.uniform = function(uniformName, value, type) {
    // TODO: review this, make 1-to-1 to webgl methods
    type = type || 'f';
    
    var uniformLocation = this.gl.getUniformLocation(this.glShaderProgram, uniformName);
    
    switch (type) {
        case 'f':
            this.gl.uniform1f(uniformLocation, value);
            break;
            
        case 'i':
            this.gl.uniform1i(uniformLocation, value);
            break;
            
        default:
            throw 'Not suported';
    }
};

shaderProgram.prototype.uniform3fv = function(uniformName, value) {
    var uniformLocation = this.gl.getUniformLocation(this.glShaderProgram, uniformName);
    this.gl.uniform3fv(uniformLocation, value);
};

shaderProgram.prototype.uniform2fv = function(uniformName, value) {
    var uniformLocation = this.gl.getUniformLocation(this.glShaderProgram, uniformName);
    this.gl.uniform2fv(uniformLocation, value);
};

shaderProgram.prototype.uniformMatrix = function(uniformName, value, type) {
    var uniformLocation = this.gl.getUniformLocation(this.glShaderProgram, uniformName);
    
    if (value.length == 16) {
        this.gl.uniformMatrix4fv(uniformLocation, false, value);
    } else {
        this.gl.uniformMatrix3fv(uniformLocation, false, value);
    }    
};

shaderProgram.prototype.drawArrays = function(count) {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, count);
};

shaderProgram.prototype.drawElements = function(indexBuffer) {
    indexBuffer.activate();    
    this.gl.drawElements(this.gl.TRIANGLES, indexBuffer.count, indexBuffer.dataType, 0);
};

module.exports = {
    shaderProgram: shaderProgram,
    shaderUnit: shaderUnit
};
