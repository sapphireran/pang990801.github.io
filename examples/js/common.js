(function (global) {
  var charts = [];

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function requireData(name) {
    var store = global.ExampleData || {};
    if (!store[name]) {
      throw new Error("Missing ExampleData." + name + " — load examples/data first");
    }
    return store[name];
  }

  function bindChartResize(chart) {
    charts.push(chart);
  }

  window.addEventListener("resize", function () {
    charts.forEach(function (chart) {
      chart.resize();
    });
  });

  function setText(selector, value) {
    var node = $(selector);
    if (node) {
      node.textContent = value;
    }
  }

  function fillTable(table, headers, rows) {
    if (!table) {
      return;
    }
    var thead = headers
      .map(function (header) {
        return "<th>" + header + "</th>";
      })
      .join("");
    var body = rows
      .map(function (row) {
        return (
          "<tr>" +
          row
            .map(function (cell, index) {
              var klass = index === 0 || typeof cell === "string" ? "" : ' class="num"';
              return "<td" + klass + ">" + cell + "</td>";
            })
            .join("") +
          "</tr>"
        );
      })
      .join("");
    table.innerHTML = "<thead><tr>" + thead + "</tr></thead><tbody>" + body + "</tbody>";
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function wireToggles(rootSelector, onChange) {
    var root = $(rootSelector);
    if (!root) {
      return;
    }
    root.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-value]");
      if (!button) {
        return;
      }
      root.querySelectorAll("button").forEach(function (node) {
        node.classList.toggle("is-active", node === button);
      });
      onChange(button.getAttribute("data-value"));
    });
  }

  function mean(values) {
    if (!values.length) {
      return 0;
    }
    var total = values.reduce(function (sum, value) {
      return sum + value;
    }, 0);
    return total / values.length;
  }

  function formatNumber(value, digits) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return String(value);
    }
    return value.toFixed(digits);
  }

  global.ExampleCommon = {
    $: $,
    requireData: requireData,
    bindChartResize: bindChartResize,
    setText: setText,
    fillTable: fillTable,
    onReady: onReady,
    wireToggles: wireToggles,
    mean: mean,
    formatNumber: formatNumber,
  };
})(window);
