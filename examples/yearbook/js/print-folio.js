(function () {
  const pack = Desk.pack();
  const growth = Desk.chart("#miniGrowth");
  const radarChart = Desk.chart("#miniRadar");

  growth.setOption(Object.assign(Desk.darkBase(), {
    title: { text: "foot length 6–14", textStyle: { color: "#f4efe4", fontSize: 14 } },
    xAxis: { type: "category", data: pack.ageFoot.ages.map(String) },
    yAxis: { min: 17, max: 24 },
    series: [
      { type: "bar", data: pack.ageFoot.girls_cm, itemStyle: { color: "#ff7a6a" } },
      { type: "bar", data: pack.ageFoot.boys_cm, itemStyle: { color: "#7fd0ff" } },
    ],
  }));

  radarChart.setOption(Object.assign(Desk.darkBase(), {
    title: { text: "radar 9–12 relative", textStyle: { color: "#f4efe4", fontSize: 14 } },
    radar: {
      indicator: pack.radar.dimensions_en.map(function (name) { return { name: name, max: 100 }; }),
      axisName: { color: "#f4efe4", fontSize: 10 },
    },
    series: pack.radar.series.map(function (row, index) {
      const palette = ["#7fd0ff", "#e6b35a", "#7dcaa2", "#ff7a6a"];
      return {
        type: "radar",
        name: String(row.age),
        data: [{ value: row.values }],
        lineStyle: { color: palette[index] },
        itemStyle: { color: palette[index] },
        areaStyle: { opacity: 0.08, color: palette[index] },
      };
    }),
  }));

  function fillTable() {
    const lang = Desk.currentLang();
    const stats = pack.stats;
    const rows = lang === "en"
      ? [
        ["Scatter n", stats.height_shoe.n_girls + " girls / " + stats.height_shoe.n_boys + " boys"],
        ["Pooled r / r²", stats.height_shoe.all.r + " / " + stats.height_shoe.all.r2],
        ["Pooled slope", stats.height_shoe.all.slope + " cm shoe / cm height"],
        ["Foot-length gain 6→14", "girls " + stats.age_foot_length.girl_gain_cm + " cm / boys " + stats.age_foot_length.boy_gain_cm + " cm"],
        ["Crossover age", String(stats.age_foot_length.crossover_age)],
        ["Same-feet 2 → 14", stats.symmetry.age2_same_pct + "% → " + stats.symmetry.age14_same_pct + "% (formula)"],
        ["Radar sums 9–12", "256 / 307 / 391 / 475"],
        ["Leftovers", "draw1.js pressure, draw2.js thickness, china.js map — not mounted"],
      ]
      : [
        ["散点人数", "女 " + stats.height_shoe.n_girls + " / 男 " + stats.height_shoe.n_boys],
        ["合并 r / r²", stats.height_shoe.all.r + " / " + stats.height_shoe.all.r2],
        ["合并斜率", stats.height_shoe.all.slope + " cm 鞋长 / cm 身高"],
        ["6→14 脚长增量", "女 " + stats.age_foot_length.girl_gain_cm + " cm / 男 " + stats.age_foot_length.boy_gain_cm + " cm"],
        ["交叉年龄", String(stats.age_foot_length.crossover_age)],
        ["相同脚 2→14", stats.symmetry.age2_same_pct + "% → " + stats.symmetry.age14_same_pct + "%（公式）"],
        ["雷达轴分之和 9–12", "256 / 307 / 391 / 475"],
        ["遗稿", "draw1 足压、draw2 厚度、china 地图 — 未挂载"],
      ];
    document.getElementById("summary").innerHTML = rows.map(function (row) {
      return "<tr><th>" + row[0] + "</th><td>" + row[1] + "</td></tr>";
    }).join("");
  }

  document.getElementById("print").addEventListener("click", function () {
    window.print();
  });
  document.querySelector("[data-lang-toggle]").addEventListener("click", function () {
    setTimeout(fillTable, 0);
  });
  fillTable();
})();
