(function () {
  Blueprint.mount({
    kind: "examples",
    base: ".",
    docBase: "../../docs/blueprint",
    dashboard: "../../index.html",
    active: "fitting"
  });

  var chart = echarts.init(document.getElementById("scatter"));
  var sexEl = Blueprint.$("#sex");
  var heightEl = Blueprint.$("#height");
  var f = Blueprint.fmt;

  function render() {
    var sex = sexEl.value;
    var h = Number(heightEl.value);
    Blueprint.$("#height-out").textContent = f(h, 1) + " cm";
    var pred = Blueprint.predictShoe(h, sex);
    var sizes = Blueprint.convertSizes(pred.predicted_cm * 10, 12);
    Blueprint.$("#pred-stats").innerHTML = [
      ["预测鞋长", f(pred.predicted_cm, 2) + " cm", pred.ols.equation],
      ["±1σ", f(pred.low1, 2) + "–" + f(pred.high1, 2), "σ = " + f(pred.resid_sd, 2) + " cm"],
      ["Mondopoint", sizes.mondopoint, "按中线脚长"],
      ["EU @12mm", f(sizes.eu, 2), "楦长 " + f(sizes.last_mm, 0) + " mm"]
    ].map(function (row) {
      return '<div class="card stat"><b>' + row[1] + "</b><span>" + row[0] + " · " + row[2] + "</span></div>";
    }).join("");

    var near = Blueprint.nearestPoints(h, sex, 8);
    Blueprint.fillTable(Blueprint.$("#near"),
      ["身高", "鞋长", "相对中线"],
      near.map(function (p) {
        var r = p.shoe_cm - (pred.ols.intercept + pred.ols.slope * p.height_cm);
        return [f(p.height_cm, 2), f(p.shoe_cm, 2), (r >= 0 ? "+" : "") + f(r, 2) + " cm"];
      }));

    var bin = Blueprint.binForHeight(h);
    var g = bin && bin.groups[sex];
    Blueprint.$("#bin-note").textContent = bin && g && g.n
      ? ("身高箱 " + bin.bin_cm + " cm，" + (sex === "boy" ? "男童" : "女童") + " n=" + g.n +
        "，鞋长 p50=" + g.p50 + " cm，p10–p90 " + g.p10 + "–" + g.p90 + " cm。")
      : "这个身高箱里没有足够的点。";

    var data = Blueprint.payload().height_shoe;
    var girl = data.girl.points.map(function (p) { return [p.height_cm, p.shoe_cm]; });
    var boy = data.boy.points.map(function (p) { return [p.height_cm, p.shoe_cm]; });
    var lineOf = function (ols) {
      return [[ols.x_min, ols.intercept + ols.slope * ols.x_min],
              [ols.x_max, ols.intercept + ols.slope * ols.x_max]];
    };

    chart.setOption({
      backgroundColor: "transparent",
      tooltip: { formatter: function (p) { return p.seriesName + "<br/>" + p.value[0] + " cm, " + p.value[1] + " cm"; } },
      legend: { data: ["女童", "男童", "当前估计"], textStyle: { color: "#d7ecff" } },
      grid: { left: 48, right: 24, top: 36, bottom: 40 },
      xAxis: { name: "身高 cm", min: 74, max: 156, splitLine: { lineStyle: { color: "rgba(127,211,255,0.12)" } } },
      yAxis: { name: "鞋长 cm", min: 9, max: 26, splitLine: { lineStyle: { color: "rgba(127,211,255,0.12)" } } },
      series: [
        { name: "女童", type: "scatter", symbolSize: 5, itemStyle: { color: "#ff9ec8" }, data: girl },
        { name: "男童", type: "scatter", symbolSize: 5, itemStyle: { color: "#7fd3ff" }, data: boy },
        { name: "女童线", type: "line", showSymbol: false, data: lineOf(data.girl.ols), lineStyle: { color: "#ff9ec8", width: 1.5 } },
        { name: "男童线", type: "line", showSymbol: false, data: lineOf(data.boy.ols), lineStyle: { color: "#7fd3ff", width: 1.5 } },
        {
          name: "当前估计",
          type: "scatter",
          symbolSize: 16,
          itemStyle: { color: "#ffb86b", borderColor: "#fff", borderWidth: 1 },
          data: [[h, pred.predicted_cm]]
        },
        {
          name: "±1σ",
          type: "line",
          showSymbol: false,
          data: [[h, pred.low1], [h, pred.high1]],
          lineStyle: { color: "#ffb86b", width: 3 }
        }
      ]
    });
  }

  sexEl.addEventListener("change", render);
  heightEl.addEventListener("input", render);
  window.addEventListener("resize", function () { chart.resize(); });
  render();
})();
