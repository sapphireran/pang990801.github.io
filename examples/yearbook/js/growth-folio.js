(function () {
  const series = Desk.pack().ageFoot;
  const radar = Desk.pack().radar;
  const chart = Desk.chart("#growth");
  let age = 6;

  function notes(lang, idx) {
    const g = series.girls_cm[idx];
    const b = series.boys_cm[idx];
    const d = series.difference_cm[idx];
    const radarRow = radar.series.find(function (row) { return row.age === age; });
    const lines = [];
    if (lang === "en") {
      lines.push("<h2>Age " + age + "</h2>");
      lines.push("<p>Girls " + g + " cm · boys " + b + " cm · girl−boy " + d + " cm.</p>");
      if (age === 11) lines.push("<p>Crossover year in the source: the signed gap turns negative.</p>");
      if (age === 9) lines.push("<p>Both means sit below the age-8 values. Recorded as a source kink.</p>");
      if (age === 14) lines.push("<p>End of the series. Boy lead is 0.50 cm; boy gain from 6 is 4.89 cm.</p>");
      if (radarRow) {
        lines.push("<p>Radar portrait exists for this age. Spoke sum = " + radarRow.sum + " (relative).</p>");
      } else {
        lines.push("<p>No radar ring for this age. The live center panel only stores 9–12.</p>");
      }
    } else {
      lines.push("<h2>" + age + " 岁</h2>");
      lines.push("<p>女 " + g + " cm · 男 " + b + " cm · 女−男 " + d + " cm。</p>");
      if (age === 11) lines.push("<p>源码交叉岁：差值转负。</p>");
      if (age === 9) lines.push("<p>两组都低于 8 岁，记作源码拐点。</p>");
      if (age === 14) lines.push("<p>序列终点。男童领先 0.50 cm；相对 6 岁增 4.89 cm。</p>");
      if (radarRow) {
        lines.push("<p>这一岁有雷达肖像。轴分之和 = " + radarRow.sum + "（相对分）。</p>");
      } else {
        lines.push("<p>这一岁没有雷达圈。中央图只存了 9–12 岁。</p>");
      }
    }
    return lines.join("");
  }

  function render() {
    const idx = series.ages.indexOf(age);
    const mark = series.ages.map(function (a) { return a === age ? 1 : 0; });
    chart.setOption(Object.assign(Desk.darkBase(), {
      legend: { data: ["girls", "boys", "girl−boy"], textStyle: { color: "#f4efe4" } },
      xAxis: { type: "category", data: series.ages.map(function (a) { return String(a); }) },
      yAxis: [
        { type: "value", name: "cm", min: 17, max: 24 },
        { type: "value", name: "Δ cm", min: -0.8, max: 0.8 },
      ],
      series: [
        { name: "girls", type: "bar", data: series.girls_cm, itemStyle: { color: "#ff7a6a" } },
        { name: "boys", type: "bar", data: series.boys_cm, itemStyle: { color: "#7fd0ff" } },
        {
          name: "girl−boy",
          type: "line",
          yAxisIndex: 1,
          smooth: true,
          data: series.difference_cm,
          itemStyle: { color: "#e6b35a" },
        },
        {
          name: "highlight",
          type: "scatter",
          symbolSize: function (v) { return v ? 16 : 0; },
          data: mark.map(function (flag, i) { return [i, series.girls_cm[i]]; }),
          itemStyle: { color: "#f4efe4" },
        },
      ],
    }), true);
    document.getElementById("ageOut").textContent = String(age);
    document.getElementById("chapter").innerHTML = notes(Desk.currentLang(), idx);
  }

  function setAge(next) {
    age = Math.min(14, Math.max(6, next));
    document.getElementById("age").value = String(age);
    render();
  }

  document.getElementById("age").addEventListener("input", function (event) {
    setAge(Number(event.target.value));
  });
  document.getElementById("prev").addEventListener("click", function () { setAge(age - 1); });
  document.getElementById("next").addEventListener("click", function () { setAge(age + 1); });
  document.querySelector("[data-lang-toggle]").addEventListener("click", function () {
    setTimeout(render, 0);
  });
  render();
})();
