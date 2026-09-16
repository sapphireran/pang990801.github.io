(function (global) {
  var S = global.CompanionStudio;

  function boot(id) {
    var chart = echarts.init(document.querySelector(id));
    window.addEventListener("resize", function () { chart.resize(); });
    return chart;
  }

  function ink() {
    return {
      backgroundColor: "transparent",
      textStyle: { color: "#1c2430" },
      grid: { left: 44, right: 16, top: 28, bottom: 32 }
    };
  }

  function scatter() {
    var pack = S.requireData().heightShoe;
    var option = ink();
    option.xAxis = { name: "cm", scale: true };
    option.yAxis = { name: "cm", scale: true };
    option.series = [
      { name: "女", type: "scatter", symbolSize: 4, itemStyle: { color: "#b44a32" },
        data: pack.female.map(function (d) { return [d.height_cm, d.shoe_cm]; }) },
      { name: "男", type: "scatter", symbolSize: 4, itemStyle: { color: "#c5922a" },
        data: pack.male.map(function (d) { return [d.height_cm, d.shoe_cm]; }) }
    ];
    boot("#tour-scatter").setOption(option);
  }

  function age() {
    var rows = S.requireData().ageFoot;
    var option = ink();
    option.xAxis = { type: "category", data: rows.map(function (r) { return r.age; }) };
    option.yAxis = { name: "cm", min: 17 };
    option.series = [
      { name: "女", type: "bar", data: rows.map(function (r) { return r.girl_cm; }), itemStyle: { color: "#2a6f73" } },
      { name: "男", type: "bar", data: rows.map(function (r) { return r.boy_cm; }), itemStyle: { color: "#24324a" } }
    ];
    boot("#tour-age").setOption(option);
  }

  function bmi() {
    var rows = S.requireData().bmiShape;
    var option = ink();
    option.xAxis = { type: "category", data: rows.map(function (r) { return r.bmi; }) };
    option.yAxis = { min: 21 };
    option.series = [
      { name: "女", type: "line", data: rows.map(function (r) { return r.girl; }), itemStyle: { color: "#b44a32" } },
      { name: "男", type: "line", data: rows.map(function (r) { return r.boy; }), itemStyle: { color: "#2a6f73" } }
    ];
    boot("#tour-bmi").setOption(option);
  }

  function pie() {
    var row = S.requireData().symmetry[S.requireData().symmetry.length - 1];
    var option = ink();
    option.series = [{
      type: "pie",
      radius: ["28%", "62%"],
      data: [
        { name: "相同", value: row.same },
        { name: "左大10–20", value: row.left_10_20 },
        { name: "左大>20", value: row.left_over_20 },
        { name: "右大>20", value: row.right_over_20 },
        { name: "右大10–20", value: row.right_10_20 }
      ]
    }];
    boot("#tour-pie").setOption(option);
  }

  function radar() {
    var pack = S.requireData().radar;
    var option = ink();
    option.radar = { indicator: pack.axes.map(function (name) { return { name: name, max: 100 }; }) };
    option.series = [{
      type: "radar",
      data: pack.rows.map(function (row) { return { name: row.age + "岁", value: row.scores }; })
    }];
    boot("#tour-radar").setOption(option);
  }

  global.CompanionTour = {
    start: function () {
      scatter();
      age();
      bmi();
      pie();
      radar();
    }
  };
})(window);
