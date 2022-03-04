class BackedTile {

	#gl;
	#vertices;
	#vertexCount;

	constructor(gl) {
		this.gl = gl;
		this.vertices = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertices);
		let data = [];
		this.fillDataArray(data);
		this.vertexCount = data.length;
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	}

	fillDataArray(arr) {
		// Ugly poorly written test done at 12AM
		noise.seed(Math.random());
		for (let i = 0; i < 100; i++) {
			let xl = i * 0.01;
			let xr = (i + 1) * 0.01;
			for (let j = 0; j < 100; j++) {
				let yt = j * 0.01;
				let yb = (j + 1) * 0.01;
				/*
				let ztl = Math.sin(xl*Math.PI) * Math.sin(yt*Math.PI)
				let zbr = Math.sin(xr*Math.PI) * Math.sin(yb*Math.PI)
				let zbl = Math.sin(xl*Math.PI) * Math.sin(yb*Math.PI)
				let ztr = Math.sin(xr*Math.PI) * Math.sin(yt*Math.PI)
				*/
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

	get vbo() {
		return this.vertices;
	}

	get verticesStart() {
		return 0;
	}

	get verticesEnd() {
		return this.vertexCount / 3;
	}



}

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
