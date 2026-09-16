(function () {
  const coords = {
    西安: [109.1162, 34.2004],
    北京: [116.4551, 40.2539],
    上海: [121.4648, 31.2891],
    广州: [113.5107, 23.2196],
    西宁: [101.4038, 36.8207],
    拉萨: [91.1865, 30.1465],
    银川: [106.3586, 38.1775],
    潍坊: [119.0918, 36.524],
    哈尔滨: [127.9688, 45.368],
  };

  const routes = [
    { from: "西安", to: ["北京", "上海", "广州", "西宁", "拉萨"], color: "#7fd0ff" },
    { from: "西宁", to: ["北京", "上海", "广州", "西安", "银川"], color: "#e6b35a" },
    { from: "拉萨", to: ["北京", "潍坊", "哈尔滨"], color: "#ff7a6a" },
  ];

  function lineData(group) {
    return group.to.map(function (name) {
      return { coords: [coords[group.from], coords[name]], fromName: group.from, toName: name };
    });
  }

  function scatterData(group) {
    return group.to.map(function (name) {
      return { name: name, value: coords[name].concat([100]) };
    });
  }

  const series = [];
  routes.forEach(function (group) {
    series.push({
      name: group.from,
      type: "lines",
      zlevel: 1,
      effect: { show: true, period: 6, trailLength: 0.4, color: group.color, symbolSize: 3 },
      lineStyle: { color: group.color, width: 1, curveness: 0.2, opacity: 0.7 },
      data: lineData(group),
    });
    series.push({
      name: group.from,
      type: "effectScatter",
      coordinateSystem: "geo",
      zlevel: 2,
      rippleEffect: { brushType: "stroke" },
      label: { show: true, formatter: "{b}", color: "#f4efe4" },
      itemStyle: { color: group.color },
      symbolSize: 8,
      data: scatterData(group).concat([{ name: group.from, value: coords[group.from].concat([100]) }]),
    });
  });

  const chart = Desk.chart("#geo");
  chart.setOption({
    backgroundColor: "rgba(0,0,0,0)",
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        if (params.seriesType === "lines") {
          return params.data.fromName + " → " + params.data.toName;
        }
        return params.name;
      },
    },
    geo: {
      map: "china",
      roam: true,
      itemStyle: {
        areaColor: "rgba(43, 196, 243, 0.16)",
        borderColor: "rgba(43, 196, 243, 0.8)",
      },
      emphasis: { itemStyle: { areaColor: "#2B91B7" } },
      label: { color: "#f4efe4" },
    },
    series: series,
  });
})();
