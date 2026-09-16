(function () {
  Blueprint.mount({
    kind: "examples",
    base: ".",
    docBase: "../../docs/blueprint",
    dashboard: "../../index.html",
    active: "leftover"
  });

  var P = Blueprint.payload();
  var f = Blueprint.fmt;
  var chart = echarts.init(document.getElementById("resid"));
  var girl = P.residuals.girl.map(function (r) {
    return { value: [r.height_cm, r.residual_cm], raw: r, sex: "girl" };
  });
  var boy = P.residuals.boy.map(function (r) {
    return { value: [r.height_cm, r.residual_cm], raw: r, sex: "boy" };
  });

  function show(item) {
    var r = item.raw;
    var sex = item.sex;
    var obs = Blueprint.convertSizes(r.shoe_cm * 10, 12);
    var mid = Blueprint.convertSizes(r.predicted_cm * 10, 12);
    Blueprint.$("#pick").innerHTML =
      (sex === "girl" ? "女童" : "男童") +
      " · 身高 " + f(r.height_cm, 2) +
      " cm · 鞋长 " + f(r.shoe_cm, 2) +
      " cm · 残差 " + (r.residual_cm >= 0 ? "+" : "") + f(r.residual_cm, 2) + " cm。";
    Blueprint.fillTable(Blueprint.$("#pick-table"),
      ["", "按实测", "按中线", "差"],
      [
        ["Mondopoint", obs.mondopoint, mid.mondopoint, obs.mondopoint - mid.mondopoint],
        ["中国号", f(obs.cn_hao, 1), f(mid.cn_hao, 1), f(obs.cn_hao - mid.cn_hao, 1)],
        ["EU @12mm", f(obs.eu, 2), f(mid.eu, 2), f(obs.eu - mid.eu, 2)],
        ["UK 童", f(obs.uk_kids, 2), f(mid.uk_kids, 2), f(obs.uk_kids - mid.uk_kids, 2)]
      ]);
  }

  chart.setOption({
    backgroundColor: "transparent",
    tooltip: {
      formatter: function (p) {
        return p.seriesName + "<br/>身高 " + p.value[0] + " · 残差 " + f(p.value[1], 2) + " cm";
      }
    },
    legend: { data: ["女童残差", "男童残差"], textStyle: { color: "#d7ecff" } },
    grid: { left: 52, right: 20, top: 36, bottom: 40 },
    xAxis: { name: "身高 cm", min: 74, max: 156 },
    yAxis: { name: "残差 cm", min: -5, max: 5 },
    series: [
      { name: "女童残差", type: "scatter", symbolSize: 7, itemStyle: { color: "#ff9ec8" }, data: girl },
      { name: "男童残差", type: "scatter", symbolSize: 7, itemStyle: { color: "#7fd3ff" }, data: boy },
      { name: "零线", type: "line", showSymbol: false, data: [[74, 0], [156, 0]], lineStyle: { color: "#ffb86b", type: "dashed" } }
    ]
  });

  chart.on("click", function (ev) {
    if (!ev.data || !ev.data.raw) return;
    show(ev.data);
  });
  window.addEventListener("resize", function () { chart.resize(); });
})();
