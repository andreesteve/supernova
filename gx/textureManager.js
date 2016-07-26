gx.textureManager = klass({
    initialize: function(glx, basePath) {    
        this._glx = glx;
        this._basePath = basePath || "";
        this._textures = {};
    },
     
    loadTextures: function(texturesDefinition, onLoadCompleted) {
        var loadCount = 0;
        var onTextureLoadCompleted = function() {
            loadCount++;
            if (texturesDefinition.length == loadCount) {
                onLoadCompleted();
            }
        };
    
        for (var i = 0; i < texturesDefinition.length; i++) {
            var textureDefinition = texturesDefinition[i];
            this._loadTexture(textureDefinition.textureName, textureDefinition.texturePath, onTextureLoadCompleted);
        }
    },
    
    getTexture: function(textureName) {
        return this._textures[textureName];
    },
     
    _loadTexture: function(name, path, loadCompleted) {    
        var fullPath = this._basePath + path;
    
        this._glx.createTexture(fullPath, function(texture) {
            this._textures[name] = texture;
            loadCompleted();
        }.bind(this));
    }
});
