(function () {
  var age = Desk.data().ageFoot;
  var chart = Desk.init("#cross-chart");
  var mark = age.first_age_boys_longer;

  chart.setOption({
    backgroundColor: "transparent",
    legend: { textStyle: { color: Desk.cream } },
    tooltip: { trigger: "axis" },
    grid: { left: 52, right: 48, top: 36, bottom: 40 },
    xAxis: Object.assign(Desk.axis("年龄"), { type: "category", data: age.ages.map(String) }),
    yAxis: [
      Object.assign(Desk.axis("脚长 cm"), { type: "value", min: 17 }),
      Object.assign(Desk.axis("女−男 cm"), { type: "value" })
    ],
    series: [
      { name: "女孩", type: "bar", data: age.girls_cm, itemStyle: { color: Desk.rose } },
      { name: "男孩", type: "bar", data: age.boys_cm, itemStyle: { color: Desk.teal } },
      {
        name: "女−男",
        type: "line",
        yAxisIndex: 1,
        data: age.girls_minus_boys_cm,
        itemStyle: { color: Desk.amber },
        lineStyle: { color: Desk.amber, width: 2 },
        markLine: {
          symbol: "none",
          label: { color: Desk.amber, formatter: "交叉 " + mark + " 岁" },
          lineStyle: { color: Desk.amber },
          data: [{ xAxis: String(mark) }]
        }
      }
    ]
  });

  var body = document.querySelector("#cross-table tbody");
  body.innerHTML = age.ages
    .map(function (yr, i) {
      var flag = yr === mark ? " 交叉" : "";
      return (
        "<tr><td>" +
        yr +
        "</td><td>" +
        age.girls_cm[i] +
        "</td><td>" +
        age.boys_cm[i] +
        "</td><td>" +
        age.girls_minus_boys_cm[i] +
        flag +
        "</td></tr>"
      );
    })
    .join("");
})();
