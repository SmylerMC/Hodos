const { test } = QUnit;

/**
 * utils.js
 */
QUnit.module("Utils");

//getRandomInRange
test("getRandomInRange", (assert) => {
  let n = 1000;
  for (let i = 0; i < n; i++) {
    let res = getRandomInRange(0, 1, Math.random);
    assert.true(0 < res && res < 1, "Correct range");
  }
});

test("getRandomPointsIn2dRange", (assert) => {
  let n = 1000;
  let lowerBound = 0;
  let higherBound = 1000;
  let arrayRes = getRandomPointsIn2dRange(
    n,
    lowerBound,
    higherBound,
    Math.random
  );

  arrayRes.forEach((coord) => {
    assert.true(
      lowerBound < coord[0] && coord[0] < higherBound,
      "Correct range for x value"
    );
    assert.true(
      lowerBound < coord[1] && coord[1] < higherBound,
      "Correct range for y value"
    );
  });
});

test("taxiDistance", (assert) => {
  assert.true(taxiDistance(0, 0, 5, 6) == 6, "Correct distance");
  assert.true(taxiDistance(-2, 6, 5, 6) == 7, "Correct distance");
});

/**
 * geometry.js
 */

//Point
test("Point constructor", (assert) => {
  let Xcoord = 404;
  let Ycoord = 42;
  let Zcoord = 418;
  let testPoint = new Point(404, 42, 418);
  assert.true(testPoint.x == Xcoord, "Correct X assignation");
  assert.true(testPoint.y == Ycoord, "Correct Y assignation");
  assert.true(testPoint.z == Zcoord, "Correct Z assignation");
});

test("Point x assignation", (assert) => {
  let newVal = 404;
  let testPoint = new Point(0, 0, 0);
  testPoint.x = newVal;
  assert.true(testPoint.x == newVal, "Correct X modification");
});

test("Point y assignation", (assert) => {
  let newVal = 404;
  let testPoint = new Point(0, 0, 0);
  testPoint.y = newVal;
  assert.true(testPoint.y == newVal, "Correct Y modification");
});

test("Point z assignation", (assert) => {
  let newVal = 404;
  let testPoint = new Point(0, 0, 0);
  testPoint.z = newVal;
  assert.true(testPoint.z == newVal, "Correct Z modification");
});

test("Point coordinate", (assert) => {
  let testPoint = new Point(42, -43, 76);
  let coord = testPoint.coordinates;
  assert.true(coord[0] == 42, "Correct X in coord");
  assert.true(coord[1] == -43, "Correct Y in coord");
  assert.true(coord[2] == 76, "Correct Z in coord");
});

//Cell
test("Cell constructor", (assert) => {
  let testCell = new Cell(404, 42, 418);
  assert.true(testCell.center.x == 404, "Correct X assignation");
  assert.true(testCell.center.y == 42, "Correct Y assignation");
  assert.true(testCell.center.z == 418, "Correct Z assignation");
  assert.true(testCell.ring.length == 0, "Correct ring assignation");
  assert.true(testCell.biome == BIOMES["ocean"], "Correct Biome assignation");
});

test("Cell addPolygonPoint", (assert) => {
  let testCell = new Cell(404, 42, 418);
  let point1 = new Point(1, 2, 3);
  let point2 = new Point(4, 5, 6);
  testCell.addPolygonPoint(point1);
  testCell.addPolygonPoint(point2);
  let ring = testCell.ring;
  assert.true(ring[0] == point1 && ring[1] == point2, "Correct Point add");
});

test("Cell removePolygonPoint", (assert) => {
  let testCell = new Cell(404, 42, 418);
  let point1 = new Point(1, 2, 3);
  let point2 = new Point(4, 5, 6);
  testCell.addPolygonPoint(point1);
  testCell.addPolygonPoint(point2);
  let removingPoint = testCell.removePolygonPoint();
  let ring = testCell.ring;
  assert.true(ring[0] == point1, "Correct ring");
  assert.true(removingPoint == point2, "Correct point remove");
});

test("Cell setEarth", (assert) => {
  let testCell = new Cell(404, 42, 418);
  testCell.setEarth();
  assert.true(testCell.center.z == 0.1, "Correct Z assignation");
  assert.true(
    testCell.biome == BIOMES["continent"],
    "Correct Biome assignation"
  );
});