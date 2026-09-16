/**
 * Fetch JSON and mount an ECharts instance for the example pages.
 */
(function (root) {
  function el(id) {
    var node = document.getElementById(id);
    if (!node) throw new Error("missing #" + id);
    return node;
  }

  function setStatus(message, isError) {
    var node = document.getElementById("status");
    if (!node) return;
    node.textContent = message;
    node.className = isError ? "status error" : "status";
  }

  function fetchJson(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) {
        throw new Error("Could not load " + url + " (" + res.status + "). Serve the repo over HTTP.");
      }
      return res.json();
    });
  }

  function mountChart(domId, option, theme) {
    var chart = echarts.init(el(domId), theme || "dark");
    chart.setOption(option);
    window.addEventListener("resize", function () {
      chart.resize();
    });
    return chart;
  }

  function boot(opts) {
    setStatus("Loading " + opts.dataUrl + " …");
    return fetchJson(opts.dataUrl)
      .then(function (data) {
        var option = opts.buildOption(data);
        var chart = mountChart(opts.chartId || "chart", option, opts.theme);
        if (typeof opts.after === "function") {
          opts.after(data, chart, option);
        }
        setStatus("Loaded " + opts.dataUrl);
        return { data: data, chart: chart, option: option };
      })
      .catch(function (err) {
        setStatus(err.message, true);
        throw err;
      });
  }

  function fillTable(tableId, headers, rows) {
    var table = el(tableId);
    var thead = "<thead><tr>" + headers.map(function (h) {
      return "<th>" + h + "</th>";
    }).join("") + "</tr></thead>";
    var tbody = "<tbody>" + rows.map(function (row) {
      return "<tr>" + row.map(function (cell) {
        return "<td>" + cell + "</td>";
      }).join("") + "</tr>";
    }).join("") + "</tbody>";
    table.innerHTML = thead + tbody;
  }

  function setText(id, text) {
    el(id).textContent = text;
  }

  root.ExampleBoot = {
    boot: boot,
    fetchJson: fetchJson,
    mountChart: mountChart,
    fillTable: fillTable,
    setText: setText,
    setStatus: setStatus,
  };
})(window);
