class WorldMap {

	constructor(canvas) {
		this.canvas = canvas;
		this.gl = canvas.getContext("experimental-webgl");
	}

	resize(width, height) {
		this.canvas.width = width;
		this.canvas.height = height;
	}

}
