(function () {
  const pack = Desk.pack();
  const pressure = pack.pressure;
  const thickness = pack.thickness;
  const pChart = Desk.chart("#pressureChart");
  const tChart = Desk.chart("#thicknessChart");

  pChart.setOption(Object.assign(Desk.darkBase(), {
    legend: { data: ["typical", "diabetic-foot sketch"], textStyle: { color: "#f4efe4" } },
    xAxis: { type: "category", data: pressure.sites },
    yAxis: { type: "value", name: "Pa" },
    series: [
      { name: "typical", type: "line", smooth: true, symbol: "circle", data: pressure.normal, itemStyle: { color: "#7fd0ff" } },
      { name: "diabetic-foot sketch", type: "line", smooth: true, symbol: "circle", data: pressure.diabetic_foot, itemStyle: { color: "#d86a5a" } },
    ],
  }));

  tChart.setOption(Object.assign(Desk.darkBase(), {
    legend: { data: ["adult typical mm", "adult sketch mm", "delta μm"], textStyle: { color: "#f4efe4" } },
    xAxis: { type: "category", data: thickness.sites, axisLabel: { interval: 0 } },
    yAxis: [
      { type: "value", name: "mm" },
      { type: "value", name: "μm" },
    ],
    series: [
      { name: "adult typical mm", type: "bar", data: thickness.normal_mm, itemStyle: { color: "#ff9078" } },
      { name: "adult sketch mm", type: "bar", data: thickness.diabetic_mm, itemStyle: { color: "#00bfb7" } },
      { name: "delta μm", type: "line", yAxisIndex: 1, data: thickness.delta_um, itemStyle: { color: "#7dcaa2" } },
    ],
  }));

  function notes() {
    const lang = Desk.currentLang();
    document.getElementById("pressureNote").textContent = lang === "en"
      ? "Largest typical site is 位点五 (120 Pa). The leftover legend also names 潍V with no series. Desk sketch only."
      : "正常人最高点在位点五（120 Pa）。遗稿图例还有未配序列的“潍V”。只是书桌草图。";
    document.getElementById("thicknessNote").textContent = lang === "en"
      ? "Fourteen adult sites. Delta is labeled um in draw2.js. Not part of the children’s homepage."
      : "十四处成年位点。差值在 draw2.js 里写成 um。不是儿童首页的一部分。";
  }

  document.querySelector("[data-lang-toggle]").addEventListener("click", function () {
    setTimeout(notes, 0);
  });
  notes();
})();
