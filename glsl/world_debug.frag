precision mediump float;

varying vec4 position;
varying vec3 dbg_color;

void main(void) {
    gl_FragColor = vec4(dbg_color, 1);
}
