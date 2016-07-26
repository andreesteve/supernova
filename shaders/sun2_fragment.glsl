precision mediump float;

varying vec3 aBar;
varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec4 vPosition;

uniform vec3 uAmbientLightColor;
uniform vec3 uLightPosition;
uniform sampler2D uSampler2D;
uniform float uWireframe;
uniform float uWireframeWidth;

void main(void) {

    vec4 texColor = texture2D(uSampler2D, vec2(vTexCoord.s, vTexCoord.t));
    float w = 1.;
    
    gl_FragColor = vec4(texColor.rgb * w, texColor.a);
}
