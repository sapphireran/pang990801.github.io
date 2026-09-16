(function () {
  var desk = Desk.data();
  var female = desk.heightShoe.female;
  var male = desk.heightShoe.male;
  var femaleFit = Desk.ols(female);
  var maleFit = Desk.ols(male);
  var show = { female: true, male: true };

  var fitChart = Desk.init("#fit-chart");
  var residChart = Desk.init("#resid-chart");
  var histChart = Desk.init("#hist-chart");

  function linePoints(points, fit) {
    var xs = points.map(function (p) { return p[0]; });
    var lo = Math.min.apply(null, xs);
    var hi = Math.max.apply(null, xs);
    return [
      [lo, fit.intercept + fit.slope * lo],
      [hi, fit.intercept + fit.slope * hi]
    ];
  }

  function fillStats() {
    var rows = [];
    if (show.female) rows.push(["女", femaleFit]);
    if (show.male) rows.push(["男", maleFit]);
    var body = document.querySelector("#fit-table tbody");
    body.innerHTML = rows
      .map(function (row) {
        var fit = row[1];
        return (
          "<tr><td>" +
          row[0] +
          "</td><td>" +
          Desk.fmt(fit.slope, 4) +
          "</td><td>" +
          Desk.fmt(fit.intercept, 3) +
          "</td><td>" +
          Desk.fmt(fit.r2, 3) +
          "</td><td>" +
          Desk.fmt(fit.rmse, 3) +
          "</td><td>" +
          fit.n +
          "</td></tr>"
        );
      })
      .join("");
  }

  function renderFit() {
    var series = [];
    if (show.female) {
      series.push(
        { name: "女", type: "scatter", symbolSize: 5, itemStyle: { color: Desk.rose }, data: female },
        { name: "女拟合", type: "line", showSymbol: false, lineStyle: { color: Desk.rose, width: 2 }, data: linePoints(female, femaleFit) }
      );
    }
    if (show.male) {
      series.push(
        { name: "男", type: "scatter", symbolSize: 5, itemStyle: { color: Desk.teal }, data: male },
        { name: "男拟合", type: "line", showSymbol: false, lineStyle: { color: Desk.teal, width: 2 }, data: linePoints(male, maleFit) }
      );
    }
    fitChart.setOption({
      backgroundColor: "transparent",
      legend: { textStyle: { color: Desk.cream }, top: 0 },
      tooltip: {
        formatter: function (p) {
          if (!p.value || p.value.length < 2) return p.name;
          return p.seriesName + "<br/>身高 " + p.value[0] + " cm<br/>标成鞋码 " + p.value[1] + " cm";
        }
      },
      grid: { left: 56, right: 20, top: 36, bottom: 44 },
      xAxis: Object.assign(Desk.axis("身高 cm"), { type: "value", scale: true }),
      yAxis: Object.assign(Desk.axis("鞋码轴（cm）"), { type: "value", scale: true }),
      series: series
    }, true);
  }

  function renderResid() {
    var series = [];
    if (show.female) {
      series.push({
        name: "女残差",
        type: "scatter",
        symbolSize: 5,
        itemStyle: { color: Desk.rose },
        data: Desk.residuals(female, femaleFit)
      });
    }
    if (show.male) {
      series.push({
        name: "男残差",
        type: "scatter",
        symbolSize: 5,
        itemStyle: { color: Desk.teal },
        data: Desk.residuals(male, maleFit)
      });
    }
    residChart.setOption({
      backgroundColor: "transparent",
      legend: { textStyle: { color: Desk.cream }, top: 0 },
      tooltip: { formatter: function (p) { return "身高 " + p.value[0] + " · 残差 " + Desk.fmt(p.value[1], 3) + " cm"; } },
      grid: { left: 56, right: 20, top: 36, bottom: 44 },
      xAxis: Object.assign(Desk.axis("身高 cm"), { type: "value", scale: true }),
      yAxis: Object.assign(Desk.axis("残差 cm"), { type: "value" }),
      series: series.concat([{
        type: "line",
        markLine: {
          symbol: "none",
          lineStyle: { color: Desk.amber, type: "dashed" },
          data: [{ yAxis: 0 }],
          label: { color: Desk.amber }
        },
        data: []
      }])
    }, true);
  }

  function renderHist() {
    var bins = [];
    if (show.female) bins = desk.stats.female_residual_bins;
    if (show.male && !show.female) bins = desk.stats.male_residual_bins;
    if (show.female && show.male) {
      var map = {};
      desk.stats.female_residual_bins.concat(desk.stats.male_residual_bins).forEach(function (b) {
        var key = b.from + ":" + b.to;
        map[key] = map[key] || { from: b.from, to: b.to, count: 0 };
        map[key].count += b.count;
      });
      bins = Object.keys(map).sort(function (a, b) { return map[a].from - map[b].from; }).map(function (k) { return map[k]; });
    }
    histChart.setOption({
      backgroundColor: "transparent",
      tooltip: { trigger: "axis" },
      grid: { left: 48, right: 16, top: 24, bottom: 40 },
      xAxis: Object.assign(Desk.axis("残差区间 cm"), {
        type: "category",
        data: bins.map(function (b) { return b.from + "–" + b.to; })
      }),
      yAxis: Object.assign(Desk.axis("点数"), { type: "value" }),
      series: [{
        type: "bar",
        data: bins.map(function (b) { return b.count; }),
        itemStyle: { color: Desk.amber }
      }]
    }, true);
  }

  function render() {
    renderFit();
    renderResid();
    renderHist();
    fillStats();
  }

  document.querySelectorAll("[data-cloud]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-cloud");
      if (key === "both") {
        show.female = true;
        show.male = true;
      } else {
        show.female = key === "female";
        show.male = key === "male";
      }
      document.querySelectorAll("[data-cloud]").forEach(function (el) {
        el.setAttribute("aria-pressed", String(
          (el.getAttribute("data-cloud") === "both" && show.female && show.male) ||
          (el.getAttribute("data-cloud") === "female" && show.female && !show.male) ||
          (el.getAttribute("data-cloud") === "male" && show.male && !show.female)
        ));
      });
      render();
    });
  });

  render();
})();
