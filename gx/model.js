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
};

gx.models = {};

// shpere
gx.models.sphere = function (glx, radius, latitudeSize, longitudeSize) {
    if (!glx) {
        throw 'glx must be provided';
    }

    if (isNaN(radius) || radius <= 0) {
        throw 'radius must be greater than 0';
    }

    if (isNaN(latitudeSize) || latitudeSize <= 0) {
        throw 'latituteSize must be greater than 0';
    }

    if (isNaN(longitudeSize) || longitudeSize <= 0) {
        throw 'latituteSize must be greater than 0';
    }

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

gx.models.disk = function (glx, outer, inner, slices) {
    var m = new gx.modelData(glx);

    // angle for each slice
    var t = Math.PI * 2 / slices;
    
    // a is the point on the inner circle, b is the one on the outer
    var ay = 0;
    var ax = inner;
    var by = 0;
    var bx = outer;

    m.vertices.push(ax, ay, 0);
    m.vertices.push(bx, by, 0);
    
    for (var i = 1; i < slices; i++) {
        var nt = i * t;
        var sin = Math.sin(nt);
        var cos = Math.cos(nt);
        var ay = inner * sin;
        var ax = inner * cos;
        var by = outer * sin;
        var bx = outer * cos;

        // push new vertices calculated
        m.vertices.push(ax, ay, 0);
        m.vertices.push(bx, by, 0);

        // index quad
        var index = i * 2;
        m.indexes.push(index + 0, index + 2, index + 1);
        m.indexes.push(index + 2, index + 3, index +1);        
    }
    
    // index last quad
    var index = slices * 2;
    m.indexes.push(index + 0, 0, index + 1);
    m.indexes.push(0,         1, index +1);

    return new gx.model(glx, m);    
};
