(function () {
  const data = Desk.pack().bmiShape;
  const chart = Desk.chart("#bmi");
  let showRings = false;

  function render() {
    const option = Object.assign(Desk.darkBase(), {
      legend: { data: ["girls", "boys"], textStyle: { color: "#f4efe4" } },
      xAxis: { type: "category", name: "BMI", data: data.bmi, boundaryGap: false },
      yAxis: { type: "value", name: "length/width", min: 20, max: 32 },
      series: [
        {
          name: "girls",
          type: "line",
          smooth: true,
          symbol: "circle",
          areaStyle: { color: "rgba(255,122,106,0.25)" },
          itemStyle: { color: "#ff7a6a" },
          data: data.girls,
        },
        {
          name: "boys",
          type: "line",
          smooth: true,
          symbol: "circle",
          areaStyle: { color: "rgba(127,208,255,0.18)" },
          itemStyle: { color: "#7fd0ff" },
          data: data.boys,
        },
      ],
    });
    if (showRings) {
      data.inset_pies.forEach(function (pie, index) {
        option.series.push({
          type: "pie",
          center: [index === 0 ? "82%" : "82%", index === 0 ? "28%" : "72%"],
          radius: ["10%", "16%"],
          label: { color: "#f4efe4" },
          data: [
            { value: pie.value, name: pie.label_en + " " + pie.percent + "%" },
            { value: pie.placeholder, name: "placeholder", itemStyle: { color: "#3a3228" } },
          ],
        });
      });
    }
    chart.setOption(option, true);
    const lang = Desk.currentLang();
    document.getElementById("pieNote").textContent = lang === "en"
      ? "Placeholder rings: narrow 21.74% (50/230), wide 15.34% (435/2835). Not from the line series."
      : "占位环图：过瘦 21.74%（50/230），过胖 15.34%（435/2835）。不是折线序列里的数。";
  }

  document.getElementById("rings").addEventListener("click", function () {
    showRings = !showRings;
    this.setAttribute("aria-pressed", String(showRings));
    render();
  });
  document.querySelector("[data-lang-toggle]").addEventListener("click", function () {
    setTimeout(render, 0);
  });
  render();
})();
