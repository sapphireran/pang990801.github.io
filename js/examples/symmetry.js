(function () {
  var chart;
  var data;
  var ageInput = document.getElementById("age");
  var ageOut = document.getElementById("age-out");
  var tableBody = document.getElementById("sym-rows");

  var colors = {
    same: "#56c979",
    leftLarger10to20: "#5CAFF2",
    leftLargerOver20: "#B6A2DF",
    rightLargerOver20: "#a96ec9",
    rightLarger10to20: "#2DC7C9"
  };

  function rowForAge(age) {
    return data.series.filter(function (r) { return r.age === age; })[0];
  }

  function render(age) {
    var row = rowForAge(age);
    ageOut.textContent = row.labelZh;
    var pieData = data.categories.map(function (cat) {
      return {
        name: cat.labelZh,
        value: row.counts[cat.id],
        itemStyle: { color: colors[cat.id] }
      };
    });
    tableBody.innerHTML = data.categories.map(function (cat) {
      var n = row.counts[cat.id];
      var pct = (100 * n / row.total).toFixed(1);
      return "<tr><td>" + cat.labelZh + "</td><td>" + n + "</td><td>" + pct + "%</td></tr>";
    }).join("") + "<tr><th>合计</th><th>" + row.total + "</th><th>100%</th></tr>";

    chart.setOption({
      backgroundColor: "transparent",
      tooltip: { trigger: "item", formatter: "{b}<br/>{c}（{d}%）" },
      legend: { bottom: 0, textStyle: { color: "#d7e6f2" } },
      series: [{
        type: "pie",
        radius: ["36%", "62%"],
        center: ["50%", "46%"],
        data: pieData,
        label: { color: "#d7e6f2" }
      }]
    });
  }

  FootData.load("foot-symmetry").then(function (pack) {
    data = pack;
    chart = echarts.init(document.getElementById("sym-chart"), "dark");
    render(Number(ageInput.value));
    window.addEventListener("resize", function () { chart.resize(); });
    ageInput.addEventListener("input", function () {
      render(Number(ageInput.value));
    });
  }).catch(function (err) {
    document.getElementById("sym-chart").textContent = err.message;
  });
})();
