precision mediump float;

varying vec4 position;

void main(void) {
    float water = 1.0 - step(0.0, position.z);
    float beach = (1.0 - step(0.1, position.z)) * (1.0 - water);
    float plains = (1.0 - step(0.65, position.z)) * (1.0 - water) * (1.0 - beach);
    float mountains = (1.0 - step(0.8, position.z)) * (1.0 - water) * (1.0 - beach) * (1.0 - plains);
    float snow = 1.0 - water - beach - plains - mountains;
    vec4 plainsColor = vec4(0.0, 0.3 + position.z / 5.0, 0.0, 1.0);
    vec4 waterColor = vec4(0.0, 0.3, 0.9, 1.0);
    vec4 beachColor = vec4(0.8, 0.8, 0, 1.0);
    vec4 mountainsColor = vec4(0.4, 0.4, 0.4, 1.0);
    vec4 snowColor = vec4(0.7, 0.8, 1.0, 1.0);
    gl_FragColor =
        water * waterColor +
        beach * beachColor +
        plains * plainsColor +
        mountains * mountainsColor +
        snow * snowColor;
}
