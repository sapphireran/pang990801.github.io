(function (global) {
  function data() {
    if (!global.DESK_DATA) {
      throw new Error("data/desk/payload.js did not load");
    }
    return global.DESK_DATA;
  }

  function init(selector) {
    var el = typeof selector === "string" ? document.querySelector(selector) : selector;
    var chart = echarts.init(el);
    window.addEventListener("resize", function () {
      chart.resize();
    });
    return chart;
  }

  function axis(name) {
    return {
      name: name,
      nameTextStyle: { color: "#c6c0b4" },
      axisLine: { lineStyle: { color: "#3c4058" } },
      axisTick: { lineStyle: { color: "#3c4058" } },
      axisLabel: { color: "#c6c0b4" },
      splitLine: { lineStyle: { color: "rgba(60,64,88,0.45)" } }
    };
  }

  function ols(points) {
    var n = points.length;
    var mx = 0;
    var my = 0;
    var i;
    for (i = 0; i < n; i += 1) {
      mx += points[i][0];
      my += points[i][1];
    }
    mx /= n;
    my /= n;
    var num = 0;
    var den = 0;
    for (i = 0; i < n; i += 1) {
      num += (points[i][0] - mx) * (points[i][1] - my);
      den += (points[i][0] - mx) * (points[i][0] - mx);
    }
    var slope = num / den;
    var intercept = my - slope * mx;
    var ssTot = 0;
    var ssRes = 0;
    for (i = 0; i < n; i += 1) {
      var pred = intercept + slope * points[i][0];
      ssTot += (points[i][1] - my) * (points[i][1] - my);
      ssRes += (points[i][1] - pred) * (points[i][1] - pred);
    }
    return {
      n: n,
      slope: slope,
      intercept: intercept,
      r2: ssTot ? 1 - ssRes / ssTot : 0,
      rmse: Math.sqrt(ssRes / n)
    };
  }

  function residuals(points, fit) {
    return points.map(function (p) {
      return [p[0], p[1] - (fit.intercept + fit.slope * p[0])];
    });
  }

  function fmt(value, digits) {
    return Number(value).toFixed(digits == null ? 2 : digits);
  }

  function markCurrent() {
    var path = (location.pathname.split("/").pop() || "index.html");
    document.querySelectorAll(".desk-nav a").forEach(function (link) {
      var leaf = (link.getAttribute("href") || "").split("/").pop();
      if (leaf === path) {
        link.setAttribute("aria-current", "page");
        link.classList.add("is-current");
      }
    });
  }

  global.Desk = {
    data: data,
    init: init,
    axis: axis,
    ols: ols,
    residuals: residuals,
    fmt: fmt,
    markCurrent: markCurrent,
    rose: "#e08b8b",
    teal: "#7ec8c3",
    amber: "#e8a54b",
    cream: "#f3e6c9"
  };

  document.addEventListener("DOMContentLoaded", markCurrent);
})(window);
