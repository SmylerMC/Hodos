/**
 * A mesh is a collection of points that gets renders into the canvas.
 */
class Mesh {

  /**
   * Creates the WebGL objects needed to render this mesh.
   * This method needs to be implemented in a subclass.
   *
   * @param gl  {WebGLRenderingContext}
   */
  bake(gl) {
    console.log("Unimplemented Mesh bake method");
  }

  /**
   * Draws this tile using the given gl context and shader program.
   * This method needs to be implemented in a subclass.
   *
   * @param program {ShaderProgram}
   */
  render(program) {
    console.log("Unimplemented Mesh daw method");
  }

  /**
   * Frees all resources held by this mesh.
   */
  destroy(gl) {

  }

}

class Tile extends Mesh {

  #z;
  #x;
  #y;
  #cells;
  #paths;

  #surfaceVertexCount;
  #surfaceVertexPositions;

  /**
   * Constructs a new tile object. This is called from the generator side.
   *
   * @param z     {int}         tile zoom level
   * @param x     {int}         tile X coordinate
   * @param y     {int}         tile Y coordinate
   * @param cells {Array[Cell]} list of voronoi cells that overlap with the tile
   * @param paths {Array[Path]} list of path like objects (TODO)
   */
  constructor(z, x, y, cells, paths) {
    super();
    this.#z = z;
    this.#x = x;
    this.#y = y;
    this.#cells = cells;
    this.#paths = paths;
  }

  bake(gl) {
    this.#surfaceVertexPositions = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#surfaceVertexPositions);
    let data = [];
    this.#cells.forEach(cell => {
      let polygonVertices = cell.getPolyCoord();
      let vertexCount = polygonVertices.length;
      for (let i = 1; i <= vertexCount; i++) {
        let vertex1 = polygonVertices[i - 1];
        let vertex2 = polygonVertices[i % vertexCount];
        let vertex3 = cell.center.coordinates;
        data.push(...vertex1);
        data.push(...vertex2);
        data.push(...vertex3);
      }
    });
    this.#surfaceVertexCount = data.length / 3;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  render(shaderProgram) {
    if (shaderProgram instanceof WorldShaderProgram) {
      let gl = shaderProgram.gl;
      shaderProgram.bindSurfaceVertexPositionBuffer(this.#surfaceVertexPositions);
      gl.drawArrays(
          gl.TRIANGLES,
          0,
          this.#surfaceVertexCount);
    } else {
      console.log("Tile draw function expects the passed ShaderProgram to be a WorldShaderProgram");
    }
  }

  destroy(gl) {
    gl.deleteBuffer(this.#surfaceVertexPositions);
  }

}