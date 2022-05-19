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
