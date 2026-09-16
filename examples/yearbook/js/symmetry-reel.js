(function () {
  const rows = Desk.pack().symmetry.rows;
  const chart = Desk.chart("#pie");
  let age = 2;
  let timer = null;

  function rowFor(current) {
    return rows.find(function (row) { return row.age === current; });
  }

  function render() {
    const row = rowFor(age);
    const lang = Desk.currentLang();
    const slices = [
      { key: "same", name: lang === "en" ? "same feet" : "双脚相同", value: row.same, color: "#7dcaa2" },
      { key: "left_10_20", name: lang === "en" ? "left +10–20%" : "左大 10–20%", value: row.left_10_20, color: "#7fd0ff" },
      { key: "left_over_20", name: lang === "en" ? "left +20%+" : "左大 20%+", value: row.left_over_20, color: "#8aa4ff" },
      { key: "right_over_20", name: lang === "en" ? "right +20%+" : "右大 20%+", value: row.right_over_20, color: "#d9a3ff" },
      { key: "right_10_20", name: lang === "en" ? "right +10–20%" : "右大 10–20%", value: row.right_10_20, color: "#e6b35a" },
    ];
    chart.setOption(Object.assign(Desk.darkBase(), {
      tooltip: { trigger: "item" },
      series: [{
        type: "pie",
        radius: ["28%", "58%"],
        label: { color: "#f4efe4" },
        data: slices.map(function (slice) {
          return { name: slice.name, value: slice.value, itemStyle: { color: slice.color } };
        }),
      }],
    }), true);
    document.getElementById("ageOut").textContent = String(age);
    const table = document.getElementById("bins");
    table.innerHTML = "<tr><th>bin</th><th>n</th><th>%</th></tr>" + slices.map(function (slice) {
      return "<tr><td>" + slice.name + "</td><td>" + slice.value + "</td><td>" +
        (100 * slice.value / row.total).toFixed(1) + "</td></tr>";
    }).join("") +
      "<tr><td>" + (lang === "en" ? "same share" : "相同占比") + "</td><td colspan='2'>" + row.same_pct + "%</td></tr>";
  }

  function setAge(next) {
    age = next;
    if (age > 14) age = 2;
    if (age < 2) age = 14;
    document.getElementById("age").value = String(age);
    render();
  }

  document.getElementById("age").addEventListener("input", function (event) {
    setAge(Number(event.target.value));
  });
  document.getElementById("play").addEventListener("click", function () {
    if (timer) {
      clearInterval(timer);
      timer = null;
      this.setAttribute("aria-pressed", "false");
      this.textContent = "play";
      return;
    }
    this.setAttribute("aria-pressed", "true");
    this.textContent = "pause";
    timer = setInterval(function () { setAge(age + 1); }, 2000);
  });
  document.querySelector("[data-lang-toggle]").addEventListener("click", function () {
    setTimeout(render, 0);
  });
  render();
})();
