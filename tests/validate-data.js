#!/usr/bin/env node
/**
 * Validate the exported personal datasets against the live chart arrays
 * and against js/stats.js summaries.
 */
"use strict";

var fs = require("fs");
var path = require("path");
var FootStats = require("../js/stats.js");

var root = path.join(__dirname, "..");
var failed = 0;

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function extractArrayLiteral(source, startToken, endToken) {
  var start = source.indexOf(startToken);
  if (start < 0) {
    throw new Error("missing token " + startToken);
  }
  var from = source.indexOf("[", start);
  var depth = 0;
  for (var i = from; i < source.length; i += 1) {
    if (source[i] === "[") {
      depth += 1;
    } else if (source[i] === "]") {
      depth -= 1;
      if (depth === 0) {
        var slice = source.slice(from, i + 1);
        if (endToken && slice.indexOf(endToken) >= 0 && i === from) {
          continue;
        }
        return JSON.parse(slice.replace(/,\s*]/g, "]"));
      }
    }
  }
  throw new Error("unclosed array after " + startToken);
}

function assert(cond, message) {
  if (!cond) {
    failed += 1;
    console.error("FAIL  " + message);
  } else {
    console.log("ok    " + message);
  }
}

function nearlyEqual(a, b, eps) {
  return Math.abs(a - b) <= (eps || 1e-9);
}

function arraysEqual(a, b, eps) {
  if (a.length !== b.length) {
    return false;
  }
  for (var i = 0; i < a.length; i += 1) {
    if (Array.isArray(a[i]) && Array.isArray(b[i])) {
      if (!arraysEqual(a[i], b[i], eps)) {
        return false;
      }
    } else if (!nearlyEqual(a[i], b[i], eps || 0)) {
      return false;
    }
  }
  return true;
}

var indexJs = fs.readFileSync(path.join(root, "js/index.js"), "utf8");
var draw1 = fs.readFileSync(path.join(root, "draw1.js"), "utf8");
var draw2 = fs.readFileSync(path.join(root, "draw2.js"), "utf8");

var catalog = readJson("data/catalog.json");
assert(catalog.datasets.length === 7, "catalog lists seven datasets");
catalog.datasets.forEach(function (entry) {
  assert(fs.existsSync(path.join(root, entry.file)), entry.file + " exists");
  var payload = readJson(entry.file);
  assert(payload.id === entry.id, entry.id + " id matches catalog");
});

var height = readJson("data/height-shoe-size.json");
var femaleLive = extractArrayLiteral(indexJs, "name: '女性'", "name: '男性'");
var maleBlockStart = indexJs.indexOf("name: '男性'");
var maleLive = JSON.parse(
  (function () {
    var from = indexJs.indexOf("data: [[", maleBlockStart);
    var depth = 0;
    for (var i = from + 5; i < indexJs.length; i += 1) {
      if (indexJs[i] === "[") {
        depth += 1;
      } else if (indexJs[i] === "]") {
        depth -= 1;
        if (depth === 0) {
          return indexJs.slice(from + 5, i + 1).replace(/,\s*]/g, "]");
        }
      }
    }
    throw new Error("male scatter not found");
  })()
);

assert(height.series.female.length === 199, "199 female scatter points");
assert(height.series.male.length === 199, "199 male scatter points");
assert(arraysEqual(height.series.female, femaleLive), "female scatter matches js/index.js");
assert(arraysEqual(height.series.male, maleLive), "male scatter matches js/index.js");

var femaleStats = FootStats.describePairs(height.series.female, "female");
var maleStats = FootStats.describePairs(height.series.male, "male");
assert(
  nearlyEqual(femaleStats.fit.r, height.summary.female.pearson_r, 1e-4),
  "female Pearson r matches summary (" + height.summary.female.pearson_r + ")"
);
assert(
  nearlyEqual(maleStats.fit.r, height.summary.male.pearson_r, 1e-4),
  "male Pearson r matches summary (" + height.summary.male.pearson_r + ")"
);
assert(femaleStats.fit.r > 0.85, "height and shoe length are strongly correlated for girls");
assert(maleStats.fit.r > 0.85, "height and shoe length are strongly correlated for boys");

var age = readJson("data/age-foot-length.json");
assert(age.ages.length === 9, "nine age bins");
assert(
  arraysEqual(age.series.female_minus_male_cm, [0.28, 0.48, 0.4, 0.33, 0.08, -0.03, -0.15, -0.33, -0.5]),
  "girl-boy foot-length difference series"
);
var cross = FootStats.crossingAge(age.ages, age.series.female_minus_male_cm);
assert(cross && cross.at_age === 11, "boys overtake girls at age 11");

var bmi = readJson("data/bmi-plumpness.json");
assert(bmi.bmi_bins.length === bmi.series.female_plumpness.length, "BMI bins align with female series");
assert(bmi.bmi_bins.length === bmi.series.male_plumpness.length, "BMI bins align with male series");
var femaleTrend = FootStats.plumpnessTrend(bmi.bmi_bins, bmi.series.female_plumpness);
assert(femaleTrend.slope > 0, "female plumpness rises with BMI");

var leftRight = readJson("data/left-right-ratio.json");
assert(leftRight.ages.length === 13, "ages 2 through 14");
leftRight.ages.forEach(function (row) {
  var c = row.counts;
  var total = c.same + c.left_10_20 + c.left_over_20 + c.right_over_20 + c.right_10_20;
  assert(total === row.total, "left-right totals add up at age " + row.age_years);
  assert(c.same > c.left_10_20, "same-size feet remain the largest slice at age " + row.age_years);
});

var radar = readJson("data/age-radar.json");
assert(radar.indicators.length === 7, "seven radar indicators");
assert(radar.series[3].values[4] === 71 && radar.series[3].values[5] === 71, "age-12 shoe/foot scores evaluate 77-6 and 79-8");
var growth = FootStats.radarGrowth(radar.series);
assert(growth.every(function (g) { return g.delta > 0; }), "every radar indicator grows from age 9 to 12");

var pressure = readJson("data/plantar-pressure.json");
assert(pressure.sites.length === 7, "seven pressure sites");
assert(draw1.indexOf("90, 50, 39, 50, 120, 82, 80") >= 0, "typical pressure series present in draw1.js");
assert(draw1.indexOf("290, 200,20, 132, 15, 200, 90") >= 0, "diabetic pressure series present in draw1.js");
var pressureDelta = FootStats.siteDelta(pressure.series.typical_adult, pressure.series.diabetic_foot);
assert(pressureDelta[0].delta > 100, "site one pressure is much higher in the diabetic-foot series");

var tissue = readJson("data/tissue-thickness.json");
assert(tissue.sites.length === 14, "fourteen tissue sites");
assert(tissue.series.typical_adult_mm.length === 14, "typical tissue length");
assert(draw2.indexOf("11.6,12.3,12.1,13.7") >= 0, "typical tissue series present in draw2.js");

var html = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert(html.indexOf("js/index.js") >= 0, "live page still loads js/index.js");
assert(html.indexOf("draw1.js") < 0 && html.indexOf("draw2.js") < 0, "adult example scripts stay off the live home page");

if (failed) {
  console.error("\n" + failed + " check(s) failed");
  process.exit(1);
}
console.log("\nAll dataset checks passed.");
