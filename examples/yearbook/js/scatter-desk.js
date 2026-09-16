(function () {
  const data = Desk.pack().heightShoe;
  const chart = Desk.chart("#scatter");
  const state = { girl: true, boy: true, min: 75, max: 155 };

  function visible(points) {
    return points.filter(function (p) {
      return p[0] >= state.min && p[0] <= state.max;
    });
  }

  function render() {
    const girls = state.girl ? visible(data.girls) : [];
    const boys = state.boy ? visible(data.boys) : [];
    const all = girls.concat(boys);
    const girlFit = Desk.ols(girls);
    const boyFit = Desk.ols(boys);
    const allFit = Desk.ols(all);

    chart.setOption(Object.assign(Desk.darkBase(), {
      legend: { data: ["girls", "boys", "fit"], textStyle: { color: "#f4efe4" } },
      xAxis: { name: "height cm", min: 70, max: 160 },
      yAxis: { name: "shoe cm", min: 8, max: 26 },
      series: [
        { name: "girls", type: "scatter", symbolSize: 6, itemStyle: { color: "#ff7a6a" }, data: girls },
        { name: "boys", type: "scatter", symbolSize: 6, itemStyle: { color: "#7fd0ff" }, data: boys },
        {
          name: "fit",
          type: "line",
          showSymbol: false,
          lineStyle: { color: "#e6b35a", width: 2 },
          data: Desk.fitLine(all, allFit),
        },
      ],
    }), true);

    const box = document.getElementById("stats");
    const lang = Desk.currentLang();
    function row(label, fit) {
      if (!fit) return label + ": —";
      return (
        label +
        ": n=" + fit.n +
        "  slope=" + Desk.fmt(fit.slope, 3) +
        "  int=" + Desk.fmt(fit.intercept, 3) +
        "  r²=" + Desk.fmt(fit.r2, 3)
      );
    }
    box.innerHTML = [
      lang === "en" ? "Visible-window fit" : "当前窗口回归",
      row(lang === "en" ? "girls" : "女", girlFit),
      row(lang === "en" ? "boys" : "男", boyFit),
      row(lang === "en" ? "pooled" : "合并", allFit),
      "",
      lang === "en"
        ? "Source pack (all points): girls r=0.914, boys r=0.916."
        : "全量数据包：女 r=0.914，男 r=0.916。",
      lang === "en"
        ? "Shoe axis is labeled cm in js/index.js."
        : "鞋码轴在 js/index.js 里按 cm 标注。",
    ].join("<br>");
  }

  document.querySelectorAll("[data-sex]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const key = btn.getAttribute("data-sex");
      state[key] = !state[key];
      btn.setAttribute("aria-pressed", String(state[key]));
      render();
    });
  });

  function bindRange(id, outId, key) {
    const input = document.getElementById(id);
    const out = document.getElementById(outId);
    input.addEventListener("input", function () {
      state[key] = Number(input.value);
      if (state.min > state.max) {
        if (key === "min") state.max = state.min;
        else state.min = state.max;
        document.getElementById("minH").value = String(state.min);
        document.getElementById("maxH").value = String(state.max);
      }
      out.textContent = String(state[key]);
      document.getElementById("minOut").textContent = String(state.min);
      document.getElementById("maxOut").textContent = String(state.max);
      render();
    });
  }

  bindRange("minH", "minOut", "min");
  bindRange("maxH", "maxOut", "max");
  render();
})();
