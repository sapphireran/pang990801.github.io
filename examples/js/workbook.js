(function (global) {
  var S = global.CompanionStudio;

  function data() {
    return S.requireData();
  }

  function renderOls(outId, tableId) {
    var pack = data();
    var groups = {
      female: pack.heightShoe.female,
      male: pack.heightShoe.male,
      pooled: pack.heightShoe.female.concat(pack.heightShoe.male)
    };
    var html = "";
    Object.keys(groups).forEach(function (key) {
      var xs = groups[key].map(function (d) { return d.height_cm; });
      var ys = groups[key].map(function (d) { return d.shoe_cm; });
      var fit = S.ols(xs, ys);
      var r = S.pearson(xs, ys);
      html += "<tr><td>" + key + "</td><td>" + xs.length + "</td><td>" +
        S.fmt(r, 3) + "</td><td>" + S.fmt(fit.slope, 4) + "</td><td>" +
        S.fmt(fit.intercept, 3) + "</td><td>" + S.fmt(fit.rSquared, 3) + "</td></tr>";
    });
    document.getElementById(tableId).innerHTML =
      "<thead><tr><th>组</th><th>n</th><th>r</th><th>斜率</th><th>截距</th><th>R²</th></tr></thead><tbody>" +
      html + "</tbody>";

    var pooled = groups.pooled;
    var xs = pooled.map(function (d) { return d.height_cm; });
    var fit = S.ols(xs, pooled.map(function (d) { return d.shoe_cm; }));
    var sampleH = 120;
    var pred = fit.intercept + fit.slope * sampleH;
    document.getElementById(outId).innerHTML =
      "合并直线：鞋长 ≈ <strong>" + S.fmt(fit.slope, 4) + "</strong> × 身高 + <strong>" +
      S.fmt(fit.intercept, 3) + "</strong>。把 120 cm 代进去得到 <strong>" +
      S.fmt(pred, 2) + " cm</strong>。这只是这 398 个教学点的拟合，不是购鞋公式。";
  }

  function renderCrossover(tableId, noteId) {
    var rows = data().ageFoot;
    var first = rows.find(function (r) { return r.girl_minus_boy_cm < 0; });
    document.getElementById(tableId).innerHTML =
      "<thead><tr><th>年龄</th><th>女 cm</th><th>男 cm</th><th>女−男</th></tr></thead><tbody>" +
      rows.map(function (r) {
        var mark = r.age === first.age ? " style=\"background:#eef6ef\"" : "";
        return "<tr" + mark + "><td>" + r.age + "</td><td>" + r.girl_cm +
          "</td><td>" + r.boy_cm + "</td><td>" + r.girl_minus_boy_cm + "</td></tr>";
      }).join("") + "</tbody>";
    document.getElementById(noteId).textContent =
      "第一次男>女出现在 " + first.age + " 岁。8→9 岁两性同时回落，不要解释成脚缩短。";
  }

  function renderSymmetry(tableId, age14Id) {
    var rows = data().symmetry;
    document.getElementById(tableId).innerHTML =
      "<thead><tr><th>年龄</th><th>相同</th><th>左大10–20</th><th>左大>20</th><th>右大>20</th><th>右大10–20</th><th>相同%</th></tr></thead><tbody>" +
      rows.map(function (r) {
        return "<tr><td>" + r.age + "</td><td>" + r.same + "</td><td>" + r.left_10_20 +
          "</td><td>" + r.left_over_20 + "</td><td>" + r.right_over_20 +
          "</td><td>" + r.right_10_20 + "</td><td>" + r.same_pct.toFixed(1) + "</td></tr>";
      }).join("") + "</tbody>";
    var last = rows[rows.length - 1];
    document.getElementById(age14Id).textContent =
      "14 岁：相同 " + last.same + " / 总计 " + last.total + " = " + last.same_pct.toFixed(1) + "%。";
  }

  function gradeQuiz(form) {
    var answers = data().workbookAnswers;
    var key = {
      crossover: String(answers.crossover_age),
      r: String(answers.pooled_r_3dp),
      thin: String(answers.thin_ring_pct_1dp),
      same: String(answers.symmetry_same_pct_age_14_1dp),
      mismatch: String(answers.thickness_mismatch_count)
    };
    var score = 0;
    var total = 0;
    Object.keys(key).forEach(function (name) {
      total += 1;
      var picked = form.querySelector("[name='" + name + "']:checked");
      var nodes = form.querySelectorAll("[name='" + name + "']");
      nodes.forEach(function (node) {
        node.parentElement.classList.remove("correct", "wrong");
        if (node.value === key[name]) node.parentElement.classList.add("correct");
      });
      if (picked && picked.value === key[name]) {
        score += 1;
      } else if (picked) {
        picked.parentElement.classList.add("wrong");
      }
    });
    return { score: score, total: total, key: key };
  }

  global.CompanionWorkbook = {
    renderOls: renderOls,
    renderCrossover: renderCrossover,
    renderSymmetry: renderSymmetry,
    gradeQuiz: gradeQuiz
  };
})(window);
