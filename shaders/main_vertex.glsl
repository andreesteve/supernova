attribute vec3 aVertexPosition;
attribute vec2 aTexCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewProjectionMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNormalMatrix;

varying vec4 vPosition;
varying vec3 aBar;
varying vec3 vNormal;
varying vec2 vTexCoord;

void main(void) {

    // TODO: review
    aBar = vec3(1, 0, 0);

    vNormal = uNormalMatrix * aNormal;
    vPosition = uModelMatrix * vec4(aVertexPosition, 1.0);
    vTexCoord = aTexCoord;
    
    gl_Position = uViewProjectionMatrix * vPosition;
}