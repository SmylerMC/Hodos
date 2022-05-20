class MapRenderer {

  #activeWorldShaderProgram;
  #defaultWorldShaderProgram;
  #biomeWorldShaderProgram;
  #debugWorldShaderProgram;
  #div;
  #canvas;
  #debugSpan;
  #gl;
  #lastFrameStartTime;
  #lastFramesTimes = [];
  #camera;

  #biomeTexture;
  #maxBiomeId;

  #generator;

  constructor(div, generator) {
    this.#div = div;
    this.#div.classList.add("hodos-map");
    this.#canvas = document.createElement("canvas");
    this.#canvas.classList.add("hodos-canvas");
    div.appendChild(this.#canvas);
    this.#debugSpan = document.createElement("span");
    this.#debugSpan.classList.add("hodos-debug");
    this.#debugSpan.style.visibility = "hidden";
    div.appendChild(this.#debugSpan);
    this.#gl = this.#canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true});
    this.#generator = generator;
    this.#camera = new Camera(this);
  }

  resize(width, height) {
    this.#canvas.width = width;
    this.#canvas.height = height;
    this.#gl.viewport(0, 0, this.#canvas.width, this.#canvas.height);
    this.camera.scaleX = TILE_PIXEL_SIZE / WORLD_SIZE / (width / 2);
    this.camera.scaleY = TILE_PIXEL_SIZE / WORLD_SIZE / (height / 2);
    this.camera.updateGl();
  }

  async load() {
    await Promise.all([
      await this.#loadShaders(),
      this.#loadData()
    ]);
  }

  /**
   * Renders a frame, and schedules rendering for the next frame.
   *
   * @param timestamp when was the method calledColorize terrain according to first biome colors
   */
  render(timestamp) {
    let start = new Date().getTime();
    this.#gl.clearColor(0.278, 0.460, 0.525, 1);
    this.#gl.clear(this.#gl.COLOR_BUFFER_BIT | this.#gl.DEPTH_BUFFER_BIT);
    this.tileTest.render(this.#activeWorldShaderProgram);
    let end = new Date().getTime();
    let frameTime = end - start;
    if (this.#lastFrameStartTime) {
      this.#lastFramesTimes.push(start - this.#lastFrameStartTime);
      if (this.#lastFramesTimes.length > 100) this.#lastFramesTimes.shift();
      this.#debugSpan.innerText =
        "FPS: " + this.fps +
        " | Frame time: " + frameTime + "ms" +
        " | Zoom: " + this.camera.zoom +
        " | PosX: " + this.camera.posX +
        " | PosY: " + this.camera.posY;
    }
    this.#lastFrameStartTime = start;
    window.requestAnimationFrame(t => this.render(t));
  }

  async #loadShaders() {
    this.#defaultWorldShaderProgram = new WorldShaderProgram(this.#gl, "glsl/world_default.vert", "glsl/world_default.frag");
    this.#biomeWorldShaderProgram = new BiomesWorldShaderProgram(this.#gl, "glsl/world_biomes.vert", "glsl/world_biomes.frag");
    this.#debugWorldShaderProgram = new DebugWorldShaderProgram(this.#gl, "glsl/world_debug.vert", "glsl/world_debug.frag");
    this.#activeWorldShaderProgram = this.#defaultWorldShaderProgram;
    await Promise.all(
        [
            this.#defaultWorldShaderProgram.load(),
            this.#biomeWorldShaderProgram.load(),
            this.#debugWorldShaderProgram.load()]).then(() => {
      console.log("Loaded shader programs");
    }, () => console.log("Failed to load shaders"));
    this.#activeWorldShaderProgram.use();
  }

  async #loadData() {
    this.tileTest = this.#generator.generateTile(0, 0, 0);
    this.tileTest.bake(this.#gl);

    // Biome texture
    let biomes = Object.values(BIOMES);
    this.#maxBiomeId = Math.max(...biomes.map(b => b.id));
    let colorArray = new Array(this.#maxBiomeId);
    biomes.forEach(biome => {
      colorArray[6 * biome.id] = biome.lowColor.red * 0xFF;
      colorArray[6 * biome.id + 1] = biome.lowColor.green * 0xFF;
      colorArray[6 * biome.id + 2] = biome.lowColor.blue * 0xFF;
      colorArray[6 * biome.id + 3] = biome.highColor.red * 0xFF;
      colorArray[6 * biome.id + 4] = biome.highColor.green * 0xFF;
      colorArray[6 * biome.id + 5] = biome.highColor.blue * 0xFF;
    });
    this.#biomeTexture = this.#gl.createTexture();
    this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.#biomeTexture);
    this.#gl.texImage2D(this.#gl.TEXTURE_2D, 0, this.#gl.RGB,
        Math.ceil(colorArray.length / 3), 1, 0,
        this.#gl.RGB, this.#gl.UNSIGNED_BYTE, new Uint8Array(colorArray));
    this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MAG_FILTER, this.#gl.NEAREST);
    this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MIN_FILTER, this.#gl.NEAREST);
    this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_S, this.#gl.CLAMP_TO_EDGE);
    this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_T, this.#gl.CLAMP_TO_EDGE);
    this.#gl.bindTexture(this.#gl.TEXTURE_2D, null);
    this.#setBiomes();
  }

  #setBiomes() {
    this.#activeWorldShaderProgram.setBiomesColors(this.#biomeTexture, this.#maxBiomeId);
  }

  #changeShaderProgram(newShaders) {
    this.#activeWorldShaderProgram.stopUsing();
    newShaders.use();
    this.#activeWorldShaderProgram = newShaders;
    this.camera.updateGl();
    this.#setBiomes();
  }

  setRenderingMode(mode) {
    let newProgram = null;
    let debug = false;
    switch (mode) {
      case "default":
        newProgram = this.#defaultWorldShaderProgram;
        break;
      case "debug":
        newProgram = this.#debugWorldShaderProgram;
        debug = true;
        break;
      case "biomes":
        newProgram = this.#biomeWorldShaderProgram;
        break;
      default:
        console.log('Tying to use an unknown rendering mode, will fallback to default');
        newProgram = this.#defaultWorldShaderProgram;
    }
    if (debug) {
      this.#debugSpan.style.visibility = "visible";
    } else {
      this.#debugSpan.style.visibility = "hidden";
    }
    if (newProgram !== this.#activeWorldShaderProgram) {
      this.#changeShaderProgram(newProgram);
    }
  }

  get fps() {
    return Math.round(this.#lastFramesTimes.length  / this.#lastFramesTimes.reduce((sum, val) => sum + val) * 1000);
  }

  get camera() {
    return this.#camera;
  }

  get worldShaderProgram() {
    return this.#activeWorldShaderProgram;
  }

  get canvas(){
    return this.#canvas;
  }

}

class Camera {

  #renderer;

  scaleX = 1;
  scaleY = 1;
  posX = 0;
  posY = 0;
  zoom = 0;

  constructor(renderer) {
    this.#renderer = renderer;
  }

  /**
   * Updates the WebGL context so the values in this camera are used for rendering.
   */
  updateGl() {
    let zoomFactor = Math.pow(2, this.zoom);
    let scaleX = this.scaleX * zoomFactor;
    let scaleY = this.scaleY * zoomFactor;
    let deltaX = - (this.posX + WORLD_SIZE / 2) * scaleX;
    let deltaY = - (this.posY + WORLD_SIZE / 2) * scaleY;
    let matrix = new Float32Array(
        [scaleX, 0,      0, 0,
          0,      scaleY, 0, 0,
          0,      0,      0, 0,
          deltaX, deltaY, 0, 1]);
    this.#renderer.worldShaderProgram.setViewMatrix(matrix);
  }

}