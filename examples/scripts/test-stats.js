#!/usr/bin/env node
/**
 * Check OLS helpers against the extracted scatter JSON.
 * Run from the repository root: node examples/scripts/test-stats.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

function linearRegression(points) {
  const n = points.length;
  let meanX = 0;
  let meanY = 0;
  for (let i = 0; i < n; i++) {
    meanX += points[i][0];
    meanY += points[i][1];
  }
  meanX /= n;
  meanY /= n;
  let ssxx = 0;
  let ssyy = 0;
  let ssxy = 0;
  for (let i = 0; i < n; i++) {
    const dx = points[i][0] - meanX;
    const dy = points[i][1] - meanY;
    ssxx += dx * dx;
    ssyy += dy * dy;
    ssxy += dx * dy;
  }
  const slope = ssxy / ssxx;
  const intercept = meanY - slope * meanX;
  const r = ssxy / Math.sqrt(ssxx * ssyy);
  return { n, slope, intercept, r, r2: r * r, meanX, meanY };
}

const data = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../data/height-shoe-size.json"), "utf8")
);

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error("FAIL  " + msg);
  } else {
    console.log("ok    " + msg);
  }
}

const girl = linearRegression(data.female.points);
const boy = linearRegression(data.male.points);

assert(girl.n === 199 && boy.n === 199, "OLS n matches 199/199");
assert(girl.slope > 0 && boy.slope > 0, "taller children have longer plotted shoe size");
assert(girl.r > 0.8 && boy.r > 0.8, "height–shoe correlation is strong (r > 0.8)");
assert(Math.abs(girl.meanX - data.female.summary.heightCm.mean) < 0.02, "girl mean height matches JSON summary");
assert(Math.abs(boy.meanX - data.male.summary.heightCm.mean) < 0.02, "boy mean height matches JSON summary");
assert(girl.intercept + girl.slope * girl.meanX - girl.meanY < 1e-9, "girl line passes through centroid");
assert(boy.intercept + boy.slope * boy.meanX - boy.meanY < 1e-9, "boy line passes through centroid");

// A 120 cm girl should land near the cloud, not at 0 or 40 cm.
const pred120 = girl.intercept + girl.slope * 120;
assert(pred120 > 14 && pred120 < 20, "predicted girl shoe at 120 cm is in 14–20 cm (" + pred120.toFixed(2) + ")");

console.log(
  "girl  slope=" + girl.slope.toFixed(4) + "  r=" + girl.r.toFixed(3) +
    "   boy  slope=" + boy.slope.toFixed(4) + "  r=" + boy.r.toFixed(3)
);

if (failed) {
  console.error("\n" + failed + " check(s) failed");
  process.exit(1);
}
console.log("\nstats checks passed");
