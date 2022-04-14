precision mediump float;

varying vec4 position;

void main(void) {
	float water = 1.0 - step(0.0, position.z);
	float beach = (1.0 - step(0.1, position.z)) * (1.0 - water);
	float land = 1.0 - water - beach;
	vec4 landColor = vec4(0.0, 0.3 + position.z / 5.0, 0.0, 1.0);
	vec4 waterColor = vec4(0.0, 0.3, 0.9, 1.0);
	vec4 beachColor = vec4(0.8, 0.8, 0, 1.0);
	gl_FragColor = water*waterColor + beach*beachColor + land*landColor;
}
