class MapRenderer {

	#shaderProgram;
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

	render(timestamp) {
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
		window.requestAnimationFrame(t => this.render(t));
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
		this.tileTest = this.#generator.generateTile(0, 0, 0);
		this.tileTest.bake(this.#gl);
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

}

class PerlinTestGenerator {

	#generateTile(z, x, y) {
		// Ugly poorly written test done at 12AM
		noise.seed(Math.random());
		cells = []
		precision = 100;
		for (let i = 0; i < 100; i++) {
			let xl = i * 0.01;
			let xr = (i + 1) * 0.01;
			for (let j = 0; j < 100; j++) {
				let yt = j * 0.01;
				let yb = (j + 1) * 0.01;
				let ztl = noise.simplex2(xl * 2, yt * 2) + 0.05*noise.simplex2(xl * 20, yt * 20);
				let zbr = noise.simplex2(xr * 2, yb * 2) + 0.05*noise.simplex2(xr * 20, yb * 20);
				let zbl = noise.simplex2(xl * 2, yb * 2) + 0.05*noise.simplex2(xl * 20, yb * 20);
				let ztr = noise.simplex2(xr * 2, yt * 2) + 0.05*noise.simplex2(xr * 20, yt * 20);
				arr.push(...[xl, yt, ztl]);
				arr.push(...[xl, yb, zbl]);
				arr.push(...[xr, yt, ztr]);
				arr.push(...[xr, yt, ztr]);
				arr.push(...[xl, yb, zbl]);
				arr.push(...[xr, yb, zbr]);
                        }
                }
        

	}
}

class TestCell {

	constructor(x, y, z, polygon) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.polygon = polygon;
	}

}
