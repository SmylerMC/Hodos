/**
 * A WebGL shader
 */
class Shader {

	/**
	 * The WebGL shader type
	 */
	#type;

	/**
	 * The WebGL shader object
	 */
	#glShader; // The WebGL shader pointer
	
	/**
	 * The URL to load the source of the shader from
	 */
	#srcUrl;

	/**
	 * The source code of the shader once it has been loaded
	 */
	#glsl;

	/**
	 * The context's GL object
	 */
	#gl;
	
	constructor(gl, url, type) {
		this.#gl = gl;
		this.#srcUrl = url;
		this.#type = type;
	}

	/**
	 * Loads the shader's source code from its URL
	 */
	async load() {
		console.log("Loading shader: " + this.url)
		let response = await fetch(this.url);
		this.#glsl = await response.text();
		this.compile();
	}

	/**
	 * Compiles this shader.
	 * The source code must have been loaded first
	 */
	compile() {
		console.log("Compiling shader: " + this.url);
		this.#glShader = this.#gl.createShader(this.#type);
		this.#gl.shaderSource(this.#glShader, this.#glsl);
		this.#gl.compileShader(this.#glShader);
		console.log("Loaded shader: " + this.url);
	}

	get url() {
		return this.#srcUrl;
	}

	/**
	 * Links this shader to the given program
	 *
	 * @param glProgram	the WebGL shader program object
	 */
	linkTo(glProgram) {
		this.#gl.attachShader(glProgram, this.#glShader);
	}

}

class VertexShader extends Shader {

	constructor(gl, url) {
		super(gl, url, gl.VERTEX_SHADER);
	}

}

class FragmentShader extends Shader {

	constructor(gl, url) {
		super(gl, url, gl.FRAGMENT_SHADER);
	}

}

class ShaderProgram {
	
	#gl;
	#shaders;
	#glProgram;
	#glCoordsAttrib;
	#camera;

	constructor(gl, shaders) {
		this.#gl = gl;
		this.#shaders = shaders;
	}

	link() {
		this.#glProgram = this.#gl.createProgram();
		this.#shaders.forEach(shader => shader.linkTo(this.#glProgram));
		this.#gl.linkProgram(this.#glProgram);
		this.#glCoordsAttrib = this.#gl.getAttribLocation(this.#glProgram, "coordinates");
	}

	use() {
		this.#gl.useProgram(this.#glProgram);
		this.#camera = new Camera(this.#gl, this.#gl.getUniformLocation(this.#glProgram, "view"));
	}

	draw(geometry) {
		this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, geometry.vbo);
		this.#gl.vertexAttribPointer(
			this.#glCoordsAttrib,
			3, this.#gl.FLOAT,
			false, 0, 0);
		this.#gl.enableVertexAttribArray(this.#glCoordsAttrib);
	
		this.#gl.drawArrays(
			this.#gl.TRIANGLES,
			geometry.verticesStart,
			geometry.verticesEnd);
	}

	get camera() {
		return this.#camera;
	}

}

class Camera {

	#gl;
	#matrixLocation;

	scaleX = 1;
	scaleY = 1;

	constructor(gl, matrixLocation) {
		this.#gl = gl;
		this.#matrixLocation = matrixLocation;
	}

	updateGl() {
		let matrix = new Float32Array(
			[this.scaleX, 0, 0, 0,
			 0, this.scaleY, 0, 0,
			 0, 0, 1, 0,
			 -1, -1, 0, 1]);
		this.#gl.uniformMatrix4fv(this.#matrixLocation, false, matrix);
	}
}
