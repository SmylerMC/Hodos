class MapRenderer {

  #activeWorldShaderProgram;
  #worldShaderProgram;
  #debugWorldShaderProgram;
  #div;
  #canvas;
  #debugSpan;
  #gl;
  #lastFrameStartTime;
  #lastFramesTimes = [];
  #camera;

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
    this.#gl = this.#canvas.getContext("experimental-webgl");
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
   * @param timestamp when was the method called
   */
  render(timestamp) {
    let start = new Date().getTime();
    this.#gl.clearColor(0, 0.5, 0.8, 1);
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
    this.#worldShaderProgram = new WorldShaderProgram(this.#gl, "glsl/world.vert", "glsl/world.frag");
    this.#debugWorldShaderProgram = new DebugWorldShaderProgram(this.#gl, "glsl/world_debug.vert", "glsl/world_debug.frag");
    this.#activeWorldShaderProgram = this.#worldShaderProgram;
    await Promise.all(
        [this.#worldShaderProgram.load(),
        this.#debugWorldShaderProgram.load()]).then(() => {
      console.log("Loaded shader programs");
    }, () => console.log("Failed to load shaders"));
    this.#activeWorldShaderProgram.use();
  }

  async #loadData() {
    this.tileTest = this.#generator.generateTile(0, 0, 0);
    this.tileTest.bake(this.#gl);
  }

  #changeShaderProgram(newShaders) {
    this.#activeWorldShaderProgram.stopUsing();
    newShaders.use();
    this.#activeWorldShaderProgram = newShaders;
    this.camera.updateGl();
  }

  get debug() {
    return this.#activeWorldShaderProgram !== this.#worldShaderProgram;
  }

  set debug(value) {
    if (value && !this.debug) {
      this.#changeShaderProgram(this.#debugWorldShaderProgram);
      this.#debugSpan.style.visibility = "visible";
    } else if (!value && this.debug) {
      this.#changeShaderProgram(this.#worldShaderProgram);
      this.#debugSpan.style.visibility = "hidden";
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