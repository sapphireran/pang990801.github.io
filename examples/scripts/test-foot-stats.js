/**
 * Checks for the personal stats helpers and extracted JSON.
 * Run: node examples/scripts/test-foot-stats.js
 */
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const FootStats = require("../js/foot-stats.js");

const dataDir = path.resolve(__dirname, "../data");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
}

function almostEqual(actual, expected, eps) {
  const tol = eps == null ? 1e-9 : eps;
  assert.ok(
    Math.abs(actual - expected) <= tol,
    "expected " + expected + " got " + actual
  );
}

const series = [1, 2, 3, 4, 5];
almostEqual(FootStats.mean(series), 3);
almostEqual(FootStats.median(series), 3);
almostEqual(FootStats.min(series), 1);
almostEqual(FootStats.max(series), 5);
almostEqual(FootStats.quantile(series, 0.25), 2);
almostEqual(FootStats.stdev(series, false), Math.sqrt(2));

const xs = [0, 1, 2, 3, 4];
const ys = xs.map(function (x) {
  return 2 * x + 1;
});
const fit = FootStats.linearRegression(xs, ys);
almostEqual(fit.slope, 2);
almostEqual(fit.intercept, 1);
almostEqual(fit.r, 1);
almostEqual(FootStats.predict(fit, 10), 21);
almostEqual(FootStats.pearson(xs, xs), 1);
almostEqual(FootStats.pearson(xs, xs.map(function (x) { return -x; })), -1);

almostEqual(FootStats.ringShare(50, 180), 50 / 230);
almostEqual(FootStats.ringShare(435, 2400), 435 / 2835);

const generated = FootStats.generateSymmetryByAge();
assert.strictEqual(generated.length, 13);
assert.strictEqual(generated[0].ageYears, 2);
assert.strictEqual(generated[0].leftLarger10to20, 36);
assert.strictEqual(generated[0].same, 154);
assert.strictEqual(generated[12].ageYears, 14);

const storedSym = readJson("foot-symmetry-by-age.json");
assert.deepStrictEqual(storedSym, generated);

const heightShoe = readJson("height-shoe-size.json");
assert.strictEqual(heightShoe.girls.length, 199);
assert.strictEqual(heightShoe.boys.length, 199);
assert.strictEqual(heightShoe.girls[0].heightCm, 121.83);
assert.strictEqual(heightShoe.girls[0].shoeLengthCm, 15.6);

const girlPairs = FootStats.summarizePairs(heightShoe.girls, "heightCm", "shoeLengthCm");
const boyPairs = FootStats.summarizePairs(heightShoe.boys, "heightCm", "shoeLengthCm");
assert.ok(girlPairs.fit.r > 0.7, "girl height/shoe correlation should be strong");
assert.ok(boyPairs.fit.r > 0.7, "boy height/shoe correlation should be strong");
assert.ok(girlPairs.fit.slope > 0 && boyPairs.fit.slope > 0);

const ageFoot = readJson("age-foot-length.json");
assert.deepStrictEqual(ageFoot.agesYears, [6, 7, 8, 9, 10, 11, 12, 13, 14]);
almostEqual(ageFoot.girlsFootLengthCm[0], 18.55);
almostEqual(ageFoot.boysFootLengthCm[0], 18.27);
almostEqual(ageFoot.girlMinusBoyCm[5], -0.03);
const zipped = FootStats.zipAgeSeries(ageFoot);
assert.strictEqual(zipped[8].ageYears, 14);
almostEqual(zipped[8].girlMinusBoyCm, -0.5);

const bmi = readJson("bmi-foot-ratio.json");
assert.strictEqual(bmi.bmi.length, 13);
almostEqual(bmi.girlsIndex[0], 22.97);
assert.strictEqual(bmi.ringCharts.thinFoot.highlighted, 50);

const radar = readJson("radar-age-profiles.json");
assert.strictEqual(radar.axes.length, 7);
assert.deepStrictEqual(radar.series[3].values, [84, 45, 55, 70, 71, 71, 79]);

const pressure = readJson("plantar-pressure.json");
assert.strictEqual(pressure.typicalAdult.length, 7);
assert.strictEqual(pressure.diabeticFootAdult[0], 290);

const thickness = readJson("plantar-thickness.json");
assert.strictEqual(thickness.typicalAdultMm.length, 14);
assert.strictEqual(thickness.differenceUm[7], 45);

assert.throws(function () {
  FootStats.mean([]);
});
assert.throws(function () {
  FootStats.pearson([1], [1, 2]);
});

process.stdout.write("foot-stats checks passed\n");
