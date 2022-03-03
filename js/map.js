class WorldMap {

	#whenReady;
	#shaderProgram;
	#canvas;
	#gl;

	constructor(canvas) {
		this.canvas = canvas;
		this.gl = canvas.getContext("experimental-webgl");
	}

	resize(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	}

	async load() {
		await Promise.all([
			await this.#loadShaders(),
			this.#loadData()
		]);
	}

	startRender() {
		setInterval(() => this.#render(), 1000/10);
	}

	#render() {
		this.gl.clearColor(.5, 0, 0, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.shaders.draw(this.testTriangle1);
		this.shaders.draw(this.testTriangle2);
	}

	async #loadShaders() {
		let vShader = new VertexShader(this.gl, "glsl/vertex.glsl");
		let fShader = new FragmentShader(this.gl, "glsl/fragment.glsl");
		await Promise.all([
			await vShader.load(),
			await fShader.load()
		]).then(() => {
			let program = new ShaderProgram(this.gl, [vShader, fShader]);
			program.link();
			program.use();
			this.shaderProgram = program;
		}, () => console.log("Failed to load shaders"));
	}

	async #loadData() {
		this.testTriangle1 = new Triangle(this.gl,
			0, 0, 0,
			0, 1, 0,
			1, 1, 0
		);
		this.testTriangle2 = new Triangle(this.gl,
			0, 0, 0,
			0, -1, 0,
			-1, -1, 0
		);
	}

	get shaders() {
		return this.shaderProgram;
	}

}
