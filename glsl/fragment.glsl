precision mediump float;

varying vec3 position;

void main(void) {
    gl_FragColor = vec4(position.z, 1.0, 0.0, 1.0);
}
