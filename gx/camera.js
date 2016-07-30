gx.camera = function(position) {
    this._position = position || [0, 0, 0];
    this._target = [0, 0, 1];
    this._forward = [0, 0, 1];
    this._up = [0, 1, 0];
    this.lockOnTarget = false;
};

gx.camera.prototype.getViewMatrix = function() {
    var view = mat4.create();
    mat4.lookAt(view, this._position, this._target, this._up);
    
    return view;
};

/**
*   Returns the normalized forward vector.
*   That is the vector that points on the direction of the camera's target from the camera's position.
*   The vector is based on the origin.
*/
gx.camera.prototype.getForward = function() {
    /*var lookDirection = vec3.create();

    if (this.lockOnTarget) {
        vec3.subtract(lookDirection, this.target, this._position);
        vec3.normalize(lookDirection, lookDirection);
    }
    
    return lookDirection;*/
    return this._forward;
};

gx.camera.prototype.setPosition = function(position) {

    var displacement = vec3.create();
    vec3.sub(displacement, position, this._position);

    this._position = position;

    this._updateTarget();
};

gx.camera.prototype.getPosition = function() {
    return vec3.clone(this._position);
};

gx.camera.prototype.setTarget = function(target) {

    this._target = target;
    
    // update forward vector
    // forward = target - position
    vec3.sub(this._forward, this._target, this._position);
    vec3.normalize(this._forward, this._forward);
    
    // update up vector
    // up = forward * matrix 90º rotation on X
    var rot90degreeX = mat4.create();
    mat4.identity(rot90degreeX);
    mat4.rotateX(rot90degreeX, rot90degreeX, -Math.PI / 2);
    vec3.transformMat4(this._up, this._forward, rot90degreeX);
};

gx.camera.prototype.move = function(displacement) {
    
    var move = vec3.create();
    var temp = vec3.create();
    
    // z -> back/forth
    vec3.scale(temp, this._forward, displacement[2]);    
    vec3.add(move, temp, move);

    // y -> up/down
    vec3.scale(temp, this._up, displacement[1]);    
    vec3.add(move, temp, move);

    // x -> sideways
    if (displacement[0]) {
        var side = this._getSide();      
        vec3.scale(temp, side, displacement[0]);    
        vec3.add(move, temp, move);
    }
        
    vec3.add(this._position, this._position, move);   
    this._updateTarget();
};

gx.camera.prototype.rotate = function(pitch, yaw, roll) {

    var rot = mat4.create();
    mat4.identity(rot);
    
    if (pitch) {
        var side = this._getSide();    
        mat4.rotate(rot, rot, pitch, side);
    }
    
    if (yaw) {
        mat4.rotate(rot, rot, yaw, this._up);
    }
    
    if (roll) {
        mat4.rotate(rot, rot, roll, this._forward);
    }
    
    vec3.transformMat4(this._forward, this._forward, rot);
    vec3.transformMat4(this._up, this._up, rot);
    this._updateTarget();
};

gx.camera.prototype._getSide = function() {
    var side = vec3.create();
    vec3.cross(side, this._forward, this._up);       
    return side;
};

gx.camera.prototype._updateTarget = function() {
/*    if (this.lockOnTarget ||
        (displacement[0] == 0 && displacement[1] == 0 && displacement[2] == 0)) {
        return;
    }*/
    
    vec3.add(this._target, this._position, this._forward);
};
