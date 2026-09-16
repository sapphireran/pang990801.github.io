(function () {
  Blueprint.mount({
    kind: "examples",
    base: ".",
    docBase: "../../docs/blueprint",
    dashboard: "../../index.html",
    active: "atlas"
  });

  var P = Blueprint.payload();
  var f = Blueprint.fmt;
  var ageChart = echarts.init(document.getElementById("age-chart"));
  var binChart = echarts.init(document.getElementById("bin-chart"));
  var sel = Blueprint.$("#bin-select");
  var sexEl = Blueprint.$("#bin-sex");

  P.height_bins.forEach(function (bin, i) {
    var opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = bin.bin_cm + " cm";
    if (bin.lo === 115) opt.selected = true;
    sel.appendChild(opt);
  });

  ageChart.setOption({
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },
    legend: { data: ["女童脚长", "男童脚长", "女 Δ", "男 Δ"], textStyle: { color: "#d7ecff" } },
    grid: { left: 48, right: 48, top: 36, bottom: 36 },
    xAxis: { type: "category", data: P.age_foot_length.map(function (r) { return r.age; }) },
    yAxis: [
      { name: "cm", min: 17, max: 24 },
      { name: "Δ cm", min: -1, max: 2 }
    ],
    series: [
      { name: "女童脚长", type: "bar", data: P.age_foot_length.map(function (r) { return r.girl_cm; }), itemStyle: { color: "#ff9ec8" } },
      { name: "男童脚长", type: "bar", data: P.age_foot_length.map(function (r) { return r.boy_cm; }), itemStyle: { color: "#7fd3ff" } },
      { name: "女 Δ", type: "line", yAxisIndex: 1, data: P.age_foot_length.map(function (r) { return r.girl_velocity_cm; }), itemStyle: { color: "#ffb86b" } },
      { name: "男 Δ", type: "line", yAxisIndex: 1, data: P.age_foot_length.map(function (r) { return r.boy_velocity_cm; }), itemStyle: { color: "#3ad6c4" } }
    ]
  });

  function renderBin() {
    var bin = P.height_bins[Number(sel.value)];
    var sex = sexEl.value;
    var g = bin.groups[sex];
    var copy = Blueprint.$("#bin-copy");
    if (!g || !g.n) {
      copy.textContent = "这个箱子是空的。";
      binChart.clear();
      return;
    }
    copy.textContent = (sex === "boy" ? "男童 " : "女童 ") + bin.bin_cm +
      " cm：n=" + g.n + "，p10=" + g.p10 + "，p50=" + g.p50 + "，p90=" + g.p90 +
      "。交叉年龄是 " + P.stats.crossover_age + " 岁（均值曲线，不是这个箱子）。";

    var girl = P.height_bins.map(function (b) { return b.groups.girl.n ? b.groups.girl.p50 : null; });
    var boy = P.height_bins.map(function (b) { return b.groups.boy.n ? b.groups.boy.p50 : null; });
    var p10 = P.height_bins.map(function (b) { return b.groups[sex].n ? b.groups[sex].p10 : null; });
    var p90 = P.height_bins.map(function (b) { return b.groups[sex].n ? b.groups[sex].p90 : null; });

    binChart.setOption({
      backgroundColor: "transparent",
      tooltip: { trigger: "axis" },
      legend: { data: ["女 p50", "男 p50", "本组 p10", "本组 p90"], textStyle: { color: "#d7ecff" } },
      grid: { left: 48, right: 20, top: 36, bottom: 40 },
      xAxis: { type: "category", data: P.height_bins.map(function (b) { return b.bin_cm; }), axisLabel: { rotate: 40 } },
      yAxis: { name: "鞋长 cm", min: 9, max: 25 },
      series: [
        { name: "女 p50", type: "line", data: girl, itemStyle: { color: "#ff9ec8" } },
        { name: "男 p50", type: "line", data: boy, itemStyle: { color: "#7fd3ff" } },
        { name: "本组 p10", type: "line", data: p10, lineStyle: { type: "dashed", color: "#ffb86b" } },
        { name: "本组 p90", type: "line", data: p90, lineStyle: { type: "dashed", color: "#ffb86b" } }
      ]
    });
  }

  sel.addEventListener("change", renderBin);
  sexEl.addEventListener("change", renderBin);
  window.addEventListener("resize", function () {
    ageChart.resize();
    binChart.resize();
  });
  renderBin();
})();
