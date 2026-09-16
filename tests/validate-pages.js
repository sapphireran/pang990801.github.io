#!/usr/bin/env node
"use strict";

var fs = require("fs");
var path = require("path");
var catalog = require("../data/catalog.json");

var root = path.join(__dirname, "..");
var failed = 0;

function assert(cond, message) {
  if (!cond) {
    failed += 1;
    console.error("FAIL  " + message);
  } else {
    console.log("ok    " + message);
  }
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

assert(fs.existsSync(path.join(root, ".nojekyll")), ".nojekyll exists for GitHub Pages");
assert(read("README.md").indexOf("/examples/") >= 0, "README links to examples");
assert(read("index.html").indexOf("docs/index.html") >= 0, "live nav links to docs");
assert(read("index.html").indexOf("examples/index.html") >= 0, "live nav links to examples");
assert(read("index.html").indexOf("<title>中国人群脚型数据可视化</title>") >= 0, "live page has a real title");

["index.html", "methodology.html", "data-dictionary.html", "charts.html"].forEach(function (name) {
  var html = read("docs/" + name);
  assert(html.indexOf("css/docs.css") >= 0, "docs/" + name + " uses docs.css");
  assert(html.indexOf("docs-nav.js") >= 0, "docs/" + name + " includes shared nav");
});

assert(read("examples/index.html").indexOf("data-loader.js") >= 0, "example index loads catalog");
assert(read("examples/boot.js").indexOf("FootCharts.byId") >= 0, "boot uses option factories");
assert(read("examples/summary.html").indexOf("FootStats.describePairs") >= 0, "summary page uses stats helper");
assert(read("examples/index.html").indexOf("summary.html") >= 0, "example index links the summary table");

catalog.datasets.forEach(function (entry) {
  var rel = "examples/" + entry.id + ".html";
  assert(fs.existsSync(path.join(root, rel)), rel + " exists");
  var html = read(rel);
  assert(html.indexOf('data-dataset="' + entry.id + '"') >= 0, rel + " binds " + entry.id);
  assert(html.indexOf("boot.js") >= 0, rel + " boots via shared script");
});

if (failed) {
  console.error("\n" + failed + " check(s) failed");
  process.exit(1);
}
console.log("\nAll page checks passed.");
