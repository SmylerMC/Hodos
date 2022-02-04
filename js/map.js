class WorldMap {

	constructor(canvas) {
		this.canvas = canvas;
		this.gl = canvas.getContext("experimental-webgl");
	}

	resize(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
	}

	load(whenReady) {
		let testShader = new VertexShader(this.gl, "glsl/vertex.glsl");
		testShader.load(whenReady);
	}

}
