class WorldMap {
  canvas;
  gl;
  seed;
  delaunay;

  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext("2d");
    this.seed = generateSeed();
    this.delaunay = d3.Delaunay.from(fillWithPoints(1000, this));
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.render();
  }

  relax() {
    var polygons = this.delaunay.voronoi().cellPolygons,
      centroids = this.delaunay.voronoi().circumcenters,
      converged = points.every(function (point, i) {
        return distance(point, centroids[i]) < 1;
      });

    this.render();

    if (converged) {
      console.log("Lloyd done !");
    } else {
      setTimeout(function () {
        relax(centroids);
      }, 50);
    }
  }

  /* DEV METHODS / STATIC */

  /* Colorize the edges of the i triangle */
  color(i) {
    this.gl.beginPath();
    this.delaunay.renderTriangle(i, this.gl);
    this.gl.strokeStyle = "#b8625c";
    this.gl.stroke();
  }

  /* Colorize progressively the edges of the start to end triangles */
  static colorRange(a, start, end) {
    var i = start; //  set your counter to 1

    function myLoop(a) {
      //  create a loop function
      setTimeout(function () {
        //  call a 3s setTimeout when the loop is called
        a.color(i);
        i++; //  increment the counter
        if (i < end) {
          //  if the counter < 10, call the loop function
          myLoop(a); //  ..  again which will trigger another
        } //  ..  setTimeout()
      }, 100);
    }

    myLoop(a);
  }

  colorPoints() {
    this.gl.beginPath();
    this.delaunay.renderPoints(this.gl);
    this.gl.fillStyle = "red";
    this.gl.fill();
  }

  colorPolygonAndPoint(i) {
    this.gl.beginPath();
    this.delaunay
      .voronoi([0, 0, this.canvas.width, this.canvas.height])
      .renderCell(i, this.gl);
    this.gl.fillStyle = "green";
    this.gl.fill();

    this.gl.beginPath();
    this.gl.fillStyle = "red";
    this.gl.fillRect(
      this.delaunay.points[i * 2],
      this.delaunay.points[i * 2 + 1],
      2,
      2
    );
  }

  render() {
    //On regénère une triangulation de delaunay a partir de 1000 points random
    this.delaunay = d3.Delaunay.from(fillWithPoints(1000, this));

    //On vide le canvas
    this.gl.clearRect(0, 0, this.width, this.height);

    //Rendu des triangles de delaunay
    this.gl.beginPath();
    this.delaunay.render(this.gl);
    this.gl.strokeStyle = "#ccc";
    this.gl.stroke();

    //Rendu des cellules de voronoi
    this.gl.beginPath();
    this.delaunay
      .voronoi([0, 0, this.canvas.width, this.canvas.height])
      .render(this.gl);
    this.gl.strokeStyle = "black";
    this.gl.stroke();

    //Rendu des barycentres des voronoi
    this.gl.beginPath();
    this.delaunay.renderPoints(this.gl);
    this.gl.fillStyle = "black";
    this.gl.fill();
  }
}
