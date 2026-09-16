(function () {
  Blueprint.mount({
    kind: "examples",
    base: ".",
    docBase: "../../docs/blueprint",
    dashboard: "../../index.html",
    active: "vignettes"
  });

  var f = Blueprint.fmt;
  var root = Blueprint.$("#cards");
  Blueprint.payload().vignettes.forEach(function (v, i) {
    var other = v.sex === "girl" ? "boy" : "girl";
    var here = Blueprint.predictShoe(v.height_cm, v.sex);
    var there = Blueprint.predictShoe(v.height_cm, other);
    var lineGapMm = Math.abs(here.predicted_cm - there.predicted_cm) * 10;
    var sizes = Blueprint.convertSizes(v.shoe_cm * 10, 12);
    var midSizes = Blueprint.convertSizes(v.predicted_cm * 10, 12);
    var article = document.createElement("article");
    article.className = "card";
    article.innerHTML =
      "<h3>" + (i + 1) + ". " + v.title_zh + "</h3>" +
      "<p>" + v.title_en + "</p>" +
      "<p><span class=\"swatch " + v.sex + "\"></span>" +
      (v.sex === "girl" ? "女童" : "男童") +
      " · 身高 " + f(v.height_cm, 2) + " cm · 鞋长 " + f(v.shoe_cm, 2) + " cm</p>" +
      "<p><strong>" + v.prompt_zh + "</strong><br/>" + v.prompt_en + "</p>" +
      "<p><button type=\"button\" data-i=\"" + i + "\">显示参考读法</button></p>" +
      '<div class="answer" hidden id="ans-' + i + '"></div>';
    root.appendChild(article);
    Blueprint.$("#ans-" + i).innerHTML =
      "相对本性别中线 " + (v.residual_cm >= 0 ? "+" : "") + f(v.residual_cm, 2) +
      " cm。同身高两条性别中线相差 " + f(lineGapMm, 1) +
      " mm。<br/>按实测鞋长 + 12 mm：Mondopoint " + sizes.mondopoint +
      "，号 " + f(sizes.cn_hao, 1) +
      "，EU " + f(sizes.eu, 2) +
      "，UK 童 " + f(sizes.uk_kids, 2) +
      "。<br/>若误用中线鞋长，Mondopoint 会变成 " + midSizes.mondopoint +
      "。1 cm 残差 ≈ 1.5 个巴黎点 ≈ 1.2 个 UK 童码。";
  });

  root.addEventListener("click", function (ev) {
    var btn = ev.target.closest("button[data-i]");
    if (!btn) return;
    var box = Blueprint.$("#ans-" + btn.getAttribute("data-i"));
    box.hidden = !box.hidden;
    btn.textContent = box.hidden ? "显示参考读法" : "收起";
  });
})();
