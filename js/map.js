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
	}

	load(whenReady) {
		this.whenReady = whenReady;
		this.#loadShaders();
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

}
