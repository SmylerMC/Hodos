const { test } = QUnit;

QUnit.module('Group A');

test('basic test example', assert => {
  assert.true(true, 'this is fine');
});
test('basic test example 2', assert => {
  assert.true(true, 'this is also fine');
});

QUnit.module('Group B');

test('basic test example 3', assert => {
  assert.true(true, 'this is fine');
});
test('basic test example 4', assert => {
  assert.true(true, 'this is also fine');
});
