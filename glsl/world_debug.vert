precision mediump float;

attribute vec3 coordinates;
attribute vec3 dbg_colors;

uniform mat4 view;

varying vec4 position;
varying vec3 dbg_color;

void main(void) {
    position = vec4(coordinates, 1);
    dbg_color = dbg_colors;
    gl_Position = view * position;
}
