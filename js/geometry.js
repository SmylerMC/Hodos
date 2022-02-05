class Triangle {

	#gl;
	#glVertexBuffer;

	constructor(gl, ...vertices) {
		this.gl = gl;
		this.glVertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.glVertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

	get vbo() {
		return this.glVertexBuffer;
	}

	get verticesStart() {
		return 0
	}

	get verticesEnd() {
		return 3;
	}

}
