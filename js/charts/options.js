/**
 * ECharts option factories for the personal foot-shape examples.
 * Input is a dataset JSON object from /data. No ECharts color helpers,
 * so the same file can be required from Node tests.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.FootCharts = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var COLORS = {
    female: "#ff6b8a",
    male: "#3deaff",
    accent: "#02a6b5",
    gold: "#f9cf67",
    green: "#56c979",
    pink: "#e92b77",
    typical: "#5b8ff9",
    diabetic: "#f08a5d",
    text: "#d7e2f2",
    muted: "#8ea0b8",
    grid: "rgba(255,255,255,0.12)",
    panel: "rgba(11, 22, 40, 0.35)",
  };

  function textStyle() {
    return { color: COLORS.text, fontSize: 12 };
  }

  function heightShoeSize(data) {
    return {
      backgroundColor: "transparent",
      color: [COLORS.female, COLORS.gold],
      title: {
        text: data.title,
        subtext: data.title_en + "  ·  n=" + data.series.female.length + " / " + data.series.male.length,
        left: 12,
        top: 8,
        textStyle: { color: COLORS.text, fontSize: 16, fontWeight: 500 },
        subtextStyle: { color: COLORS.muted },
      },
      legend: {
        top: 12,
        right: 16,
        textStyle: textStyle(),
        data: ["女性", "男性"],
      },
      tooltip: {
        formatter: function (params) {
          return (
            params.seriesName +
            "<br/>身高 " +
            params.value[0] +
            " cm<br/>鞋长 " +
            params.value[1] +
            " cm"
          );
        },
      },
      grid: { left: 56, right: 28, top: 72, bottom: 48 },
      xAxis: {
        name: "身高 cm",
        nameTextStyle: { color: COLORS.muted },
        type: "value",
        scale: true,
        axisLabel: { color: COLORS.muted },
        axisLine: { lineStyle: { color: COLORS.grid } },
        splitLine: { lineStyle: { color: COLORS.grid } },
      },
      yAxis: {
        name: "鞋长 cm",
        nameTextStyle: { color: COLORS.muted },
        type: "value",
        scale: true,
        axisLabel: { color: COLORS.muted },
        axisLine: { lineStyle: { color: COLORS.grid } },
        splitLine: { lineStyle: { color: COLORS.grid } },
      },
      series: [
        {
          name: "女性",
          type: "scatter",
          symbolSize: 6,
          data: data.series.female,
        },
        {
          name: "男性",
          type: "scatter",
          symbolSize: 6,
          data: data.series.male,
        },
      ],
    };
  }

  function ageFootLength(data) {
    return {
      backgroundColor: "transparent",
      color: [COLORS.female, COLORS.male, COLORS.accent],
      title: {
        text: data.title,
        subtext: data.title_en,
        left: 12,
        top: 8,
        textStyle: { color: COLORS.text, fontSize: 16, fontWeight: 500 },
        subtextStyle: { color: COLORS.muted },
      },
      legend: { top: 12, right: 16, textStyle: textStyle() },
      tooltip: { trigger: "axis" },
      grid: { left: 56, right: 56, top: 72, bottom: 48 },
      xAxis: {
        type: "category",
        data: data.ages.map(function (age) {
          return age + "岁";
        }),
        axisLabel: { color: COLORS.muted },
        axisLine: { lineStyle: { color: COLORS.grid } },
      },
      yAxis: [
        {
          type: "value",
          name: "脚长 cm",
          min: 16,
          axisLabel: { color: COLORS.muted },
          splitLine: { lineStyle: { color: COLORS.grid } },
        },
        {
          type: "value",
          name: "差值 cm",
          axisLabel: { color: COLORS.muted },
          splitLine: { show: false },
        },
      ],
      series: [
        { name: "女生脚长", type: "bar", data: data.series.female_cm, barGap: 0.08 },
        { name: "男生脚长", type: "bar", data: data.series.male_cm },
        {
          name: "女生 − 男生",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          data: data.series.female_minus_male_cm,
        },
      ],
    };
  }

  function bmiPlumpness(data) {
    return {
      backgroundColor: "transparent",
      color: [COLORS.female, COLORS.male],
      title: {
        text: data.title,
        subtext: data.title_en,
        left: 12,
        top: 8,
        textStyle: { color: COLORS.text, fontSize: 16, fontWeight: 500 },
        subtextStyle: { color: COLORS.muted },
      },
      legend: { top: 12, right: 16, textStyle: textStyle() },
      tooltip: { trigger: "axis" },
      grid: { left: 64, right: 28, top: 72, bottom: 48 },
      xAxis: {
        type: "category",
        name: "BMI",
        data: data.bmi_bins,
        axisLabel: { color: COLORS.muted },
      },
      yAxis: {
        type: "value",
        name: "脚长 / 脚宽",
        min: 20,
        axisLabel: { color: COLORS.muted },
        splitLine: { lineStyle: { color: COLORS.grid } },
      },
      series: [
        {
          name: "女生脚胖瘦度",
          type: "line",
          smooth: true,
          data: data.series.female_plumpness,
        },
        {
          name: "男生脚胖瘦度",
          type: "line",
          smooth: true,
          data: data.series.male_plumpness,
        },
      ],
    };
  }

  function leftRightRatio(data, ageYears) {
    var row = data.ages[0];
    for (var i = 0; i < data.ages.length; i += 1) {
      if (data.ages[i].age_years === ageYears) {
        row = data.ages[i];
        break;
      }
    }
    var counts = row.counts;
    return {
      backgroundColor: "transparent",
      color: [COLORS.green, COLORS.male, "#b6a2df", "#a96ec9", COLORS.accent],
      title: {
        text: data.title + " · " + row.label,
        subtext: "same-size share " + Math.round(row.same_share * 1000) / 10 + "%",
        left: 12,
        top: 8,
        textStyle: { color: COLORS.text, fontSize: 16, fontWeight: 500 },
        subtextStyle: { color: COLORS.muted },
      },
      tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
      legend: { bottom: 8, textStyle: textStyle() },
      series: [
        {
          type: "pie",
          radius: ["36%", "62%"],
          center: ["50%", "52%"],
          data: [
            { name: "双脚相同", value: counts.same },
            { name: "左脚比右脚大 10–20%", value: counts.left_10_20 },
            { name: "左脚比右脚大 20% 以上", value: counts.left_over_20 },
            { name: "右脚比左脚大 20% 以上", value: counts.right_over_20 },
            { name: "右脚比左脚大 10–20%", value: counts.right_10_20 },
          ],
        },
      ],
    };
  }

  function ageRadar(data) {
    return {
      backgroundColor: "transparent",
      color: [COLORS.male, COLORS.gold, COLORS.green, COLORS.pink],
      title: {
        text: data.title,
        subtext: data.title_en,
        left: 12,
        top: 8,
        textStyle: { color: COLORS.text, fontSize: 16, fontWeight: 500 },
        subtextStyle: { color: COLORS.muted },
      },
      legend: {
        top: 12,
        right: 16,
        textStyle: textStyle(),
        data: data.series.map(function (row) {
          return row.age_years + "岁";
        }),
      },
      radar: {
        indicator: data.indicators.map(function (item) {
          return { name: item.label, max: item.max };
        }),
        center: ["50%", "58%"],
        radius: "58%",
        axisName: { color: COLORS.text },
        splitLine: { lineStyle: { color: COLORS.grid } },
        splitArea: { areaStyle: { color: ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.05)"] } },
      },
      series: [
        {
          type: "radar",
          data: data.series.map(function (row) {
            return { name: row.age_years + "岁", value: row.values };
          }),
        },
      ],
    };
  }

  function plantarPressure(data) {
    return {
      backgroundColor: "transparent",
      color: [COLORS.typical, COLORS.diabetic],
      title: {
        text: data.title,
        subtext: data.title_en + "  ·  " + data.units.pressure,
        left: 12,
        top: 8,
        textStyle: { color: COLORS.text, fontSize: 16, fontWeight: 500 },
        subtextStyle: { color: COLORS.muted },
      },
      legend: { top: 12, right: 16, textStyle: textStyle() },
      tooltip: { trigger: "axis" },
      grid: { left: 56, right: 24, top: 72, bottom: 48 },
      xAxis: {
        type: "category",
        data: data.sites,
        axisLabel: { color: COLORS.muted },
      },
      yAxis: {
        type: "value",
        name: "Pa",
        axisLabel: { color: COLORS.muted },
        splitLine: { lineStyle: { color: COLORS.grid } },
      },
      series: [
        { name: "典型成人", type: "line", smooth: true, data: data.series.typical_adult },
        { name: "糖尿病足", type: "line", smooth: true, data: data.series.diabetic_foot },
      ],
    };
  }

  function tissueThickness(data) {
    return {
      backgroundColor: "transparent",
      color: [COLORS.diabetic, COLORS.accent, COLORS.green],
      title: {
        text: data.title,
        subtext: data.title_en,
        left: 12,
        top: 8,
        textStyle: { color: COLORS.text, fontSize: 16, fontWeight: 500 },
        subtextStyle: { color: COLORS.muted },
      },
      legend: { top: 12, right: 16, textStyle: textStyle() },
      tooltip: { trigger: "axis" },
      grid: { left: 56, right: 56, top: 72, bottom: 56 },
      xAxis: {
        type: "category",
        data: data.sites,
        axisLabel: { color: COLORS.muted, rotate: 30 },
      },
      yAxis: [
        {
          type: "value",
          name: "mm",
          axisLabel: { color: COLORS.muted },
          splitLine: { lineStyle: { color: COLORS.grid } },
        },
        {
          type: "value",
          name: "差值 µm",
          axisLabel: { color: COLORS.muted },
          splitLine: { show: false },
        },
      ],
      series: [
        { name: "典型成人 mm", type: "bar", data: data.series.typical_adult_mm },
        { name: "糖尿病足 mm", type: "bar", data: data.series.diabetic_foot_mm },
        {
          name: "差值 µm",
          type: "line",
          yAxisIndex: 1,
          data: data.series.difference_um,
        },
      ],
    };
  }

  function byId(id, data, extra) {
    switch (id) {
      case "height-shoe-size":
        return heightShoeSize(data);
      case "age-foot-length":
        return ageFootLength(data);
      case "bmi-plumpness":
        return bmiPlumpness(data);
      case "left-right-ratio":
        return leftRightRatio(data, extra && extra.ageYears);
      case "age-radar":
        return ageRadar(data);
      case "plantar-pressure":
        return plantarPressure(data);
      case "tissue-thickness":
        return tissueThickness(data);
      default:
        throw new Error("unknown chart id: " + id);
    }
  }

  return {
    COLORS: COLORS,
    heightShoeSize: heightShoeSize,
    ageFootLength: ageFootLength,
    bmiPlumpness: bmiPlumpness,
    leftRightRatio: leftRightRatio,
    ageRadar: ageRadar,
    plantarPressure: plantarPressure,
    tissueThickness: tissueThickness,
    byId: byId,
  };
});
