#!/usr/bin/env node
/**
 * Validate the personal-project datasets under /data.
 * Run from the repo root: node scripts/validate-data.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "data");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog.json"), "utf8"));

const errors = [];
const info = [];

function fail(msg) {
  errors.push(msg);
}

function ok(msg) {
  info.push(msg);
}

function readJson(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    fail("missing file " + file);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(full, "utf8"));
  } catch (err) {
    fail(file + " is not valid JSON: " + err.message);
    return null;
  }
}

function isNumberArray(arr) {
  return Array.isArray(arr) && arr.every(function (n) {
    return typeof n === "number" && Number.isFinite(n);
  });
}

function sameLength() {
  const arrays = Array.prototype.slice.call(arguments);
  const first = arrays[0];
  return arrays.every(function (arr) {
    return arr.length === first.length;
  });
}

catalog.datasets.forEach(function (entry) {
  const data = readJson(entry.file);
  if (!data) {
    return;
  }
  if (data.id !== entry.id) {
    fail(entry.file + " id mismatch: " + data.id + " !== " + entry.id);
  } else {
    ok(entry.file + " id matches catalog");
  }
});

const heightShoe = readJson("height-shoe-size.json");
if (heightShoe) {
  ["female", "male"].forEach(function (sex) {
    const series = heightShoe.series[sex];
    const n = series.points.length;
    const fit = series.fit;
    if (n !== fit.n) {
      fail("height-shoe-size " + sex + " fit.n " + fit.n + " !== points " + n);
    }
    series.points.forEach(function (p, i) {
      if (typeof p.height !== "number" || typeof p.shoeLength !== "number") {
        fail("height-shoe-size " + sex + " point " + i + " missing numbers");
      }
    });
    if (fit.r2 < 0.7) {
      fail("height-shoe-size " + sex + " unexpected weak fit r2=" + fit.r2);
    }
    ok("height-shoe-size " + sex + " n=" + n + " r2=" + fit.r2);
  });
}

const ageFoot = readJson("age-foot-length.json");
if (ageFoot) {
  if (!sameLength(ageFoot.ages, ageFoot.series.female, ageFoot.series.male, ageFoot.differenceFemaleMinusMale)) {
    fail("age-foot-length series lengths differ");
  } else {
    ok("age-foot-length aligned length=" + ageFoot.ages.length);
  }
  ageFoot.ages.forEach(function (age, i) {
    const delta = Number((ageFoot.series.female[i] - ageFoot.series.male[i]).toFixed(2));
    const stored = ageFoot.differenceFemaleMinusMale[i];
    if (Math.abs(delta - stored) > 0.011) {
      fail("age-foot-length difference mismatch at " + age + ": " + stored + " vs " + delta);
    }
  });
}

const bmi = readJson("bmi-foot-plumpness.json");
if (bmi) {
  if (!sameLength(bmi.bmi, bmi.series.female, bmi.series.male)) {
    fail("bmi-foot-plumpness series lengths differ");
  } else {
    ok("bmi-foot-plumpness aligned length=" + bmi.bmi.length);
  }
}

const radar = readJson("age-radar-profiles.json");
if (radar) {
  radar.series.forEach(function (row) {
    if (row.values.length !== radar.indicators.length) {
      fail("radar age " + row.age + " value count mismatch");
    }
    if (row.values.some(function (v) { return v < 0 || v > 100; })) {
      fail("radar age " + row.age + " has values outside 0–100");
    }
  });
  ok("radar profiles " + radar.series.length + " ages");
}

const pressure = readJson("plantar-pressure.json");
if (pressure) {
  if (!sameLength(pressure.sites, pressure.series.typicalAdult, pressure.series.diabeticFoot)) {
    fail("plantar-pressure series lengths differ");
  } else {
    ok("plantar-pressure sites=" + pressure.sites.length);
  }
}

const thickness = readJson("tissue-thickness.json");
if (thickness) {
  const n = thickness.siteCount;
  ["typicalAdultMm", "diabeticFootMm", "differenceUm"].forEach(function (key) {
    if (!isNumberArray(thickness.series[key]) || thickness.series[key].length !== n) {
      fail("tissue-thickness " + key + " expected " + n + " numbers");
    }
  });
  ok("tissue-thickness sites=" + n);
}

const symmetry = readJson("foot-symmetry.json");
if (symmetry) {
  symmetry.series.forEach(function (row) {
    const c = row.counts;
    const sumParts = c.same + c.leftLarger10to20 + c.leftLargerOver20 + c.rightLargerOver20 + c.rightLarger10to20;
    if (sumParts !== row.total) {
      fail("foot-symmetry age " + row.age + " total mismatch");
    }
  });
  ok("foot-symmetry ages=" + symmetry.series.length);
}

if (errors.length) {
  console.error("DATA VALIDATION FAILED");
  errors.forEach(function (e) { console.error(" - " + e); });
  process.exit(1);
}

console.log("DATA VALIDATION OK");
info.forEach(function (m) { console.log(" - " + m); });
