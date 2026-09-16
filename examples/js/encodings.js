(function (global) {
  var S = global.CompanionStudio;

  function chart(el) {
    var host = typeof el === "string" ? document.querySelector(el) : el;
    var instance = echarts.init(host, null, { renderer: "canvas" });
    window.addEventListener("resize", function () { instance.resize(); });
    return instance;
  }

  function paperOption() {
    return {
      backgroundColor: "#fffdf6",
      textStyle: { color: "#1c2430", fontFamily: "Georgia, 'Songti SC', serif" },
      grid: { left: 56, right: 24, top: 48, bottom: 48 }
    };
  }

  function density(selector) {
    var data = S.requireData();
    var female = data.heightShoe.female.map(function (d) { return [d.height_cm, d.shoe_cm]; });
    var male = data.heightShoe.male.map(function (d) { return [d.height_cm, d.shoe_cm]; });
    var all = female.concat(male);
    var xs = all.map(function (p) { return p[0]; });
    var ys = all.map(function (p) { return p[1]; });
    var xMin = Math.floor(Math.min.apply(null, xs) - 1);
    var xMax = Math.ceil(Math.max.apply(null, xs) + 1);
    var yMin = Math.floor(Math.min.apply(null, ys) - 1);
    var yMax = Math.ceil(Math.max.apply(null, ys) + 1);
    var bins = S.bin2d(all, xMin, xMax, yMin, yMax, 14, 10);
    var option = paperOption();
    option.title = { text: "身高 × 鞋长密度", left: 16, top: 10 };
    option.tooltip = {
      formatter: function (p) {
        return "格内点数：" + p.data[2];
      }
    };
    option.xAxis = { type: "category", name: "身高 cm", data: bins.xEdges.map(function (v) { return v.toFixed(0); }) };
    option.yAxis = { type: "category", name: "鞋长 cm", data: bins.yEdges.map(function (v) { return v.toFixed(1); }) };
    option.visualMap = {
      min: 0,
      max: Math.max.apply(null, bins.data.map(function (d) { return d[2]; })),
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: 8,
      inRange: { color: ["#f7f1e6", "#e8c07a", "#b44a32"] }
    };
    option.series = [{ type: "heatmap", data: bins.data, emphasis: { itemStyle: { shadowBlur: 8 } } }];
    chart(selector).setOption(option);
    return {
      n: all.length,
      r: S.pearson(xs, ys),
      maxBin: Math.max.apply(null, bins.data.map(function (d) { return d[2]; }))
    };
  }

  function slope(selector) {
    var rows = S.requireData().ageFoot;
    var option = paperOption();
    option.title = { text: "年龄均值坡度图", left: 16, top: 10 };
    option.tooltip = { trigger: "item" };
    option.xAxis = { type: "category", data: ["女孩脚长", "男孩脚长"] };
    option.yAxis = { type: "value", name: "cm", min: 17.5, max: 24 };
    option.series = rows.map(function (row) {
      var longer = row.girl_cm >= row.boy_cm ? "#b44a32" : "#2a6f73";
      return {
        type: "line",
        name: row.age + "岁",
        data: [row.girl_cm, row.boy_cm],
        symbol: "circle",
        symbolSize: 9,
        lineStyle: { width: 2, color: longer },
        itemStyle: { color: longer },
        label: {
          show: true,
          formatter: function (p) {
            return p.dataIndex === 0 ? row.age + "岁" : "";
          }
        }
      };
    });
    chart(selector).setOption(option);
    return rows;
  }

  function parallel(selector) {
    var radar = S.requireData().radar;
    var option = paperOption();
    option.title = { text: "9–12 岁平行坐标", left: 16, top: 10 };
    option.parallelAxis = radar.axes.map(function (name, idx) {
      return { dim: idx, name: name, min: 20, max: 90 };
    });
    option.parallel = { left: 80, right: 40, top: 80, bottom: 40 };
    option.series = [{
      type: "parallel",
      lineStyle: { width: 2.4, opacity: 0.85 },
      data: radar.rows.map(function (row) {
        return { name: row.age + "岁", value: row.scores };
      })
    }];
    option.legend = { top: 36, data: radar.rows.map(function (row) { return row.age + "岁"; }) };
    option.color = ["#2a6f73", "#c5922a", "#3d8b40", "#b44a32"];
    chart(selector).setOption(option);
  }

  function stacked(selector) {
    var rows = S.requireData().symmetry;
    var option = paperOption();
    option.title = { text: "左右脚示意计数（生成式）", left: 16, top: 10 };
    option.tooltip = { trigger: "axis" };
    option.legend = { top: 36 };
    option.xAxis = { type: "category", data: rows.map(function (r) { return r.age + "岁"; }) };
    option.yAxis = { type: "value", name: "计数" };
    option.color = ["#2f6b3a", "#5c9ad4", "#7b5ea7", "#c5922a", "#b44a32"];
    option.series = [
      { name: "双脚相同", type: "line", stack: "mix", areaStyle: {}, data: rows.map(function (r) { return r.same; }) },
      { name: "左>右 10–20%", type: "line", stack: "mix", areaStyle: {}, data: rows.map(function (r) { return r.left_10_20; }) },
      { name: "左>右 >20%", type: "line", stack: "mix", areaStyle: {}, data: rows.map(function (r) { return r.left_over_20; }) },
      { name: "右>左 >20%", type: "line", stack: "mix", areaStyle: {}, data: rows.map(function (r) { return r.right_over_20; }) },
      { name: "右>左 10–20%", type: "line", stack: "mix", areaStyle: {}, data: rows.map(function (r) { return r.right_10_20; }) }
    ];
    chart(selector).setOption(option);
  }

  function connected(selector) {
    var rows = S.requireData().bmiShape;
    var option = paperOption();
    option.title = { text: "BMI 路径（按 BMI 升序连接）", left: 16, top: 10 };
    option.tooltip = { trigger: "item" };
    option.xAxis = { type: "value", name: "BMI", min: 11, max: 25 };
    option.yAxis = { type: "value", name: "胖瘦指数", min: 21, max: 32 };
    option.legend = { top: 36 };
    option.series = [
      {
        name: "女孩",
        type: "line",
        data: rows.map(function (r) { return [r.bmi, r.girl]; }),
        symbolSize: 8,
        itemStyle: { color: "#b44a32" },
        lineStyle: { color: "#b44a32" }
      },
      {
        name: "男孩",
        type: "line",
        data: rows.map(function (r) { return [r.bmi, r.boy]; }),
        symbolSize: 8,
        itemStyle: { color: "#2a6f73" },
        lineStyle: { color: "#2a6f73" }
      }
    ];
    chart(selector).setOption(option);
  }

  function dumbbell(selector) {
    var leftover = S.requireData().leftovers.thickness;
    var sites = leftover.sites;
    var option = paperOption();
    option.title = { text: "未挂载：皮下厚度草稿（毫米）", left: 16, top: 10 };
    option.tooltip = { trigger: "axis" };
    option.yAxis = { type: "category", data: sites, inverse: true };
    option.xAxis = { type: "value", name: "mm" };
    option.legend = { top: 36 };
    option.series = [
      {
        name: "正常人群草稿",
        type: "scatter",
        data: leftover.normal_mm,
        symbolSize: 11,
        itemStyle: { color: "#c5922a" }
      },
      {
        name: "糖尿病足草稿",
        type: "scatter",
        data: leftover.diabetic_foot_mm,
        symbolSize: 11,
        itemStyle: { color: "#2a6f73" }
      },
      {
        name: "连接",
        type: "custom",
        renderItem: function (params, api) {
          var y = api.coord([0, api.value(0)])[1];
          var x1 = api.coord([leftover.normal_mm[params.dataIndex], 0])[0];
          var x2 = api.coord([leftover.diabetic_foot_mm[params.dataIndex], 0])[0];
          return {
            type: "line",
            shape: { x1: x1, y1: y, x2: x2, y2: y },
            style: { stroke: "#c9b79a", lineWidth: 2 }
          };
        },
        data: sites.map(function (_, i) { return i; })
      }
    ];
    chart(selector).setOption(option);
    return leftover;
  }

  global.CompanionEncodings = {
    density: density,
    slope: slope,
    parallel: parallel,
    stacked: stacked,
    connected: connected,
    dumbbell: dumbbell
  };
})(window);
