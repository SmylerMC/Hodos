/**
 * A WebGL shader
 */
class Shader {

  /**
   * The WebGL shader type
   */
  #type;

  /**
   * The WebGL shader object
   */
  #glShader; // The WebGL shader pointer
  
  /**
   * The URL to load the source of the shader from
   */
  #srcUrl;

  /**
   * The source code of the shader once it has been loaded
   */
  #glsl;

  /**
   * The context's GL object
   */
  #gl;
  
  constructor(gl, url, type) {
    this.#gl = gl;
    this.#srcUrl = url;
    this.#type = type;
  }

  /**
   * Loads the shader's source code from its URL
   */
  async load() {
    console.log("Loading shader: " + this.url)
    let response = await fetch(this.url);
    this.#glsl = await response.text();
    this.compile();
  }

  /**
   * Compiles this shader.
   * The source code must have been loaded first
   */
  compile() {
    console.log("Compiling shader: " + this.url);
    this.#glShader = this.#gl.createShader(this.#type);
    this.#gl.shaderSource(this.#glShader, this.#glsl);
    this.#gl.compileShader(this.#glShader);
    console.log("Loaded shader: " + this.url);
  }

  get url() {
    return this.#srcUrl;
  }

  /**
   * Links this shader to the given program
   *
   * @param glProgram  the WebGL shader program object
   */
  linkTo(glProgram) {
    this.#gl.attachShader(glProgram, this.#glShader);
  }

}

class VertexShader extends Shader {

  constructor(gl, url) {
    super(gl, url, gl.VERTEX_SHADER);
  }

}

class FragmentShader extends Shader {

  constructor(gl, url) {
    super(gl, url, gl.FRAGMENT_SHADER);
  }

}

/**
 * Shader programs are responsible for doing the actual rendering.
 * They have a vertex shader and a fragment shader,
 * and manage the various variables that control those shaders' behavior.
 */
class ShaderProgram {
  
  #gl;
  #vertexShader;
  #fragmentShader;
  #glProgram;

  constructor(gl, vertexShader, fragmentShader) {
    this.#gl = gl;
    this.#vertexShader = new VertexShader(gl, vertexShader);
    this.#fragmentShader = new FragmentShader(gl, fragmentShader);
  }

  async load() {
    await Promise.all([
      await this.#vertexShader.load(),
      await this.#fragmentShader.load()
    ]).then(() => {
      this.#link();
    });
  }

  #link() {
    this.#glProgram = this.#gl.createProgram();
    this.#vertexShader.linkTo(this.#glProgram);
    this.#fragmentShader.linkTo(this.#glProgram);
    this.#gl.linkProgram(this.#glProgram);
  }

  use() {
    this.#gl.useProgram(this.#glProgram);
  }

  /**
   * Disables everything which is specific to this shader program,
   * like attributes.
   */
  stopUsing () {
  }

  get gl() {
    return this.#gl;
  }

  get glProgram() {
    return this.#glProgram;
  }

}

/**
 * The world shader program is in charge of rendering the actual map.
 */
class WorldShaderProgram extends ShaderProgram {

  #glCoordsAttrib;

  use() {
    super.use();
    this.#glCoordsAttrib = this.gl.getAttribLocation(this.glProgram, "coordinates");
    this.gl.enableVertexAttribArray(this.#glCoordsAttrib);
  }

  bindSurfaceVertexPositionBuffer(buffer) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.vertexAttribPointer(
        this.#glCoordsAttrib,
        3, this.gl.FLOAT,
        false, 0, 0);
  }

  bindBiomeIdBuffer(buffer) {
    // This is a no-op here, but is used in case of the BiomesWorldShaderProgram
  }

  bindDebugSurfaceColorsBuffer(buffer) {
    // This is a no-op here, but is used in case of the DebugWorldShaderProgram
  }

  stopUsing() {
    this.gl.disableVertexAttribArray(this.#glCoordsAttrib);
  }

  setViewMatrix(matrix) {
    let pointer = this.gl.getUniformLocation(this.glProgram, "view");
    this.gl.uniformMatrix4fv(pointer, false, matrix);
  }

  /**
   * Sets the biome color sampling texture.
   *
   * @param biomeTexture  the gl texture handle
   * @param maxId         the maximum id stored in the texture
   */
  setBiomesColors(biomeTexture, maxId) {
    // This is a no-op here, but is used in case of the DebugWorldShaderProgram
  }

}

class DebugWorldShaderProgram extends WorldShaderProgram {

  #glColorsAttrib;

  use() {
    super.use();
    this.#glColorsAttrib = this.gl.getAttribLocation(this.glProgram, "dbg_colors");
    this.gl.enableVertexAttribArray(this.#glColorsAttrib);
  }

  bindDebugSurfaceColorsBuffer(buffer) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.vertexAttribPointer(
        this.#glColorsAttrib,
        3, this.gl.FLOAT,
        false, 0, 0);
  }

  stopUsing() {
    super.stopUsing();
    this.gl.disableVertexAttribArray(this.#glColorsAttrib);
  }

}


class BiomesWorldShaderProgram extends WorldShaderProgram {

  #glBiomeIdAttrib;

  use() {
    super.use();
    this.#glBiomeIdAttrib = this.gl.getAttribLocation(this.glProgram, "biome_id");
    this.gl.enableVertexAttribArray(this.#glBiomeIdAttrib);
  }

  bindBiomeIdBuffer(buffer) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.vertexAttribPointer(
        this.#glBiomeIdAttrib,
        1, this.gl.FLOAT,
        false, 0, 0);
  }

  /**
   * Sets the biome color sampling texture.
   *
   * @param biomeTexture  the gl texture handle
   * @param maxId         the maximum id stored in the texture
   */
  setBiomesColors(biomeTexture, maxId) {
    let textureUnit = 0;  // from 0 to 15 is ok
    let pointer = this.gl.getUniformLocation(this.glProgram, "biomes");
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, biomeTexture);
    this.gl.uniform1i(pointer, textureUnit);
    pointer = this.gl.getUniformLocation(this.glProgram, "max_id");
    this.gl.uniform1f(pointer, maxId);
  }

  stopUsing() {
    super.stopUsing();
    this.gl.disableVertexAttribArray(this.#glBiomeIdAttrib);
  }

}