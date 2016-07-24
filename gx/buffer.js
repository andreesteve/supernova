gx.buffer = function(gl, itemSize, bufferType) {
    this.glBuffer = gl.createBuffer();
    this.itemSize = itemSize;
    this.hint = gl.STATIC_DRAW;
    this.bufferType = bufferType || gl.ARRAY_BUFFER;    
    this.gl = gl;
    
    if (this.bufferType == this.gl.ELEMENT_ARRAY_BUFFER) {
        this.dataType = gl.UNSIGNED_SHORT;
        this.arrayType = Uint16Array;
    } else {
        this.dataType = gl.FLOAT;
        this.arrayType = Float32Array;
    }
};

gx.buffer.prototype.fill = function(data) {
    this.count = data.length / this.itemSize;
    
    var formatedData = data instanceof this.arrayType 
        ? data 
        : new this.arrayType(data);
    
    this.activate();
    this.gl.bufferData(this.bufferType, formatedData, this.hint);
};

gx.buffer.prototype.activate = function() {
    this.gl.bindBuffer(this.bufferType, this.glBuffer);
};