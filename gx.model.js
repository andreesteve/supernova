// model data
gx.modelData = function() {
    this.vertices = [];
    this.normals = [];
    this.indexes = [];
    this.textureCoords = [];
};

gx.modelData.prototype.createBuffers = function(glx) {
    this.indexBuffer = glx.createBuffer(1, this.indexes, 'ELEMENT_ARRAY_BUFFER');
    this.normalBuffer = glx.createBuffer(3, this.normals);
    this.vertexBuffer = glx.createBuffer(3, this.vertices);
    this.texCoordBuffer = glx.createBuffer(2, this.textureCoords);
};

// model
gx.model = function(glx, modelData) {
    this.glx = glx;
    this.modelData = modelData;
    
    this.position = vec3.create();    
    this.rotation = vec3.create();
};

gx.model.prototype.getModelMatrix = function() {
    var modelMatrix = mat4.create();
    
    mat4.identity(modelMatrix);
    mat4.rotateX(modelMatrix, modelMatrix, this.rotation[0]);
    mat4.rotateY(modelMatrix, modelMatrix, this.rotation[1]);
    mat4.rotateZ(modelMatrix, modelMatrix, this.rotation[2]);
    mat4.translate(modelMatrix, modelMatrix, this.position);
    
    return modelMatrix;
};

gx.models = {};

// shpere
gx.models.sphere = function (glx, radius, latitudeSize, longitudeSize) {    
    var m = new gx.modelData(glx);
    
    var TwoPi = 2 * Math.PI;
    var longitudeDelta = TwoPi / latitudeSize;
    var latitudeDelta = Math.PI / longitudeSize;

    var latitudeSizePlusOne = latitudeSize + 1;
    var triangleCount = latitudeSizePlusOne * longitudeSize;
    
    for (var j = 0; j <= longitudeSize; j++) {

        // latitude
        var lat = latitudeDelta * j - (Math.PI / 2);

        for (var i = 0; i <= latitudeSize; i++) {

            // longitude
            var lon = longitudeDelta * i;

            // normalized vertices
            var xz = Math.cos(lat);
            var x = -Math.cos(lon) * xz;
            var y = Math.sin(lat);
            var z = Math.sin(lon) * xz;
        
            m.normals.push(x, y, z);
        
            // position must consider radius
            m.vertices.push(x * radius, y * radius, z * radius);            
            
            // map lat and long to [0,1]
            m.textureCoords.push(lon / TwoPi, - ((lat / Math.PI) + 0.5));

            // define triangles' index
            if (j < longitudeSize) {
                var indexBase = j * latitudeSizePlusOne;
                
                var a1Index = indexBase + i;
                var a2Index = indexBase + ((i + 1) % latitudeSizePlusOne);
                
                var nextStripBase = (j + 1) * latitudeSizePlusOne;
                
                var b1Index = nextStripBase + i;
                var b2Index = nextStripBase + ((i + 1) % latitudeSizePlusOne);
                
                m.indexes.push(a1Index, b2Index, b1Index);                
                m.indexes.push(a1Index, a2Index, b2Index);
            }
        }
    }
    
    m.createBuffers(glx);
    
    return new gx.model(glx, m);
};

gx.models.face = function (glx, left, right) {
    var m = new gx.modelData(glx);
    
    m.vertices.push(left[0], left[1], left[2]); // 0 - left top
    m.vertices.push(right[0], left[1], left[2]); // 1 - right top
    m.vertices.push(right[0], right[1], right[2]); // 2 - right bottom
    m.vertices.push(left[0], right[1], right[2]); //3 - left bottom
    
    m.indexes.push(0, 1, 3);
    m.indexes.push(1, 2, 3);
    
    m.createBuffers(glx);
    
    return new gx.model(glx, m);
};