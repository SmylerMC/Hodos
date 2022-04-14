class Tile {

	#z;
	#x;
	#y;
	#cells;
	#paths;

	#gl;
	#vertices;
	#vertexCount;

	/**
	 * Constructs a new tile object. This is called from the generator side.
	 *
	 * @param z		tile zoom level
	 * @param x		tile X coordinate
	 * @param y		tile Y coordinate
	 * @param cells		list of voronoid cells that overlap with the tile
	 * @param path		list of path like objects (TODO)
	 */
	constructor(z, x, y, cells, paths) {
		this.#z = z;
		this.#x = x;
		this.#y = y;
		this.#cells = cells;
		this.#paths = paths;
	}

	/**
	 * Creates the WebGL objects needed to render this tile.
	 *
	 * @param gl	WebGL context
	 */
	bake(gl) {
		this.#gl = gl;
		this.#vertices = this.#gl.createBuffer();
		this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#vertices);
		let data = [];
		this.#cells.forEach(cell => {
			let polygonVertices = cell.getPolyCoord();
			let vertexCount = polygonVertices.length;
			for (let i = 1; i <= vertexCount; i++) {
				let vertex1 = polygonVertices[i - 1];
				let vertex2 = polygonVertices[i % vertexCount];
				let vertex3 = cell.getCoord();
				data.push(...vertex2);
				data.push(...vertex1);
				data.push(...vertex3);
			}

		});
		this.#vertexCount = data.length;
		this.#gl.bufferData(this.#gl.ARRAY_BUFFER, new Float32Array(data), this.#gl.STATIC_DRAW);
		this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, null);
	}

	#fillDataArray(arr) {
		// Ugly poorly written test done at 2AM
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
		return this.#vertices;
	}

	get verticesStart() {
		return 0;
	}

	get verticesEnd() {
		return this.#vertexCount / 3;
	}



}

/**
 * Only there for test purpose
 */
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
