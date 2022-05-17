/**
 * The size of a rendered map tile, in pixels on the screen.
 */
const TILE_PIXEL_SIZE = 256;

/**
 * The maximum world coordinates in the 0/0/0 tile.
 */
const WORLD_SIZE = 10_000;

class WorldMap {
  #generator;
  #renderer;
  #controller;

  constructor(div, seed) {
    this.#generator = new MapGenerator(seed);
    this.#renderer = new MapRenderer(div, this.#generator);
    this.#controller = new MapController(this);
  }

  resize(width, height) {
    this.#renderer.resize(width, height);
  }

  async load() {
    await this.#renderer.load();
    this.#renderer.setBiomes(BIOMES);
    this.#controller.setupCallback();
  }

  startRender() {
    window.requestAnimationFrame((t) => this.#renderer.render(t));
  }

  get camera() {
    return this.#renderer.camera;
  }

  get renderer() {
    return this.#renderer;
  }

  get generator() {
    return this.#generator;
  }

  get controller() {
    return this.#controller;
  }
}

class MapController {
  #map;

  constructor(map) {
    this.#map = map;
  }

  move(deltaX, deltaY) {
    this.#map.camera.posX += deltaX;
    this.#map.camera.posY += deltaY;
    this.#map.camera.updateGl();
  }

  zoom(deltaZoom) {
    this.#map.camera.zoom += deltaZoom;
    this.#map.camera.updateGl();
  }

  toggleDebug() {
    let renderer = this.#map.renderer;
    renderer.debug = !renderer.debug;
  }

  onKeyPress(keyEvent) {
    let zoom = this.#map.camera.zoom;
    let delta = (10 / (TILE_PIXEL_SIZE * Math.pow(2, zoom))) * WORLD_SIZE;
    let code = keyEvent.keyCode;
    if (code === 37) {
      this.move(-delta, 0);
    }
    if (code === 40) {
      this.move(0, -delta);
    }
    if (code === 39) {
      this.move(delta, 0);
    }
    if (code === 38) {
      this.move(0, delta);
    }
    if (code === 107) {
      this.zoom(1);
    }
    if (code === 109) {
      this.zoom(-1);
    }
  }

  setupCallback() {
    window.onkeydown = (e) => {
      this.onKeyPress(e);
    };
  }
}
