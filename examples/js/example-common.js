/**
 * Shared fetch / chart bootstrapping for the personal example pages.
 */
(function (root) {
  "use strict";

  function $(sel) {
    return document.querySelector(sel);
  }

  function showError(node, error) {
    var message = error && error.message ? error.message : String(error);
    if (!node) {
      return;
    }
    node.innerHTML = "";
    var box = document.createElement("div");
    box.className = "error-box";
    box.textContent = message + " — serve the repo over HTTP (see docs/local-preview.md).";
    node.appendChild(box);
  }

  function loadJson(relPath) {
    return fetch(relPath).then(function (res) {
      if (!res.ok) {
        throw new Error("Could not load " + relPath + " (" + res.status + ")");
      }
      return res.json();
    });
  }

  function initChart(el) {
    if (typeof echarts === "undefined") {
      throw new Error("ECharts did not load");
    }
    var chart = echarts.init(el, "dark");
    window.addEventListener("resize", function () {
      chart.resize();
    });
    return chart;
  }

  function fillDl(dl, rows) {
    if (!dl) {
      return;
    }
    dl.innerHTML = "";
    rows.forEach(function (row) {
      var dt = document.createElement("dt");
      dt.textContent = row[0];
      var dd = document.createElement("dd");
      dd.textContent = row[1];
      dl.appendChild(dt);
      dl.appendChild(dd);
    });
  }

  function fillTable(table, headers, rows) {
    if (!table) {
      return;
    }
    var thead = table.tHead || table.createTHead();
    thead.innerHTML = "";
    var hr = thead.insertRow();
    headers.forEach(function (h) {
      var th = document.createElement("th");
      th.textContent = h;
      hr.appendChild(th);
    });
    var tbody = table.tBodies[0] || table.appendChild(document.createElement("tbody"));
    tbody.innerHTML = "";
    rows.forEach(function (cells) {
      var tr = tbody.insertRow();
      cells.forEach(function (cell) {
        var td = tr.insertCell();
        td.textContent = cell;
      });
    });
  }

  var darkGrid = {
    backgroundColor: "rgba(12, 24, 48, 0.35)",
    textStyle: { color: "#d7e7ff" },
    legend: { textStyle: { color: "#d7e7ff" } },
    tooltip: { trigger: "axis" }
  };

  root.ExampleCommon = {
    $: $,
    showError: showError,
    loadJson: loadJson,
    initChart: initChart,
    fillDl: fillDl,
    fillTable: fillTable,
    darkGrid: darkGrid
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
