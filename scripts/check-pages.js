#!/usr/bin/env node
/**
 * Static checks for docs / example HTML hosts.
 * Run from the repo root: node scripts/check-pages.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const errors = [];

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    errors.push("missing " + rel);
    return "";
  }
  return fs.readFileSync(full, "utf8");
}

function mustInclude(rel, snippets) {
  const html = read(rel);
  snippets.forEach(function (s) {
    if (html.indexOf(s) === -1) {
      errors.push(rel + " missing " + JSON.stringify(s));
    }
  });
}

const docPages = [
  "docs/index.html",
  "docs/methodology.html",
  "docs/data-dictionary.html",
  "docs/chart-guide.html",
  "docs/limitations.html"
];

docPages.forEach(function (page) {
  mustInclude(page, [
    "css/site.css",
    "js/site-nav.js",
    "id=\"site-header\"",
    "id=\"site-side\"",
    "id=\"site-footer\"",
    "data-nav="
  ]);
});

const examples = [
  {
    html: "examples/growth.html",
    js: "js/examples/growth.js",
    ids: ["growth-chart", "growth-rows", "mode"]
  },
  {
    html: "examples/shoe-size.html",
    js: "js/examples/shoe-size.js",
    ids: ["shoe-chart", "height", "sex", "pred", "band", "r2"]
  },
  {
    html: "examples/symmetry.html",
    js: "js/examples/symmetry.js",
    ids: ["sym-chart", "age", "sym-rows"]
  },
  {
    html: "examples/radar.html",
    js: "js/examples/radar.js",
    ids: ["radar-chart"]
  },
  {
    html: "examples/pressure.html",
    js: "js/examples/pressure.js",
    ids: ["pressure-chart", "pressure-note"]
  },
  {
    html: "examples/thickness.html",
    js: "js/examples/thickness.js",
    ids: ["thickness-chart", "thickness-note"]
  }
];

examples.forEach(function (ex) {
  mustInclude(ex.html, [
    "css/site.css",
    "js/echarts.min.js",
    "js/data-loader.js",
    "js/site-nav.js",
    ex.js.replace("js/", "")
  ]);
  const html = read(ex.html);
  const js = read(ex.js);
  ex.ids.forEach(function (id) {
    if (html.indexOf("id=\"" + id + "\"") === -1) {
      errors.push(ex.html + " missing id=" + id);
    }
    if (js.indexOf(id) === -1) {
      errors.push(ex.js + " does not mention " + id);
    }
  });
});

mustInclude("index.html", [
  "docs/index.html",
  "examples/index.html",
  "儿童脚型数据可视化"
]);

mustInclude("examples/index.html", [
  "growth.html",
  "shoe-size.html",
  "symmetry.html",
  "radar.html",
  "pressure.html",
  "thickness.html"
]);

if (errors.length) {
  console.error("PAGE CHECK FAILED");
  errors.forEach(function (e) { console.error(" - " + e); });
  process.exit(1);
}

console.log("PAGE CHECK OK");
console.log(" - docs " + docPages.length);
console.log(" - examples " + examples.length);
