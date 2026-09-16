(function (global) {
  var teal = "#2ee0d0";
  var coral = "#ff6b6b";
  var gold = "#f4c15d";
  var blue = "#5cafff";
  var pink = "#ff8ac7";

  function axis() {
    return {
      axisLine: { lineStyle: { color: "rgba(158, 201, 208, 0.55)" } },
      axisLabel: { color: "#c9e3e7" },
      splitLine: { lineStyle: { color: "rgba(140, 210, 220, 0.12)" } },
      nameTextStyle: { color: "#9bb7be" },
    };
  }

  global.FOOT_THEME = {
    colors: [coral, gold, teal, blue, pink, "#9b8cff"],
    baseOption: function () {
      return {
        backgroundColor: "rgba(0, 0, 0, 0)",
        color: [coral, gold, teal, blue, pink, "#9b8cff"],
        textStyle: { color: "#e7f4f6" },
        legend: { textStyle: { color: "#e7f4f6" }, top: 8 },
        tooltip: { trigger: "axis" },
        grid: { left: 48, right: 28, top: 56, bottom: 48, containLabel: true },
      };
    },
    valueAxis: function (name) {
      return Object.assign(axis(), { type: "value", name: name || "" });
    },
    categoryAxis: function (data, name) {
      return Object.assign(axis(), {
        type: "category",
        data: data || [],
        name: name || "",
      });
    },
    bindResize: function (chart) {
      window.addEventListener("resize", function () {
        chart.resize();
      });
    },
  };
})(window);
