(function () {
  var rows = Desk.data().symmetry.rows;
  var pie = Desk.init("#sym-pie");
  var bars = Desk.init("#sym-bars");
  var current = 0;

  function setButtons() {
    var host = document.getElementById("age-buttons");
    host.innerHTML = "";
    rows.forEach(function (row, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = row.age;
      btn.setAttribute("aria-pressed", String(i === current));
      btn.addEventListener("click", function () {
        current = i;
        render();
      });
      host.appendChild(btn);
    });
  }

  function render() {
    var row = rows[current];
    document.getElementById("formula-readout").textContent =
      row.age +
      " · same=" +
      row.same +
      " · a=" +
      row.left_10_20 +
      " · b=" +
      row.left_over_20 +
      " · c=" +
      row.right_over_20 +
      " · d=" +
      row.right_10_20 +
      " · total=" +
      row.total;

    var pieData = [
      { name: "双脚相同", value: row.same },
      { name: "左脚大 10–20%", value: row.left_10_20 },
      { name: "左脚大 20%+", value: row.left_over_20 },
      { name: "右脚大 20%+", value: row.right_over_20 },
      { name: "右脚大 10–20%", value: row.right_10_20 }
    ];

    pie.setOption({
      backgroundColor: "transparent",
      tooltip: { trigger: "item" },
      legend: { bottom: 0, textStyle: { color: Desk.cream } },
      series: [{
        type: "pie",
        radius: ["32%", "58%"],
        label: { color: Desk.cream },
        data: pieData
      }]
    }, true);

    bars.setOption({
      backgroundColor: "transparent",
      tooltip: { trigger: "axis" },
      legend: { textStyle: { color: Desk.cream } },
      grid: { left: 48, right: 16, top: 32, bottom: 36 },
      xAxis: Object.assign(Desk.axis(""), { type: "category", data: rows.map(function (r) { return r.age; }) }),
      yAxis: Object.assign(Desk.axis("公式份额"), { type: "value" }),
      series: [
        { name: "相同", type: "line", data: rows.map(function (r) { return r.same; }), color: Desk.teal },
        { name: "左 10–20%", type: "line", data: rows.map(function (r) { return r.left_10_20; }), color: Desk.rose },
        { name: "右 10–20%", type: "line", data: rows.map(function (r) { return r.right_10_20; }), color: Desk.amber }
      ]
    }, true);

    setButtons();
  }

  render();
})();
