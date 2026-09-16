/**
 * Extract the personal dashboard's hardcoded series into JSON files.
 * Reads only this repo's chart sources. Does not fetch or invent data.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../..");
const outDir = path.join(root, "examples", "data");

function readRepo(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function sliceBalancedArray(src, fromIndex) {
  const start = src.indexOf("[", fromIndex);
  if (start < 0) {
    throw new Error("No array start found");
  }
  let depth = 0;
  for (let i = start; i < src.length; i += 1) {
    const ch = src[i];
    if (ch === "[") depth += 1;
    if (ch === "]") {
      depth -= 1;
      if (depth === 0) {
        return src.slice(start, i + 1);
      }
    }
  }
  throw new Error("Unbalanced array");
}

function parseJsArray(literal) {
  const jsonish = literal
    .replace(/,\s*]/g, "]")
    .replace(/,\s*}/g, "}");
  return JSON.parse(jsonish);
}

function firstDataArrayAfter(src, marker) {
  const found = src.indexOf(marker);
  if (found < 0) {
    throw new Error("Marker not found: " + marker);
  }
  const dataKey = src.indexOf("data:", found + marker.length);
  const dataKeyAlt = src.indexOf('"data":', found + marker.length);
  let keyAt = dataKey;
  if (keyAt < 0 || (dataKeyAlt >= 0 && dataKeyAlt < keyAt)) {
    keyAt = dataKeyAlt;
  }
  if (keyAt < 0) {
    throw new Error("No data key after marker: " + marker);
  }
  return parseJsArray(sliceBalancedArray(src, keyAt));
}

function pairsToRecords(pairs, xName, yName) {
  return pairs.map(function (pair) {
    const rec = {};
    rec[xName] = pair[0];
    rec[yName] = pair[1];
    return rec;
  });
}

function writeJson(name, value) {
  const dest = path.join(outDir, name);
  fs.writeFileSync(dest, JSON.stringify(value, null, 2) + "\n", "utf8");
  return dest;
}

function generateSymmetryByAge() {
  const ages = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  return ages.map(function (age, i) {
    const a = Math.round(36 - 13 * Math.log(i + 1));
    const b = Math.round(17 - 6 * Math.log(i + 1));
    const c = Math.round(11 - 4 * Math.log(i + 1));
    const d = Math.round(27 - 10 * Math.log(i + 1));
    return {
      ageYears: age,
      label: age + "岁",
      leftLarger10to20: a,
      leftLargerOver20: b,
      rightLargerOver20: c,
      rightLarger10to20: d,
      same: 63 + a + b + c + d
    };
  });
}

fs.mkdirSync(outDir, { recursive: true });

const indexSrc = readRepo("js/index.js");
const draw1Src = readRepo("draw1.js");
const draw2Src = readRepo("draw2.js");

const femalePairs = firstDataArrayAfter(indexSrc, "name: '女性'");
const malePairs = firstDataArrayAfter(indexSrc, "name: '男性'");

if (!Array.isArray(femalePairs) || femalePairs[0].length !== 2) {
  throw new Error("Female scatter extract failed");
}
if (!Array.isArray(malePairs) || malePairs[0].length !== 2) {
  throw new Error("Male scatter extract failed");
}

const girlFoot = firstDataArrayAfter(indexSrc, "name: '女生脚长（cm）'");
const boyFoot = firstDataArrayAfter(indexSrc, "name: '男生脚长（cm）'");
const footDiff = firstDataArrayAfter(indexSrc, "name: '女生脚长与男生脚长之差'");

const girlRatio = firstDataArrayAfter(indexSrc, "name: '女生脚胖瘦度'");
const boyRatio = firstDataArrayAfter(indexSrc, "name: '男生脚胖瘦度'");
const bmiAxis = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

const radarNine = [43, 29, 37, 37, 38, 31, 41];
const radarTen = [53, 32, 42, 46, 43, 42, 49];
const radarEleven = [66, 37, 47, 60, 57, 59, 65];
const radarTwelve = [84, 45, 55, 70, 77 - 6, 79 - 8, 79];

const pressureNormal = firstDataArrayAfter(draw1Src, "name: '正常人群'");
const pressureDiabetic = firstDataArrayAfter(draw1Src, "name: '糖尿病足人群'");
const sitesSeven = ["位点一", "位点二", "位点三", "位点四", "位点五", "位点六", "位点七"];

const thicknessNormal = firstDataArrayAfter(draw2Src, '"name": "正常人群(成年)数据:mm"');
const thicknessDiabetic = firstDataArrayAfter(draw2Src, '"name": "糖尿病足人群(成年)数据:mm"');
const thicknessDelta = firstDataArrayAfter(draw2Src, "name: '差值:um'");

const catalog = {
  project: "pang990801.github.io",
  kind: "personal-study-visualization",
  extractedFrom: ["js/index.js", "draw1.js", "draw2.js"],
  note: "Values are copied from the personal dashboard source. They are illustrative study plots, not clinical records.",
  files: {
    "height-shoe-size.json": "Scatter of height (cm) vs shoe length (cm) for girls and boys.",
    "age-foot-length.json": "Mean foot length (cm) by age 6-14, plus girl-minus-boy difference.",
    "bmi-foot-ratio.json": "Displayed foot plumpness index by BMI 12-24, plus the two ring-chart shares.",
    "foot-symmetry-by-age.json": "Generated with the same log formulas as the dashboard timeline pie.",
    "radar-age-profiles.json": "0-100 scaled radar profiles for ages 9-12.",
    "plantar-pressure.json": "Seven-site pressure sketch from draw1.js (not mounted on the live dashboard).",
    "plantar-thickness.json": "Fourteen-site plantar thickness sketch from draw2.js (not mounted on the live dashboard)."
  }
};

const heightShoe = {
  description: "Height (cm) vs shoe length (cm). Source: js/index.js scatter series.",
  units: { height: "cm", shoeLength: "cm" },
  girls: pairsToRecords(femalePairs, "heightCm", "shoeLengthCm"),
  boys: pairsToRecords(malePairs, "heightCm", "shoeLengthCm")
};

const ageFoot = {
  description: "Mean foot length by integer age. Source: js/index.js pictorial bar + difference line.",
  agesYears: [6, 7, 8, 9, 10, 11, 12, 13, 14],
  girlsFootLengthCm: girlFoot,
  boysFootLengthCm: boyFoot,
  girlMinusBoyCm: footDiff
};

const bmiRatio = {
  description: "Dashboard series labeled 脚胖瘦度（脚长/脚宽）. Numeric range is ~23-30, so treat as a displayed index, not a raw length/width ratio.",
  bmi: bmiAxis,
  girlsIndex: girlRatio,
  boysIndex: boyRatio,
  ringCharts: {
    thinFoot: { highlighted: 50, placeholder: 180, label: "过瘦脚占比" },
    plumpFoot: { highlighted: 435, placeholder: 2400, label: "过胖脚占比" }
  }
};

const radar = {
  description: "Circular radar in the center column. Axes are scaled 0-100, not raw centimeters.",
  axes: ["身高", "兜跟围长", "跗骨围长", "跖趾围长", "鞋码", "脚长", "体重"],
  series: [
    { ageYears: 9, values: radarNine },
    { ageYears: 10, values: radarTen },
    { ageYears: 11, values: radarEleven },
    { ageYears: 12, values: radarTwelve, sourceNote: "js/index.js writes shoe as 77-6 and foot length as 79-8" }
  ]
};

const pressure = {
  description: "Unmounted sketch in draw1.js. Seven named plantar sites, unit Pa as labeled on the draft title.",
  sites: sitesSeven,
  units: "Pa",
  typicalAdult: pressureNormal,
  diabeticFootAdult: pressureDiabetic
};

const thickness = {
  description: "Unmounted sketch in draw2.js. Fourteen plantar sites.",
  siteCount: 14,
  typicalAdultMm: thicknessNormal,
  diabeticFootAdultMm: thicknessDiabetic,
  differenceUm: thicknessDelta
};

writeJson("catalog.json", catalog);
writeJson("height-shoe-size.json", heightShoe);
writeJson("age-foot-length.json", ageFoot);
writeJson("bmi-foot-ratio.json", bmiRatio);
writeJson("foot-symmetry-by-age.json", generateSymmetryByAge());
writeJson("radar-age-profiles.json", radar);
writeJson("plantar-pressure.json", pressure);
writeJson("plantar-thickness.json", thickness);

const summary = {
  girlScatterPoints: heightShoe.girls.length,
  boyScatterPoints: heightShoe.boys.length,
  ageRows: ageFoot.agesYears.length,
  bmiRows: bmiRatio.bmi.length,
  symmetryRows: 13,
  radarSeries: radar.series.length,
  pressureSites: pressure.sites.length,
  thicknessSites: thickness.typicalAdultMm.length
};

process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
