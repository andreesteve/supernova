attribute vec3 aVertexPosition;

uniform mat4 uModelViewMatrix;

void main(void) {   
    gl_Position = vec4(aVertexPosition.xyz, 1.);
}