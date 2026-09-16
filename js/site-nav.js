(function () {
  var pages = [
    { id: "home", href: "../index.html", label: "总览看板" },
    { id: "docs", href: "../docs/index.html", label: "文档" },
    { id: "examples", href: "../examples/index.html", label: "示例" }
  ];

  var docLinks = [
    { id: "docs-index", href: "../docs/index.html", label: "文档首页" },
    { id: "docs-methodology", href: "../docs/methodology.html", label: "测量与读图" },
    { id: "docs-dictionary", href: "../docs/data-dictionary.html", label: "数据字典" },
    { id: "docs-charts", href: "../docs/chart-guide.html", label: "图表说明" },
    { id: "docs-limits", href: "../docs/limitations.html", label: "范围与局限" }
  ];

  var exampleLinks = [
    { id: "ex-index", href: "../examples/index.html", label: "示例目录" },
    { id: "ex-growth", href: "../examples/growth.html", label: "年龄与脚长" },
    { id: "ex-shoe", href: "../examples/shoe-size.html", label: "身高估鞋码" },
    { id: "ex-symmetry", href: "../examples/symmetry.html", label: "左右脚比例" },
    { id: "ex-radar", href: "../examples/radar.html", label: "分年龄画像" },
    { id: "ex-pressure", href: "../examples/pressure.html", label: "足底压力" },
    { id: "ex-thickness", href: "../examples/thickness.html", label: "皮下厚度" }
  ];

  var current = document.body.getAttribute("data-nav") || "";
  var section = current.indexOf("ex-") === 0 ? "examples" : current.indexOf("docs") === 0 ? "docs" : "home";

  function linkList(items) {
    return items.map(function (item) {
      var active = item.id === current || (item.id === section && (current === "docs" || current === "examples")) ? " is-active" : "";
      if (item.id === "docs" && current.indexOf("docs") === 0) {
        active = " is-active";
      }
      if (item.id === "examples" && current.indexOf("ex-") === 0) {
        active = " is-active";
      }
      return '<a class="' + active.trim() + '" href="' + item.href + '">' + item.label + "</a>";
    }).join("");
  }

  var header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML =
      '<div class="site-brand">' +
        "<strong>儿童脚型可视化</strong>" +
        "<span>个人项目文档与示例</span>" +
      "</div>" +
      '<nav class="site-nav">' + linkList(pages) + "</nav>";
  }

  var side = document.getElementById("site-side");
  if (side) {
    var sideItems = section === "examples" ? exampleLinks : docLinks;
    var title = section === "examples" ? "Examples" : "Docs";
    side.innerHTML = "<h2>" + title + "</h2>" + linkList(sideItems);
  }

  var footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML =
      "个人练习项目，数据仅供读图与前端示例使用，不是临床或制鞋标准。" +
      ' 源数据在 <a href="../data/README.md">/data</a>。';
  }
})();
