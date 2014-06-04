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

    if(uWireframe > 0.0 && any(lessThan(aBar, vec3(uWireframeWidth)))){
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    else {
        vec4 texColor = texture2D(uSampler2D, vec2(vTexCoord.s, vTexCoord.t)); 
        
        vec3 lightDirection = normalize(uLightPosition.xyz - vPosition.xyz);
        vec3 normal = normalize(vNormal);
        
        float directionalLightWeight = max(dot(normal, lightDirection), 0.0);
        float specularLightWeight = pow(directionalLightWeight, 64.0);
        vec3 directionalLightColor = vec3(1.0, 1.0, 1.0);
                
        vec3 lightWeighting = uAmbientLightColor + (directionalLightWeight + specularLightWeight) * directionalLightColor;
                
        gl_FragColor = vec4(texColor.rgb * lightWeighting, texColor.a);
    }
}