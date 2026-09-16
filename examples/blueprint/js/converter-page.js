(function () {
  Blueprint.mount({
    kind: "examples",
    base: ".",
    docBase: "../../docs/blueprint",
    dashboard: "../../index.html",
    active: "converter"
  });

  var foot = Blueprint.$("#foot");
  var allow = Blueprint.$("#allow");
  var footNum = Blueprint.$("#foot-num");
  var stats = Blueprint.$("#size-stats");
  var stick = Blueprint.$("#stick");
  var table = Blueprint.$("#near-table");
  var f = Blueprint.fmt;

  function render() {
    var mm = Number(foot.value);
    var a = Number(allow.value);
    Blueprint.$("#foot-out").textContent = mm + " mm (" + f(mm / 10, 1) + " cm)";
    Blueprint.$("#allow-out").textContent = a + " mm → 楦长 " + (mm + a) + " mm";
    var s = Blueprint.convertSizes(mm, a);
    stats.innerHTML = [
      ["Mondopoint", s.mondopoint, "脚长"],
      ["中国号", f(s.cn_hao, 1), "脚长 cm"],
      ["EU", f(s.eu, 2), "楦长 / 6.67"],
      ["UK 童", f(s.uk_kids, 2), "从 4 in 起"],
      ["US 童", f(s.us_kids, 2), "UK+1"]
    ].map(function (row) {
      return '<div class="card stat"><b>' + row[1] + "</b><span>" + row[0] + " · " + row[2] + "</span></div>";
    }).join("");

    var marks = "";
    for (var x = 140; x <= 240; x += 10) {
      var left = ((x - 140) / 100) * 100;
      marks += '<div style="position:absolute;left:' + left + '%;top:0;bottom:0;border-left:1px solid #2a6a8d;"></div>';
      marks += '<div style="position:absolute;left:' + left + '%;top:28px;transform:translateX(-50%);color:#8fb4cc;font:11px monospace;">' + x + "</div>";
    }
    var pos = ((mm - 140) / 100) * 100;
    var lastPos = ((mm + a - 140) / 100) * 100;
    stick.innerHTML =
      '<div style="position:relative;height:64px;margin:1rem 0;background:rgba(127,211,255,0.06);border:1px solid #2a6a8d;">' +
      marks +
      '<div style="position:absolute;left:' + pos + '%;top:0;bottom:0;width:2px;background:#7fd3ff;"></div>' +
      '<div style="position:absolute;left:' + lastPos + '%;top:0;bottom:0;width:2px;background:#ffb86b;"></div>' +
      "</div>" +
      '<p class="lede">青线脚长，琥珀线楦长。轴是毫米，不是欧码。</p>';

    var nearby = Blueprint.payload().size_table_12mm.filter(function (row) {
      return Math.abs(row.foot_mm - mm) <= 15;
    });
    Blueprint.fillTable(table,
      ["脚长 mm", "号", "EU @12mm", "UK 童 @12mm"],
      nearby.map(function (row) {
        return [row.foot_mm, f(row.cn_hao, 1), f(row.eu, 2), f(row.uk_kids, 2)];
      }));
  }

  foot.addEventListener("input", function () {
    footNum.value = foot.value;
    render();
  });
  allow.addEventListener("input", render);
  footNum.addEventListener("change", function () {
    var v = Math.max(140, Math.min(240, Number(footNum.value) || 180));
    foot.value = String(v);
    footNum.value = String(v);
    render();
  });
  render();
})();
