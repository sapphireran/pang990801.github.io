/**
 * Print a short numeric summary of the extracted personal datasets.
 * Run: node examples/scripts/summarize-data.js
 */
"use strict";

const fs = require("fs");
const path = require("path");
const FootStats = require("../js/foot-stats.js");

const dataDir = path.resolve(__dirname, "../data");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
}

function line(label, value) {
  process.stdout.write(label + ": " + value + "\n");
}

function dumpSummary(title, summary, digits) {
  process.stdout.write("\n" + title + "\n");
  line("  n", summary.n);
  line("  min", FootStats.formatFixed(summary.min, digits));
  line("  median", FootStats.formatFixed(summary.median, digits));
  line("  mean", FootStats.formatFixed(summary.mean, digits));
  line("  max", FootStats.formatFixed(summary.max, digits));
  line("  stdev", FootStats.formatFixed(summary.stdev, digits));
}

const heightShoe = readJson("height-shoe-size.json");
const girls = FootStats.summarizePairs(heightShoe.girls, "heightCm", "shoeLengthCm");
const boys = FootStats.summarizePairs(heightShoe.boys, "heightCm", "shoeLengthCm");

process.stdout.write("Personal dashboard series summary\n");
process.stdout.write("================================\n");

dumpSummary("Girl height (cm)", girls.x, 2);
dumpSummary("Girl shoe length (cm)", girls.y, 2);
line("Girl shoe ~ height slope", FootStats.formatFixed(girls.fit.slope, 4));
line("Girl r", FootStats.formatFixed(girls.fit.r, 3));

dumpSummary("Boy height (cm)", boys.x, 2);
dumpSummary("Boy shoe length (cm)", boys.y, 2);
line("Boy shoe ~ height slope", FootStats.formatFixed(boys.fit.slope, 4));
line("Boy r", FootStats.formatFixed(boys.fit.r, 3));

const age = readJson("age-foot-length.json");
process.stdout.write("\nAge vs foot length (cm)\n");
FootStats.zipAgeSeries(age).forEach(function (row) {
  line(
    "  " + row.ageYears + "y",
    "g " + row.girlsFootLengthCm.toFixed(2) +
      "  b " + row.boysFootLengthCm.toFixed(2) +
      "  Δ " + row.girlMinusBoyCm.toFixed(2)
  );
});

const bmi = readJson("bmi-foot-ratio.json");
line(
  "\nThin-foot ring share",
  FootStats.formatPct(FootStats.ringShare(
    bmi.ringCharts.thinFoot.highlighted,
    bmi.ringCharts.thinFoot.placeholder
  ))
);
line(
  "Plump-foot ring share",
  FootStats.formatPct(FootStats.ringShare(
    bmi.ringCharts.plumpFoot.highlighted,
    bmi.ringCharts.plumpFoot.placeholder
  ))
);

const radar = readJson("radar-age-profiles.json");
process.stdout.write("\nRadar profiles (0-100 scaled)\n");
radar.series.forEach(function (series) {
  line("  " + series.ageYears + "y", series.values.join(", "));
});

const pressure = readJson("plantar-pressure.json");
dumpSummary("Draft typical pressure (Pa)", FootStats.summarizeNumeric(pressure.typicalAdult), 1);
dumpSummary("Draft diabetic-foot pressure (Pa)", FootStats.summarizeNumeric(pressure.diabeticFootAdult), 1);

const thickness = readJson("plantar-thickness.json");
dumpSummary("Draft typical thickness (mm)", FootStats.summarizeNumeric(thickness.typicalAdultMm), 2);
dumpSummary("Draft diabetic-foot thickness (mm)", FootStats.summarizeNumeric(thickness.diabeticFootAdultMm), 2);
