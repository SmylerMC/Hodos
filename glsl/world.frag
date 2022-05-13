precision mediump float;

varying vec4 position;

void main(void) {
    float water = 1.0 - step(0.0, position.z);
    float beach = (1.0 - step(0.1, position.z)) * (1.0 - water);
    float plains = (1.0 - step(0.65, position.z)) * (1.0 - water) * (1.0 - beach);
    float mountains = (1.0 - step(0.8, position.z)) * (1.0 - water) * (1.0 - beach) * (1.0 - plains);
    float snow = 1.0 - water - beach - plains - mountains;
    vec4 plainsColor = vec4(0.529 - position.z / 5.0, 0.556 - position.z / 5.0, 0.364 - position.z / 5.0, 1.0);
    vec4 waterColor = vec4(0.278, 0.470, 0.525, 1.0);
    vec4 beachColor = vec4(0.760, 0.709, 0.501, 1.0);
    vec4 mountainsColor = vec4(0.556, 0.498, 0.364, 1.0);
    vec4 snowColor = vec4(0.705, 0.682, 0.635, 1.0);
    gl_FragColor =
        water * waterColor +
        beach * beachColor +
        plains * plainsColor +
        mountains * mountainsColor +
        snow * snowColor;
}
