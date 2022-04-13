class WorldMap {

	#generator;
	#renderer;
	#controller;

	constructor(div) {
		/*Rajouter MapGenerator*/ 
		this.#renderer = new MapRenderer(div);
		this.#controller = new MapController(this);
	}

	resize(width, height) {
		this.#renderer.resize(width,height);
	}

	async load() {
		this.#renderer.load();
	}

	startRender() {
		window.requestAnimationFrame(t => this.#renderer.render(t));
	}

	get camera() {
		return this.#renderer.camera;
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

	onKeyPress(keyEvent) {
		let code = keyEvent.keyCode;
		console.log(code);
		if (code === 37) {
			this.move(-10 / SCALE, 0);
		}
		if (code === 40) {
			this.move(0, -10 / SCALE);
		}
		if (code === 39) {
			this.move(10 / SCALE, 0);
		}
		if (code === 38) {
			this.move(0, 10 / SCALE);
		}
		if (code === 107) {
			this.zoom(1);
		}
		if (code === 109) {
			this.zoom(-1);
		}
	}

	setupCallback() {
		window.onkeydown = e => {
			this.onKeyPress(e);
		}
	}

}
