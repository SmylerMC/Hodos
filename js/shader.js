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

	load(whenReady) {
		console.log("Loading shader: " + this.url)
		let request = new XMLHttpRequest();
		request.onreadystatechange = () => {
			if (request.readyState == 4) {
				if (request.status % 100 > 3) {
					console.log("Failed to load shader " + this.url)
					return;
				}
				this.glsl = request.responseText;
				this.compile();
				whenReady();
			}
		}
		// Whithout this, some browsers fail to detect the mime type and try to parse the content as  XML.
		request.overrideMimeType("text/plain"); 
		request.open("GET", this.url, true);
		request.send(null);
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

	constructor(gl, shaders) {
		this.gl = gl;
		this.shaders = shaders;
	}

	link() {
		this.glProgram = this.gl.createProgram();
		this.shaders.forEach(shader => shader.linkTo(this.glProgram));
		this.gl.linkProgram(this.glProgram);
	}

	use() {
		this.gl.useProgram(this.glProgram);
	}

}
