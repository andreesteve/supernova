precision mediump float;

uniform float uRadius;
uniform vec2 uResolution;
uniform vec3 uSunCenter;
uniform mat4 uModelViewTransformation;

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
    vec4 sphereCenter_v4 = uModelViewTransformation * vec4(uSunCenter.xyz, 1.);
    vec3 sphereCenter = sphereCenter_v4.xyz;
	
    // ray origin
	vec3 rayOrigin = vec3(0., 0., 1.20710678016);
    
	// screen position
	vec3 screenPosition = vec3(0., 0., 0.);
	
	// ray direction - ray will always go towards the sun
	vec3 rayDirection = normalize(screenPosition - rayOrigin + vec3(uv.xy, 0.));
	
	// gets distance to sphere
	float distanceToSphere = rayIntersectsSphere(rayOrigin, rayDirection, sphereCenter, sphereRadius);
		
	// make value 0 if outside sphere	
	float smallestDistance = distance(rayOrigin, sphereCenter) - sphereRadius;
	float bigestDistance = pow(pow(smallestDistance + sphereRadius, 2.) + pow(sphereRadius, 2.), 0.5);
	
	float fade = 0.;
	float fadeYellow = 0.;
	float fadeOrange = 0.;
	float fadeWhite = 0.;
    float alpha = 0.;
	if (distanceToSphere >= 0.) {
		fade = (distanceToSphere - smallestDistance) / (bigestDistance - smallestDistance);
		fade = 1. - fade;
		fadeOrange = pow(fade, 8.);
		fadeYellow = pow(fade, 16.);
		fadeWhite = min(pow(fade, 128.), 0.3);
        alpha = 1.;
	}
		
	vec3 yellow = vec3(1., 1., 0.);
	vec3 orange = vec3(1., 0.517, 0.392);
	
	gl_FragColor.rgb = 
		vec3(1., 1., 1.) * fadeWhite 
		+ orange * fadeOrange
		+ yellow * fadeYellow;
	gl_FragColor.a = alpha;
}