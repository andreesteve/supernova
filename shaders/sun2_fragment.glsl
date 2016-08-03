precision mediump float;

varying vec3 aBar;
varying vec2 vTexCoord;
varying vec3 vNormal;
varying vec4 vPosition;
varying vec4 center;

uniform vec3 uAmbientLightColor;
uniform vec3 uLightPosition;
uniform sampler2D uSampler2D;
uniform float uWireframe;
uniform float uWireframeWidth;
uniform vec2 uResolution;

void main(void) {

    // convert to homogenous coordinates
    vec2 vCenter = uResolution.xy * (1.0 + center.xy / center.w) / 2.0;
    vec4 texColor = vec4(1.0, 1.0, 1.0, 0.5); //texture2D(uSampler2D, vec2(vTexCoord.s, vTexCoord.t));

    float radius = 100.0;
    vec2 dist = vCenter - gl_FragCoord.xy;
    float len = length(dist);
    float w = 1.0 / pow(len, .5);
   
    gl_FragColor = texColor;
}
