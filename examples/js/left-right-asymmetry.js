ExampleCommon.onReady(function () {
  var data = ExampleCommon.requireData("leftRightAsymmetry");
  var chart = echarts.init(ExampleCommon.$("#asymmetry-chart"));
  ExampleCommon.bindChartResize(chart);
  var colors = ["#56c979", "#5CAFF2", "#B6A2DF", "#a96ec9", "#2DC7C9"];
  var names = ["双脚相同", "左脚大 10–20%", "左脚大 20%+", "右脚大 20%+", "右脚大 10–20%"];

  function rowToSlices(row) {
    return [
      row.same_feet,
      row.left_larger_10_20,
      row.left_larger_over_20,
      row.right_larger_over_20,
      row.right_larger_10_20,
    ];
  }

  function render(ageLabel) {
    var row = data.rows.find(function (item) {
      return item.age_label === ageLabel;
    });
    var values = rowToSlices(row);
    var total = values.reduce(function (sum, value) {
      return sum + value;
    }, 0);
    chart.setOption(
      {
        backgroundColor: "transparent",
        tooltip: { trigger: "item" },
        legend: { bottom: 0, textStyle: { color: "#d7f6ff" } },
        color: colors,
        series: [
          {
            type: "pie",
            radius: ["36%", "62%"],
            center: ["50%", "46%"],
            label: { color: "#e8f4ff" },
            data: names.map(function (name, index) {
              return { name: name, value: values[index] };
            }),
          },
        ],
      },
      true
    );
    ExampleCommon.setText("#kpi-age", row.age_years + " 岁");
    ExampleCommon.setText("#kpi-same", Math.round((row.same_feet / total) * 100) + "%");
    ExampleCommon.setText("#kpi-left", row.left_larger_10_20 + row.left_larger_over_20);
    ExampleCommon.setText("#kpi-right", row.right_larger_10_20 + row.right_larger_over_20);
  }

  ExampleCommon.fillTable(
    ExampleCommon.$("#asymmetry-table"),
    ["年龄", "相同", "左 10–20", "左 >20", "右 >20", "右 10–20"],
    data.rows.map(function (row) {
      return [
        row.age_years,
        row.same_feet,
        row.left_larger_10_20,
        row.left_larger_over_20,
        row.right_larger_over_20,
        row.right_larger_10_20,
      ];
    })
  );

  var select = ExampleCommon.$("#age-select");
  data.ages.forEach(function (label) {
    var option = document.createElement("option");
    option.value = label;
    option.textContent = label;
    select.appendChild(option);
  });
  select.addEventListener("change", function () {
    render(select.value);
  });

  var playing = true;
  var playIndex = 0;
  var timer = setInterval(function () {
    if (!playing) {
      return;
    }
    playIndex = (playIndex + 1) % data.ages.length;
    select.value = data.ages[playIndex];
    render(select.value);
  }, 2000);

  ExampleCommon.$("#play-toggle").addEventListener("click", function () {
    playing = !playing;
    this.textContent = playing ? "Pause timeline" : "Play timeline";
    this.classList.toggle("is-active", playing);
  });

  render(data.ages[0]);

  // Keep the interval handle referenced so a later page can clear it if needed.
  window.ExampleAsymmetryTimer = timer;
});
