#extension GL_EXT_frag_depth : enable

precision mediump float;

uniform float uRadius;
uniform vec2 uResolution;
uniform vec3 uSunCenter;
uniform mat4 uModelViewTransformation;
uniform float uFocalLength;

float rayIntersectsSphere(vec3 ray, vec3 dir, vec3 center, float radius)
{
	vec3 rc = ray-center;
	float c = dot(rc, rc) - (radius*radius);
	float b = dot(dir, rc);
	float d = b*b - c;
	float t = -b - sqrt(abs(d));
	if (d < 0.0 || t < 0.0) {
		return -1.; // Didn't hit, or wasn't the closest hit.
	} else {
		return t;
	}
}

void main(void)
{
	// convert screen coords to 0..1
	vec2 uv = gl_FragCoord.xy / uResolution.xy;
	
	// moves origin to center of screen
	uv = 2.0 * uv - 1.;	
    
	// get square pixles
	uv.x *= uResolution.x/uResolution.y;
    
	float sphereRadius = uRadius;
	
    // transform sphere center from view model matrix
    vec3 sphereCenter = (uModelViewTransformation * vec4(uSunCenter.xyz, 1.)).xyz;
	
    // ray origin
	vec3 rayOrigin = vec3(0., 0., 0.);
    	
    vec3 rayDirection = vec3(uv.xy, -uFocalLength);    
    rayDirection = normalize(rayDirection);    
    
	// gets distance to sphere
	float distanceToSphere = rayIntersectsSphere(rayOrigin, rayDirection, sphereCenter, sphereRadius);
        
	// make value 0 if outside sphere	
	float smallestDistance = distance(rayOrigin, sphereCenter) - sphereRadius;
	float bigestDistance = sqrt(pow(smallestDistance + sphereRadius, 2.) + pow(sphereRadius, 2.));
	
	float fade = 0.;
	float fadeYellow = 0.;
	float fadeOrange = 0.;
	float fadeWhite = 0.;
    float alpha = 0.;

	if (distanceToSphere >= 0.9) {
		fade = (distanceToSphere - smallestDistance) / (bigestDistance - smallestDistance);
		fade = 1. - fade;
		fadeOrange = pow(fade, 8.);
		fadeYellow = pow(fade, 16.);
		fadeWhite = min(pow(fade, 128.), 0.3);
        
        alpha = fade;
	} else {
        discard;
    }

	vec3 yellow = vec3(1., 1., 0.);
	vec3 orange = vec3(1., 0.517, 0.392);

	gl_FragColor.rgb = 
		vec3(1., 1., 1.) * fadeWhite 
		+ orange * fadeOrange
		+ yellow * fadeYellow;
	gl_FragColor.a = alpha; // * max(length(gl_FragColor.rgb), 0.2);
    gl_FragDepthEXT = 0.5; // not available in webgl?
}