precision mediump float;

uniform sampler2D biomes;
uniform float max_id;

varying vec4 position;
varying float b_id;

void main(void) {
    vec4 lowColor = texture2D(biomes, vec2((2.0 * b_id + 0.5) / (2.0 * max_id + 2.0), 0.5));
    vec4 highColor = texture2D(biomes, vec2((2.0 * b_id + 1.5) / (2.0 * max_id + 2.0), 0.5));
    vec4 color = mix(lowColor, highColor, position.z);
    gl_FragColor = color;
}