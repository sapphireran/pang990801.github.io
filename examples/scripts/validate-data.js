#!/usr/bin/env node
/**
 * Structural checks for examples/data/*.json.
 * Run from the repository root: node examples/scripts/validate-data.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const dir = path.resolve(__dirname, "../data");
let failed = 0;

function load(name) {
  const file = path.join(dir, name);
  if (!fs.existsSync(file)) {
    throw new Error("missing " + name);
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error("FAIL  " + msg);
  } else {
    console.log("ok    " + msg);
  }
}

function sameLen(label, arrays) {
  const lens = arrays.map((a) => a.length);
  assert(
    lens.every((n) => n === lens[0] && n > 0),
    label + " lengths " + lens.join(",")
  );
}

const height = load("height-shoe-size.json");
assert(height.female.points.length === 199, "female scatter n=199");
assert(height.male.points.length === 199, "male scatter n=199");
assert(
  height.female.points.every((p) => p.length === 2 && p.every(Number.isFinite)),
  "female points are [x,y] numbers"
);
assert(
  height.male.points.every((p) => p.length === 2 && p.every(Number.isFinite)),
  "male points are [x,y] numbers"
);
assert(height.female.summary.n === 199 && height.male.summary.n === 199, "summaries match n");

const age = load("age-foot-length.json");
sameLen("age-foot-length", [
  age.ages,
  age.femaleFootLengthCm,
  age.maleFootLengthCm,
  age.femaleMinusMaleCm,
]);
assert(age.ages[0] === 6 && age.ages[8] === 14, "ages 6..14");
age.femaleMinusMaleCm.forEach(function (d, i) {
  const rebuilt = +(age.femaleFootLengthCm[i] - age.maleFootLengthCm[i]).toFixed(2);
  assert(Math.abs(rebuilt - d) < 0.011, "difference[" + i + "] matches girl-boy");
});

const bmi = load("bmi-plumpness.json");
sameLen("bmi-plumpness", [bmi.bmi, bmi.femalePlumpness, bmi.malePlumpness]);
assert(bmi.bmi[0] === 12 && bmi.bmi[bmi.bmi.length - 1] === 24, "BMI 12..24");
assert(bmi.thinFootRing.value + bmi.thinFootRing.placeholder === 230, "thin ring parts");
assert(bmi.wideFootRing.value + bmi.wideFootRing.placeholder === 2835, "wide ring parts");

const radar = load("growth-radar.json");
assert(radar.axes.length === 7, "seven radar axes");
assert(radar.series.length === 4, "four radar ages");
radar.series.forEach(function (s) {
  assert(s.values.length === 7, "radar age " + s.age + " has 7 scores");
  assert(
    s.values.every(function (v) {
      return v >= 0 && v <= 100;
    }),
    "radar age " + s.age + " scores in 0-100"
  );
});
assert(radar.series[3].values[4] === 71 && radar.series[3].values[5] === 71, "age 12 shoe/foot = 71");

const bi = load("bilateral-ratio.json");
assert(bi.ages.length === 13, "13 bilateral ages");
bi.ages.forEach(function (row, i) {
  const a = Math.round(36 - 13 * Math.log(i + 1));
  const b = Math.round(17 - 6 * Math.log(i + 1));
  const c = Math.round(11 - 4 * Math.log(i + 1));
  const d = Math.round(27 - 10 * Math.log(i + 1));
  assert(row.left10to20 === a && row.same === 63 + a + b + c + d, "bilateral formula age index " + i);
});

const pressure = load("plantar-pressure.json");
sameLen("plantar-pressure", [pressure.sites, pressure.typicalPa, pressure.diabeticFootPa]);
assert(pressure.sites.length === 7, "seven pressure sites");

const tissue = load("tissue-thickness.json");
sameLen("tissue-thickness", [
  tissue.sites,
  tissue.typicalAdultMm,
  tissue.diabeticFootAdultMm,
  tissue.differenceUm,
]);
assert(tissue.sites.length === 14, "fourteen thickness sites");

if (failed) {
  console.error("\n" + failed + " check(s) failed");
  process.exit(1);
}
console.log("\nall data files look consistent");
