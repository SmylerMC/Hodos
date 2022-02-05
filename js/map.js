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

	load(whenReady) {
		this.whenReady = whenReady;
		this.#loadShaders();
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

	startRender() {
		setInterval(() => this.#render(), 1000/10);
	}

	#render() {
		this.gl.clearColor(.5, 0, 0, 1);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		this.shaders.draw(this.testTriangle1);
		this.shaders.draw(this.testTriangle2);
	}

	#loadShaders() {
		let vShader = new VertexShader(this.gl, "glsl/vertex.glsl");
		let fShader = new FragmentShader(this.gl, "glsl/fragment.glsl");
		let shaders = [vShader, fShader];
		this.#loadAll(() => this.#loadShaderProgram(shaders), shaders);
	}

	#loadShaderProgram(shaders) {
		let program = new ShaderProgram(this.gl, shaders);
		program.link();
		program.use();
		this.shaderProgram = program;
		this.#checkLoaded();
	}

	#checkLoaded() {
		if (this.shaderProgram != null) this.whenReady();
	}

	/**
	 * Utility method to load all given resources async and
	 * call a method once ready.
	 */
	#loadAll(whenReady, loadables) {
		var i = loadables.length;
		let loaded = () => {
			if(--i <= 0) whenReady();
		}
		loadables.forEach(l => l.load(loaded));
	}
	
	get shaders() {
		return this.shaderProgram;
	}

}
