precision mediump float;

attribute vec3 coordinates;

uniform mat4 view;

varying vec4 position;

void main(void) {
    position = vec4(coordinates, 1);
    gl_Position = view * position;
}
