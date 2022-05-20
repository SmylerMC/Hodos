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

  #surfaceVertexCount;
  #surfaceVertexPositions;
  #surfaceVertexDebugColors;
  #biomeIds;

  /**
   * Constructs a new tile object. This is called from the generator side.
   *
   * @param z     {int}         tile zoom level
   * @param x     {int}         tile X coordinate
   * @param y     {int}         tile Y coordinate
   * @param cells {Array[Cell]} list of voronoi cells that overlap with the tile
   */
  constructor(z, x, y, cells) {
    super();
    this.#z = z;
    this.#x = x;
    this.#y = y;
    this.#cells = cells;
  }

  bake(gl) {
    this.#surfaceVertexPositions = gl.createBuffer();
    this.#surfaceVertexDebugColors = gl.createBuffer();
    this.#biomeIds = gl.createBuffer();
    let coordinates = [];
    let dbgColors = [];
    let biomeIds = [];
    this.#cells.forEach(cell => {
      let polygonVertices = cell.ring;
      let vertexCount = polygonVertices.length;
      for (let i = 1; i <= vertexCount; i++) {
        let vertex1 = polygonVertices[i - 1];
        let vertex2 = polygonVertices[i % vertexCount];
        let vertex3 = cell.center;
        coordinates.push(...vertex1.coordinates);
        coordinates.push(...vertex2.coordinates);
        coordinates.push(...vertex3.coordinates);
        for (let j = 0; j < 3; j++) dbgColors.push(...cell.debugColor.components);
        for (let j = 0; j < 3; j++) biomeIds.push(cell.biome.id);
      }
    });
    this.#surfaceVertexCount = coordinates.length / 3;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#surfaceVertexPositions);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordinates), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#surfaceVertexDebugColors);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dbgColors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.#biomeIds);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(biomeIds), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  render(shaderProgram) {
    if (shaderProgram instanceof WorldShaderProgram) {
      let gl = shaderProgram.gl;
      shaderProgram.bindSurfaceVertexPositionBuffer(this.#surfaceVertexPositions);
      shaderProgram.bindDebugSurfaceColorsBuffer(this.#surfaceVertexDebugColors)
      shaderProgram.bindBiomeIdBuffer(this.#biomeIds)
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
    gl.destroy(this.#surfaceVertexDebugColors);
    gl.destroy(this.#biomeIds);
  }

}