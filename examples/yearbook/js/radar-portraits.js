(function () {
  const radar = Desk.pack().radar;
  const chart = Desk.chart("#radar");
  const colors = { 9: "#7fd0ff", 10: "#e6b35a", 11: "#7dcaa2", 12: "#ff7a6a" };
  const visible = { 9: true, 10: true, 11: true, 12: true };

  function render() {
    const lang = Desk.currentLang();
    const names = lang === "en" ? radar.dimensions_en : radar.dimensions_zh;
    const series = radar.series.filter(function (row) { return visible[row.age]; }).map(function (row) {
      return {
        name: String(row.age),
        type: "radar",
        symbolSize: 4,
        lineStyle: { color: colors[row.age] },
        itemStyle: { color: colors[row.age] },
        areaStyle: { color: colors[row.age], opacity: 0.12 },
        data: [{ value: row.values, name: String(row.age) }],
      };
    });
    chart.setOption(Object.assign(Desk.darkBase(), {
      legend: { data: ["9", "10", "11", "12"], textStyle: { color: "#f4efe4" } },
      radar: {
        indicator: names.map(function (name) { return { name: name, max: 100 }; }),
        splitNumber: 4,
        axisName: { color: "#f4efe4" },
        splitLine: { lineStyle: { color: "rgba(244,239,228,0.2)" } },
        splitArea: { areaStyle: { color: ["rgba(244,239,228,0.02)", "rgba(244,239,228,0.05)"] } },
      },
      series: series,
    }), true);

    const header = "<tr><th>age</th>" + names.map(function (name) {
      return "<th>" + name + "</th>";
    }).join("") + "<th>sum</th></tr>";
    document.getElementById("table").innerHTML = header + radar.series.map(function (row) {
      return "<tr><td>" + row.age + "</td>" + row.values.map(function (v) {
        return "<td>" + v + "</td>";
      }).join("") + "<td>" + row.sum + "</td></tr>";
    }).join("");
  }

  const host = document.getElementById("ages");
  radar.series.forEach(function (row) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = String(row.age);
    btn.setAttribute("aria-pressed", "true");
    btn.addEventListener("click", function () {
      visible[row.age] = !visible[row.age];
      btn.setAttribute("aria-pressed", String(visible[row.age]));
      render();
    });
    host.appendChild(btn);
  });
  document.querySelector("[data-lang-toggle]").addEventListener("click", function () {
    setTimeout(render, 0);
  });
  render();
})();
