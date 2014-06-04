gx.texture = function(gl, image) {
    this.gl = gl;
    this.glTexture = gl.createTexture();
    this.target = gl.TEXTURE_2D;
    
    this.setImage(image);
        
    gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
};

gx.texture.prototype.setImage = function(image) {
    this.activate();
    
    this.gl.texImage2D(
        this.target, 
        0, 
        this.gl.RGBA, 
        this.gl.RGBA, 
        this.gl.UNSIGNED_BYTE, 
        image);    
        
    this.generateMipmap();
};

gx.texture.prototype.activate = function() {
    this.gl.bindTexture(this.target, this.glTexture);    
};

gx.texture.prototype.attach = function(textureIndex) {
    this.gl.activeTexture(this.gl.TEXTURE0 + textureIndex);
    this.activate();
};

gx.texture.prototype.generateMipmap = function() {
    this.gl.generateMipmap(this.target);
};