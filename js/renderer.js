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

  #generator;

  constructor(div, generator) {
    this.#div = div;
    this.#div.classList.add("hodos-map");
    this.#canvas = document.createElement("canvas");
    this.#canvas.classList.add("hodos-canvas");
    div.appendChild(this.#canvas);
    this.#debugSpan = document.createElement("span");
    this.#debugSpan.classList.add("hodos-debug");
    div.appendChild(this.#debugSpan);
    this.#gl = this.#canvas.getContext("experimental-webgl");
    this.#generator = generator;
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
    this.#activeWorldShaderProgram = this.#debugWorldShaderProgram;
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

  get fps() {
    return Math.round(this.#lastFramesTimes.length  / this.#lastFramesTimes.reduce((sum, val) => sum + val) * 1000);
  }

  get camera() {
    return this.#activeWorldShaderProgram.camera;
  }

}
