class WorldMap {

	#shaderProgram;
	#div;
	#canvas;
	#debugSpan;
	#gl;
	#lastFrameStartTime;
	#lastFramesTimes = [];
	#controller;

	constructor(div) {
		this.#div = div;
		this.#div.classList.add("hodos-map");
		this.#canvas = document.createElement("canvas");
		this.#canvas.classList.add("hodos-canvas");
		div.appendChild(this.#canvas);
		this.#debugSpan = document.createElement("span");
		this.#debugSpan.classList.add("hodos-debug");
		div.appendChild(this.#debugSpan);
		this.#gl = this.#canvas.getContext("experimental-webgl");
		this.#controller = new MapController(this);
	}

	resize(width, height) {
		this.#canvas.width = width;
		this.#canvas.height = height;
		this.#gl.viewport(0, 0, this.#canvas.width, this.#canvas.height);
		this.camera.scaleX = SCALE / width;
		this.camera.scaleY = SCALE / height;
		this.camera.updateGl();
	}

	async load() {
		await Promise.all([
			await this.#loadShaders(),
			this.#loadData()
		]);
	}

	startRender() {
		window.requestAnimationFrame(t => this.#render(t));
	}

	#render(timestamp) {
		let start = new Date().getTime();
		this.#gl.clearColor(0, 0.5, 0.8, 1);
		this.#gl.clear(this.#gl.COLOR_BUFFER_BIT | this.#gl.DEPTH_BUFFER_BIT);
		this.shaders.draw(this.tileTest);
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
		window.requestAnimationFrame(t => this.#render(t));
	}

	async #loadShaders() {
		let vShader = new VertexShader(this.#gl, "glsl/vertex.glsl");
		let fShader = new FragmentShader(this.#gl, "glsl/fragment.glsl");
		await Promise.all([
			await vShader.load(),
			await fShader.load()
		]).then(() => {
			let program = new ShaderProgram(this.#gl, [vShader, fShader]);
			program.link();
			program.use();
			this.#shaderProgram = program;
		}, () => console.log("Failed to load shaders"));
	}

	async #loadData() {
		this.tileTest = new BackedTile(this.#gl);
		this.controller.setupCallback();
	}

	get shaders() {
		return this.#shaderProgram;
	}

	get fps() {
		return Math.round(this.#lastFramesTimes.length  / this.#lastFramesTimes.reduce((sum, val) => sum + val) * 1000);
	}

	get camera() {
		return this.#shaderProgram.camera;
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
