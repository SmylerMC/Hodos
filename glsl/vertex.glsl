precision mediump float;

attribute vec3 coordinates;

varying vec4 position;

void main(void) {
	position = vec4(coordinates, 1);
	mat4 transform = mat4(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, -1, -1, 0, 1);
	gl_Position = transform * position;
}
