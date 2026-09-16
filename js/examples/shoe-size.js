(function () {
  var chart;
  var data;
  var heightInput = document.getElementById("height");
  var heightOut = document.getElementById("height-out");
  var sexSelect = document.getElementById("sex");
  var predEl = document.getElementById("pred");
  var bandEl = document.getElementById("band");
  var r2El = document.getElementById("r2");

  function predict(sex, height) {
    var fit = data.series[sex].fit;
    return fit.slope * height + fit.intercept;
  }

  function residualStd(sex) {
    var fit = data.series[sex].fit;
    var points = data.series[sex].points;
    var ss = 0;
    points.forEach(function (p) {
      var e = p.shoeLength - (fit.slope * p.height + fit.intercept);
      ss += e * e;
    });
    return Math.sqrt(ss / (points.length - 2));
  }

  function scatter(sex, color) {
    return data.series[sex].points.map(function (p) {
      return {
        value: [p.height, p.shoeLength],
        itemStyle: { color: color }
      };
    });
  }

  function fitLine(sex) {
    var fit = data.series[sex].fit;
    return [
      [fit.heightMin, fit.slope * fit.heightMin + fit.intercept],
      [fit.heightMax, fit.slope * fit.heightMax + fit.intercept]
    ];
  }

  function updateReadout() {
    var sex = sexSelect.value;
    var h = Number(heightInput.value);
    var yhat = predict(sex, h);
    var sd = residualStd(sex);
    heightOut.textContent = h.toFixed(0) + " cm";
    predEl.textContent = yhat.toFixed(2) + " cm";
    bandEl.textContent = "± " + (1.96 * sd).toFixed(2) + " cm";
    r2El.textContent = data.series[sex].fit.r2.toFixed(3);
    if (!chart) {
      return;
    }
    chart.setOption({
      series: [{}, {}, {}, {}, {
        data: [[h, yhat]]
      }]
    });
  }

  function draw() {
    chart.setOption({
      backgroundColor: "transparent",
      tooltip: {
        formatter: function (p) {
          if (!p.value) {
            return p.seriesName;
          }
          return p.seriesName + "<br/>身高 " + p.value[0] + " cm<br/>鞋长 " + Number(p.value[1]).toFixed(2) + " cm";
        }
      },
      legend: { textStyle: { color: "#d7e6f2" }, data: ["女生", "男生", "女拟合", "男拟合", "当前估计"] },
      grid: { left: 56, right: 24, top: 48, bottom: 48 },
      xAxis: {
        name: "身高 cm",
        type: "value",
        scale: true,
        axisLabel: { color: "#d7e6f2" },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.06)" } }
      },
      yAxis: {
        name: "鞋长 cm",
        type: "value",
        scale: true,
        axisLabel: { color: "#d7e6f2" },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.06)" } }
      },
      series: [
        { name: "女生", type: "scatter", symbolSize: 5, data: scatter("female", "#ff4f3b") },
        { name: "男生", type: "scatter", symbolSize: 5, data: scatter("male", "#ffe01f") },
        { name: "女拟合", type: "line", showSymbol: false, data: fitLine("female"), lineStyle: { color: "#ff4f3b", width: 2 } },
        { name: "男拟合", type: "line", showSymbol: false, data: fitLine("male"), lineStyle: { color: "#ffe01f", width: 2 } },
        {
          name: "当前估计",
          type: "scatter",
          symbolSize: 16,
          data: [[Number(heightInput.value), predict(sexSelect.value, Number(heightInput.value))]],
          itemStyle: { color: "#3deaff", borderColor: "#fff", borderWidth: 1 }
        }
      ]
    });
  }

  FootData.load("height-shoe-size").then(function (pack) {
    data = pack;
    heightInput.min = Math.floor(Math.min(pack.series.female.fit.heightMin, pack.series.male.fit.heightMin));
    heightInput.max = Math.ceil(Math.max(pack.series.female.fit.heightMax, pack.series.male.fit.heightMax));
    chart = echarts.init(document.getElementById("shoe-chart"), "dark");
    draw();
    updateReadout();
    window.addEventListener("resize", function () { chart.resize(); });
    heightInput.addEventListener("input", updateReadout);
    sexSelect.addEventListener("change", updateReadout);
  }).catch(function (err) {
    document.getElementById("shoe-chart").textContent = err.message;
  });
})();
