class Shader {

	#type;
	#glShader; // The WebGL shader pointer
	#srcUrl;
	gl;
	
	constructor(gl, url, type) {
		this.gl = gl;
		this.srcUrl = url;
		this.type = type;
	}

	async load() {
		console.log("Loading shader: " + this.url)
		let response = await fetch(this.url);
		this.glsl = await response.text();
		this.compile();
	}

	compile() {
		console.log("Compiling shader: " + this.url);
		this.glShader = this.gl.createShader(this.type);
		this.gl.shaderSource(this.glShader, this.glsl);
		this.gl.compileShader(this.glShader);
		console.log("Loaded shader: " + this.url);
	}

	get url() {
		return this.srcUrl;
	}

	linkTo(glProgram) {
		this.gl.attachShader(glProgram, this.glShader);
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

	constructor(gl, shaders) {
		this.gl = gl;
		this.shaders = shaders;
	}

	link() {
		this.glProgram = this.gl.createProgram();
		this.shaders.forEach(shader => shader.linkTo(this.glProgram));
		this.gl.linkProgram(this.glProgram);
		this.glCoordsAttrib = this.gl.getAttribLocation(this.glProgram, "coordinates");
	}

	use() {
		this.gl.useProgram(this.glProgram);
	}

	draw(geometry) {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, geometry.vbo);
		this.gl.vertexAttribPointer(
			this.glCoordsAttrib,
			3, this.gl.FLOAT,
			false, 0, 0);
		this.gl.enableVertexAttribArray(this.glCoordsAttrib);
		this.gl.drawArrays(
			this.gl.TRIANGLE_STRIP,
			geometry.verticesStart,
			geometry.verticesEnd);
	}

}
