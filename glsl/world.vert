precision mediump float;

attribute vec3 coordinates;
attribute float biome_id;

uniform mat4 view;

varying vec4 position;
varying float b_id;

void main(void) {
    b_id = biome_id;
    position = vec4(coordinates, 1);
    gl_Position = view * position;
}
