(function (global) {
  var FootExamples = {
    async loadDataset(name) {
      var url = "../data/" + name + ".json";
      var res = await fetch(url);
      if (!res.ok) {
        throw new Error("Could not load " + url + " (" + res.status + "). Serve the repo over HTTP, not file://.");
      }
      return res.json();
    },

    initChart(selector, theme) {
      var el = document.querySelector(selector);
      if (!el) {
        throw new Error("Missing chart mount: " + selector);
      }
      return echarts.init(el, theme || "dark");
    },

    bindResize: function (chart) {
      window.addEventListener("resize", function () {
        chart.resize();
      });
    },

    fail: function (statusSelector, error) {
      var node = document.querySelector(statusSelector);
      var message = error && error.message ? error.message : String(error);
      if (node) {
        node.textContent = message;
      }
      console.error(error);
    },

    setStatus: function (statusSelector, text) {
      var node = document.querySelector(statusSelector);
      if (node) {
        node.textContent = text || "";
      }
    },

    pairsToScatter: function (rows, xKey, yKey) {
      return rows.map(function (row) {
        return [row[xKey], row[yKey]];
      });
    }
  };

  global.FootExamples = FootExamples;
})(window);
