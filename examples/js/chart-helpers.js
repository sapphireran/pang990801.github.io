/**
 * Small helpers for the personal example pages.
 * Keep these free of dashboard class selectors so a page only needs #chart.
 */
(function (global) {
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function createChart(elOrSelector, theme) {
    var el = typeof elOrSelector === "string" ? $(elOrSelector) : elOrSelector;
    if (!el) {
      throw new Error("chart container not found: " + elOrSelector);
    }
    if (typeof echarts === "undefined") {
      throw new Error("echarts is not defined — serve from the repo root so ../js/echarts.min.js loads");
    }
    return echarts.init(el, theme || "dark");
  }

  function bindChartResize(chart) {
    var ticking = false;
    function onResize() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        chart.resize();
        ticking = false;
      });
    }
    window.addEventListener("resize", onResize);
    return function unbind() {
      window.removeEventListener("resize", onResize);
    };
  }

  function mountNotes(el, lines) {
    var root = typeof el === "string" ? $(el) : el;
    if (!root || !lines || !lines.length) return;
    var ul = document.createElement("ul");
    lines.forEach(function (line) {
      var li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    });
    root.innerHTML = "";
    var h = document.createElement("h2");
    h.textContent = "读这张图";
    root.appendChild(h);
    root.appendChild(ul);
  }

  function fmt(n, digits) {
    if (typeof n !== "number" || !isFinite(n)) return String(n);
    return n.toFixed(digits == null ? 2 : digits);
  }

  function linearGradient(echartsLib, stops, vertical) {
    var lib = echartsLib || global.echarts;
    var pairs = stops || [
      { offset: 0, color: "rgba(61,234,255,0.55)" },
      { offset: 1, color: "rgba(61,234,255,0.02)" }
    ];
    if (vertical === false) {
      return new lib.graphic.LinearGradient(0, 0, 1, 0, pairs);
    }
    return new lib.graphic.LinearGradient(0, 0, 0, 1, pairs);
  }

  function summarizePairs(points) {
    var n = points.length;
    if (!n) {
      return { n: 0, xMin: 0, xMax: 0, xMean: 0, yMin: 0, yMax: 0, yMean: 0, r: 0 };
    }
    var xs = points.map(function (p) { return p[0]; });
    var ys = points.map(function (p) { return p[1]; });
    var xMean = xs.reduce(function (a, b) { return a + b; }, 0) / n;
    var yMean = ys.reduce(function (a, b) { return a + b; }, 0) / n;
    var num = 0;
    var dx2 = 0;
    var dy2 = 0;
    for (var i = 0; i < n; i++) {
      var dx = xs[i] - xMean;
      var dy = ys[i] - yMean;
      num += dx * dy;
      dx2 += dx * dx;
      dy2 += dy * dy;
    }
    var den = Math.sqrt(dx2 * dy2);
    return {
      n: n,
      xMin: Math.min.apply(null, xs),
      xMax: Math.max.apply(null, xs),
      xMean: xMean,
      yMin: Math.min.apply(null, ys),
      yMax: Math.max.apply(null, ys),
      yMean: yMean,
      r: den ? num / den : 0
    };
  }

  function fillStats(el, items) {
    var root = typeof el === "string" ? $(el) : el;
    if (!root) return;
    root.innerHTML = "";
    items.forEach(function (item) {
      var span = document.createElement("span");
      span.className = "stat";
      span.textContent = item;
      root.appendChild(span);
    });
  }

  global.chartHelpers = {
    $: $,
    createChart: createChart,
    bindChartResize: bindChartResize,
    mountNotes: mountNotes,
    fmt: fmt,
    linearGradient: linearGradient,
    summarizePairs: summarizePairs,
    fillStats: fillStats
  };
})(window);
