precision mediump float;

attribute vec3 coordinates;

varying vec3 position;

void main(void) {
	gl_Position = vec4(coordinates, 1.0);
	position = coordinates;
}
