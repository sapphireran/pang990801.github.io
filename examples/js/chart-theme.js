(function (global) {
  var colors = {
    girl: "#ff6b8a",
    boy: "#3deaff",
    girlScatter: "#ff4f3b",
    boyScatter: "#ffe01f",
    gap: "#3deaff",
    accent: "#2fd3c5",
    axis: "#9eb3c6",
    split: "rgba(158, 179, 198, 0.18)",
    radar: ["#00c2ff", "#f9cf67", "#32CD32", "#e92b77"],
    pressure: ["#c084fc", "#ff733f"],
    thickness: ["#ff9080", "#00bfb7", "#28ffb3"],
    pie: ["#56c979", "#5CAFF2", "#B6A2DF", "#a96ec9", "#2DC7C9"]
  };

  function showError(message) {
    var host = document.querySelector(".chart-well") || document.body;
    var box = document.createElement("div");
    box.className = "error";
    box.textContent = message;
    host.insertBefore(box, host.firstChild);
  }

  function fetchJson(path) {
    return fetch(path).then(function (res) {
      if (!res.ok) {
        throw new Error("HTTP " + res.status + " for " + path);
      }
      return res.json();
    }).catch(function (err) {
      showError("无法加载 " + path + "。请用静态服务器打开（不要用 file://）。" + (err && err.message ? " " + err.message : ""));
      throw err;
    });
  }

  function baseText() {
    return { color: colors.axis, fontSize: 12 };
  }

  function darkOption(extra) {
    var option = {
      backgroundColor: "rgba(16, 27, 43, 0.2)",
      textStyle: baseText(),
      tooltip: { trigger: "axis" },
      legend: { textStyle: { color: "#e8f4f8" } },
      grid: { left: 48, right: 36, top: 56, bottom: 48, containLabel: true }
    };
    Object.keys(extra || {}).forEach(function (key) {
      option[key] = extra[key];
    });
    return option;
  }

  function mount(id, option) {
    var el = document.getElementById(id);
    if (!el) {
      showError("缺少图表容器 #" + id);
      return null;
    }
    var chart = echarts.init(el, null, { renderer: "canvas" });
    chart.setOption(option);
    window.addEventListener("resize", function () {
      chart.resize();
    });
    el.__chart = chart;
    return chart;
  }

  function stats(points, key) {
    var values = points.map(function (p) { return p[key]; }).sort(function (a, b) { return a - b; });
    var n = values.length;
    var sum = values.reduce(function (a, b) { return a + b; }, 0);
    return {
      n: n,
      min: values[0],
      max: values[n - 1],
      mean: Math.round((sum / n) * 100) / 100
    };
  }

  function fillStats(map) {
    Object.keys(map).forEach(function (id) {
      var node = document.getElementById(id);
      if (node) node.textContent = map[id];
    });
  }

  global.FootTheme = {
    colors: colors,
    fetchJson: fetchJson,
    darkOption: darkOption,
    mount: mount,
    stats: stats,
    fillStats: fillStats,
    showError: showError
  };
})(window);
