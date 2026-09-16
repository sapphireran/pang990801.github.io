(function () {
  var desk = Desk.data();
  var f = desk.stats.female_ols;
  var m = desk.stats.male_ols;
  var rows = [
    ["女散点 n", f.n],
    ["男散点 n", m.n],
    ["女身高均值", Desk.fmt(f.mean_x) + " cm"],
    ["男身高均值", Desk.fmt(m.mean_x) + " cm"],
    ["女鞋码轴均值", Desk.fmt(f.mean_y) + " cm"],
    ["男鞋码轴均值", Desk.fmt(m.mean_y) + " cm"],
    ["女 OLS 斜率", Desk.fmt(f.slope, 4)],
    ["男 OLS 斜率", Desk.fmt(m.slope, 4)],
    ["女 r²", Desk.fmt(f.r2, 3)],
    ["男 r²", Desk.fmt(m.r2, 3)],
    ["女 RMSE", Desk.fmt(f.rmse, 3) + " cm"],
    ["男 RMSE", Desk.fmt(m.rmse, 3) + " cm"],
    ["女身高 P10 / P50 / P90", [desk.stats.height_percentiles.female_p10, desk.stats.height_percentiles.female_p50, desk.stats.height_percentiles.female_p90].join(" / ")],
    ["男身高 P10 / P50 / P90", [desk.stats.height_percentiles.male_p10, desk.stats.height_percentiles.male_p50, desk.stats.height_percentiles.male_p90].join(" / ")],
    ["男孩脚长反超年龄", desk.stats.age_crossover.first_age_boys_longer + " 岁"],
    ["该岁女孩 / 男孩", desk.stats.age_crossover.girl_at_that_age + " / " + desk.stats.age_crossover.boy_at_that_age + " cm"],
    ["过瘦环", Desk.fmt(desk.stats.pie_shares.thin_ring * 100, 1) + "%"],
    ["过胖环", Desk.fmt(desk.stats.pie_shares.wide_ring * 100, 1) + "%"],
    ["12 岁雷达鞋码/脚长", desk.radar.series["12岁"][4] + " / " + desk.radar.series["12岁"][5]],
    ["误读卡片", desk.clinic.length]
  ];

  document.querySelector("#folio-table tbody").innerHTML = rows
    .map(function (row) {
      return "<tr><th>" + row[0] + "</th><td>" + row[1] + "</td></tr>";
    })
    .join("");

  var spark = Desk.init("#folio-spark");
  spark.setOption({
    backgroundColor: "transparent",
    legend: { textStyle: { color: Desk.cream } },
    tooltip: { trigger: "axis" },
    grid: { left: 48, right: 16, top: 28, bottom: 32 },
    xAxis: Object.assign(Desk.axis(""), { type: "category", data: desk.ageFoot.ages.map(String) }),
    yAxis: Object.assign(Desk.axis("脚长 cm"), { type: "value", min: 17 }),
    series: [
      { name: "女", type: "line", data: desk.ageFoot.girls_cm, itemStyle: { color: Desk.rose } },
      { name: "男", type: "line", data: desk.ageFoot.boys_cm, itemStyle: { color: Desk.teal } }
    ]
  });
})();
