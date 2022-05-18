precision mediump float;

attribute vec3 coordinates;
attribute float biomeIdIn;

uniform mat4 view;

varying vec4 position;
varying float biomeId;

void main(void) {
    position = vec4(coordinates, 1);
    gl_Position = view * position;
}
