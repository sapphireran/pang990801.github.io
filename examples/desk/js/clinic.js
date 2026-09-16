(function () {
  var desk = Desk.data();
  var cards = desk.clinic;
  var list = document.getElementById("clinic-cards");
  var detail = document.getElementById("clinic-detail");
  var chart = Desk.init("#clinic-chart");
  var current = 0;

  function seriesFor(panel) {
    if (panel === "height-shoe") {
      return {
        xAxis: Object.assign(Desk.axis("身高 cm"), { type: "value", scale: true }),
        yAxis: Object.assign(Desk.axis("鞋码轴 cm"), { type: "value", scale: true }),
        series: [
          { type: "scatter", data: desk.heightShoe.female.slice(0, 80), symbolSize: 4, itemStyle: { color: Desk.rose }, name: "女·抽样" },
          { type: "scatter", data: desk.heightShoe.male.slice(0, 80), symbolSize: 4, itemStyle: { color: Desk.teal }, name: "男·抽样" }
        ]
      };
    }
    if (panel === "bmi-ratio") {
      return {
        xAxis: Object.assign(Desk.axis("BMI"), { type: "category", data: desk.bmiRatio.bmi.map(String) }),
        yAxis: Object.assign(Desk.axis("胖瘦度"), { type: "value", min: 20 }),
        series: [
          { type: "line", data: desk.bmiRatio.girls, name: "女", itemStyle: { color: Desk.rose } },
          { type: "line", data: desk.bmiRatio.boys, name: "男", itemStyle: { color: Desk.teal } }
        ]
      };
    }
    if (panel === "radar") {
      return {
        radar: {
          indicator: desk.radar.indicators.map(function (n) { return { name: n, max: 100 }; }),
          axisName: { color: Desk.cream }
        },
        xAxis: undefined,
        yAxis: undefined,
        series: [{
          type: "radar",
          data: [
            { name: "9岁", value: desk.radar.series["9岁"] },
            { name: "12岁", value: desk.radar.series["12岁"] }
          ]
        }]
      };
    }
    if (panel === "symmetry") {
      var first = desk.symmetry.rows[0];
      var last = desk.symmetry.rows[desk.symmetry.rows.length - 1];
      return {
        xAxis: Object.assign(Desk.axis(""), { type: "category", data: ["2岁相同", "14岁相同"] }),
        yAxis: Object.assign(Desk.axis("公式份额"), { type: "value" }),
        series: [{ type: "bar", data: [first.same, last.same], itemStyle: { color: Desk.amber } }]
      };
    }
    return {
      xAxis: Object.assign(Desk.axis("位点"), { type: "category", data: desk.pressure.sites }),
      yAxis: Object.assign(Desk.axis("底稿数值"), { type: "value" }),
      series: [
        { type: "line", data: desk.pressure.normal, name: "正常人群", itemStyle: { color: Desk.teal } },
        { type: "line", data: desk.pressure.diabetic_foot, name: "糖尿病足人群", itemStyle: { color: Desk.rose } }
      ]
    };
  }

  function render() {
    list.innerHTML = "";
    cards.forEach(function (card, i) {
      var el = document.createElement("article");
      el.className = "card clinic-card" + (i === current ? " is-on" : "");
      el.innerHTML = "<div class=\"kicker\">" + card.panel + "</div><h3>" + card.title + "</h3><p>" + card.wrong + "</p>";
      el.addEventListener("click", function () {
        current = i;
        render();
      });
      list.appendChild(el);
    });

    var card = cards[current];
    detail.innerHTML =
      "<h3>" + card.title + "</h3>" +
      "<p class=\"warn\"><strong>滑倒：</strong> " + card.wrong + "</p>" +
      "<p class=\"good\"><strong>夜读：</strong> " + card.desk + "</p>";

    var spec = seriesFor(card.panel);
    var option = {
      backgroundColor: "transparent",
      legend: { textStyle: { color: Desk.cream } },
      tooltip: {},
      grid: { left: 52, right: 20, top: 32, bottom: 40 },
      series: spec.series
    };
    if (spec.radar) option.radar = spec.radar;
    if (spec.xAxis) option.xAxis = spec.xAxis;
    if (spec.yAxis) option.yAxis = spec.yAxis;
    chart.setOption(option, true);
  }

  render();
})();
