(function () {
  var desk = Desk.data();
  var pressure = Desk.init("#pressure-chart");
  var thickness = Desk.init("#thickness-chart");

  pressure.setOption({
    backgroundColor: "transparent",
    title: { text: desk.pressure.title, textStyle: { color: Desk.cream, fontSize: 14 } },
    legend: { textStyle: { color: Desk.cream }, top: 24 },
    tooltip: { trigger: "axis" },
    grid: { left: 48, right: 16, top: 64, bottom: 36 },
    xAxis: Object.assign(Desk.axis(""), { type: "category", data: desk.pressure.sites }),
    yAxis: Object.assign(Desk.axis("Pa（按原标题）"), { type: "value" }),
    series: [
      { name: "正常人群", type: "line", smooth: true, data: desk.pressure.normal, itemStyle: { color: Desk.teal } },
      { name: "糖尿病足人群", type: "line", smooth: true, data: desk.pressure.diabetic_foot, itemStyle: { color: Desk.rose } }
    ]
  });

  thickness.setOption({
    backgroundColor: "transparent",
    title: { text: desk.thickness.title, textStyle: { color: Desk.cream, fontSize: 14 } },
    legend: { textStyle: { color: Desk.cream }, top: 24 },
    tooltip: { trigger: "axis" },
    grid: { left: 48, right: 16, top: 64, bottom: 36 },
    xAxis: Object.assign(Desk.axis(""), { type: "category", data: desk.thickness.sites }),
    yAxis: Object.assign(Desk.axis("mm / 原差值"), { type: "value" }),
    series: [
      { name: "正常 mm", type: "bar", data: desk.thickness.normal_mm, itemStyle: { color: Desk.rose } },
      { name: "糖尿病足 mm", type: "bar", data: desk.thickness.diabetic_foot_mm, itemStyle: { color: Desk.teal } },
      { name: "差值（按原文 um）", type: "line", data: desk.thickness.delta_um_as_written, itemStyle: { color: Desk.amber } }
    ]
  });

  document.getElementById("thickness-note").textContent = desk.thickness.delta_note;
  document.getElementById("pressure-note").textContent = desk.pressure.population_note;
})();
