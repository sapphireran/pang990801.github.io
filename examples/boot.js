/**
 * Shared boot for /examples/*.html pages.
 * Required globals: echarts, FootData, FootCharts, FootStats
 *
 * Config via #chart[data-dataset] and optional window.EXAMPLE_CONFIG.
 */
(function () {
  "use strict";

  function $(sel) {
    return document.querySelector(sel);
  }

  function setText(sel, value) {
    var node = $(sel);
    if (node) {
      node.textContent = value;
    }
  }

  function renderStats(id, data) {
    var host = $("#stats");
    if (!host || typeof FootStats === "undefined") {
      return;
    }
    var html = "";
    if (id === "height-shoe-size") {
      var f = FootStats.describePairs(data.series.female, "female");
      var m = FootStats.describePairs(data.series.male, "male");
      html =
        stat("女生 n", f.n) +
        stat("男生 n", m.n) +
        stat("女生身高均值", FootStats.round(f.height_cm.mean, 1) + " cm") +
        stat("男生身高均值", FootStats.round(m.height_cm.mean, 1) + " cm") +
        stat("女生 r", FootStats.round(f.fit.r, 3)) +
        stat("男生 r", FootStats.round(m.fit.r, 3));
    } else if (id === "age-foot-length") {
      var cross = FootStats.crossingAge(data.ages, data.series.female_minus_male_cm);
      html =
        stat("年龄跨度", data.ages[0] + "–" + data.ages[data.ages.length - 1] + " 岁") +
        stat("交叉年龄", cross ? cross.at_age + " 岁" : "无") +
        stat("6岁差值", data.series.female_minus_male_cm[0] + " cm") +
        stat("14岁差值", data.series.female_minus_male_cm[data.series.female_minus_male_cm.length - 1] + " cm");
    } else if (id === "bmi-plumpness") {
      var trend = FootStats.plumpnessTrend(data.bmi_bins, data.series.female_plumpness);
      html =
        stat("BMI 分箱", data.bmi_bins[0] + "–" + data.bmi_bins[data.bmi_bins.length - 1]) +
        stat("女生斜率", FootStats.round(trend.slope, 3)) +
        stat("过瘦脚", data.extreme_share.thin_feet.highlighted) +
        stat("过胖脚", data.extreme_share.wide_feet.highlighted);
    } else if (id === "left-right-ratio") {
      var first = data.ages[0];
      var last = data.ages[data.ages.length - 1];
      html =
        stat("起始同脚占比", Math.round(first.same_share * 100) + "%") +
        stat("14岁同脚占比", Math.round(last.same_share * 100) + "%") +
        stat("年龄档", data.ages.length);
    } else if (id === "age-radar") {
      var growth = FootStats.radarGrowth(data.series);
      var biggest = growth.slice().sort(function (a, b) {
        return b.delta - a.delta;
      })[0];
      html =
        stat("指标数", data.indicators.length) +
        stat("年龄", "9–12") +
        stat("最大增幅", data.indicators[biggest.index].label + " +" + biggest.delta);
    } else if (id === "plantar-pressure") {
      var d = FootStats.siteDelta(data.series.typical_adult, data.series.diabetic_foot);
      var peak = d.slice().sort(function (a, b) {
        return Math.abs(b.delta) - Math.abs(a.delta);
      })[0];
      html =
        stat("位点数", data.sites.length) +
        stat("最大差值位点", data.sites[peak.index]) +
        stat("差值", peak.delta + " Pa");
    } else if (id === "tissue-thickness") {
      html =
        stat("位点数", data.sites.length) +
        stat("典型均值", FootStats.round(FootStats.mean(data.series.typical_adult_mm), 2) + " mm") +
        stat("糖尿病足均值", FootStats.round(FootStats.mean(data.series.diabetic_foot_mm), 2) + " mm");
    }
    host.innerHTML = html;
  }

  function stat(label, value) {
    return '<div class="stat"><span>' + label + "</span><b>" + value + "</b></div>";
  }

  function bindAgeButtons(data, chart, id) {
    var bar = $("#age-toolbar");
    if (!bar) {
      return;
    }
    bar.innerHTML = data.ages
      .map(function (row) {
        return '<button type="button" data-age="' + row.age_years + '">' + row.label + "</button>";
      })
      .join("");
    bar.addEventListener("click", function (ev) {
      var btn = ev.target.closest("button");
      if (!btn) {
        return;
      }
      var age = Number(btn.getAttribute("data-age"));
      bar.querySelectorAll("button").forEach(function (node) {
        node.classList.toggle("is-on", node === btn);
      });
      chart.setOption(FootCharts.leftRightRatio(data, age), true);
    });
    var first = bar.querySelector("button");
    if (first) {
      first.classList.add("is-on");
    }
  }

  function boot() {
    var el = document.getElementById("chart");
    if (!el) {
      return;
    }
    var id = el.getAttribute("data-dataset");
    FootData.root = "..";
    FootData.load(id)
      .then(function (data) {
        setText("#chart-title", data.title);
        setText("#chart-lede", data.description);
        var chart = echarts.init(el);
        var extra = id === "left-right-ratio" ? { ageYears: data.ages[0].age_years } : null;
        chart.setOption(FootCharts.byId(id, data, extra));
        window.addEventListener("resize", function () {
          chart.resize();
        });
        renderStats(id, data);
        if (id === "left-right-ratio") {
          bindAgeButtons(data, chart, id);
        }
      })
      .catch(function (err) {
        setText("#chart-lede", "无法加载数据集。请用本地静态服务器打开示例（见说明页）。");
        console.error(err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
