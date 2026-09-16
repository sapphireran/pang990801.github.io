#!/usr/bin/env node
"use strict";

var FootCharts = require("../js/charts/options.js");
var height = require("../data/height-shoe-size.json");
var age = require("../data/age-foot-length.json");
var bmi = require("../data/bmi-plumpness.json");
var leftRight = require("../data/left-right-ratio.json");
var radar = require("../data/age-radar.json");
var pressure = require("../data/plantar-pressure.json");
var tissue = require("../data/tissue-thickness.json");

var failed = 0;

function assert(cond, message) {
  if (!cond) {
    failed += 1;
    console.error("FAIL  " + message);
  } else {
    console.log("ok    " + message);
  }
}

function hasSeries(option, name) {
  return option.series.some(function (s) {
    return s.name === name;
  });
}

var scatter = FootCharts.heightShoeSize(height);
assert(scatter.series[0].data.length === 199, "scatter female length");
assert(scatter.series[1].data.length === 199, "scatter male length");
assert(scatter.xAxis.name.indexOf("身高") >= 0, "scatter x is height");

var bars = FootCharts.ageFootLength(age);
assert(bars.series[0].data.length === 9, "age bars have 9 bins");
assert(hasSeries(bars, "女生 − 男生"), "age chart includes difference line");

var lines = FootCharts.bmiPlumpness(bmi);
assert(lines.series[0].data[0] === 22.97, "first female plumpness value");
assert(lines.xAxis.data.length === 13, "13 BMI categories");

var pie = FootCharts.leftRightRatio(leftRight, 8);
assert(pie.series[0].type === "pie", "left-right is a pie");
assert(
  pie.series[0].data.reduce(function (sum, d) {
    return sum + d.value;
  }, 0) === leftRight.ages[6].total,
  "age-8 pie uses matching totals"
);

var radarOpt = FootCharts.ageRadar(radar);
assert(radarOpt.radar.indicator.length === 7, "radar has 7 axes");
assert(radarOpt.series[0].data.length === 4, "radar has 4 ages");

var pressureOpt = FootCharts.plantarPressure(pressure);
assert(pressureOpt.series[1].data[0] === 290, "diabetic site-one pressure");

var tissueOpt = FootCharts.tissueThickness(tissue);
assert(tissueOpt.series[2].yAxisIndex === 1, "tissue difference uses second axis");

var map = {
  "height-shoe-size": height,
  "age-foot-length": age,
  "bmi-plumpness": bmi,
  "age-radar": radar,
  "plantar-pressure": pressure,
  "tissue-thickness": tissue,
};
Object.keys(map).forEach(function (id) {
  var option = FootCharts.byId(id, map[id]);
  assert(option.series && option.series.length > 0, "byId(" + id + ") returns series");
});

var threw = false;
try {
  FootCharts.byId("missing", {});
} catch (err) {
  threw = /unknown chart id/.test(err.message);
}
assert(threw, "unknown chart id throws");

if (failed) {
  console.error("\n" + failed + " check(s) failed");
  process.exit(1);
}
console.log("\nAll option-factory checks passed.");
