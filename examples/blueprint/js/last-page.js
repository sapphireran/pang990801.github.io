(function () {
  Blueprint.mount({
    kind: "examples",
    base: ".",
    docBase: "../../docs/blueprint",
    dashboard: "../../index.html",
    active: "last"
  });

  var P = Blueprint.payload();
  var ageEl = Blueprint.$("#age");
  var cmpEl = Blueprint.$("#compare");

  P.radar.forEach(function (row) {
    var o = document.createElement("option");
    o.value = String(row.age);
    o.textContent = row.age + " 岁";
    ageEl.appendChild(o);
    if (row.age !== 9) {
      var c = o.cloneNode(true);
      cmpEl.appendChild(c);
    }
  });
  ageEl.value = "12";

  function scores(age) {
    return P.radar.filter(function (r) { return r.age === Number(age); })[0];
  }

  function axis(row, name) {
    return row.axes.filter(function (a) { return a.name_zh === name; })[0].score;
  }

  function lastPath(row, ox, oy, scale) {
    var L = axis(row, "脚长") / 100;
    var ball = axis(row, "跖趾围长") / 100;
    var instep = axis(row, "跗骨围长") / 100;
    var heel = axis(row, "兜跟围长") / 100;
    var len = 220 * (0.7 + 0.6 * L) * scale;
    var heelW = 28 * (0.6 + heel) * scale;
    var ballW = 46 * (0.55 + ball) * scale;
    var instepW = 38 * (0.55 + instep) * scale;
    var x0 = ox, y0 = oy;
    return [
      "M", x0, y0,
      "C", x0 + len * 0.18, y0 - heelW, x0 + len * 0.42, y0 - instepW, x0 + len * 0.68, y0 - ballW,
      "C", x0 + len * 0.86, y0 - ballW * 0.7, x0 + len * 0.98, y0 - 8 * scale, x0 + len, y0,
      "C", x0 + len * 0.98, y0 + 8 * scale, x0 + len * 0.86, y0 + ballW * 0.55, x0 + len * 0.68, y0 + ballW * 0.72,
      "C", x0 + len * 0.42, y0 + instepW * 0.85, x0 + len * 0.18, y0 + heelW * 0.7, x0, y0,
      "Z"
    ].join(" ");
  }

  function render() {
    var row = scores(ageEl.value);
    var cmp = cmpEl.value ? scores(cmpEl.value) : null;
    var svg = [
      '<svg class="dim-svg" viewBox="0 0 720 360" role="img" aria-label="Last blueprint">',
      '<rect width="720" height="360" fill="#071627"/>',
      '<text x="24" y="28" fill="#ffb86b" font-size="12" font-family="monospace">DRAWING · LAST PLAN / SIDE HINT</text>',
      '<text x="24" y="48" fill="#8fb4cc" font-size="12" font-family="monospace">SCORES 0-100 · NOT MILLIMETRES</text>'
    ].join("");
    if (cmp) {
      svg += '<path d="' + lastPath(cmp, 80, 150, 1) + '" fill="none" stroke="#5d7f99" stroke-width="1.5" stroke-dasharray="6 4"/>';
    }
    svg += '<path d="' + lastPath(row, 80, 150, 1) + '" fill="rgba(127,211,255,0.08)" stroke="#7fd3ff" stroke-width="2"/>';
    svg += '<line x1="80" y1="292" x2="560" y2="292" stroke="#ffb86b"/>';
    svg += '<text x="320" y="314" fill="#ffb86b" font-size="12" text-anchor="middle">脚长分数 ' + axis(row, "脚长") + "</text>";
    svg += '<text x="560" y="80" fill="#3ad6c4" font-size="12">跖围 ' + axis(row, "跖趾围长") + "</text>";
    svg += "</svg>";
    Blueprint.$("#drawing").innerHTML = svg;
    Blueprint.fillTable(Blueprint.$("#axes"),
      ["轴", "分数", "在示意图里管什么"],
      row.axes.map(function (a) {
        var role = {
          "身高": "不进轮廓，只作对照",
          "体重": "不进轮廓，只作对照",
          "鞋码": "分数，不是号",
          "脚长": "轮廓长度",
          "跖趾围长": "前掌宽度",
          "跗骨围长": "中段宽度",
          "兜跟围长": "后跟宽度"
        }[a.name_zh];
        return [a.name_zh, a.score, role || "—"];
      }));
  }

  ageEl.addEventListener("change", render);
  cmpEl.addEventListener("change", render);
  render();
})();
