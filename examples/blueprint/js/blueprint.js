(function (global) {
  var Blueprint = {};

  function payload() {
    if (!global.BLUEPRINT_PAYLOAD) {
      throw new Error("BLUEPRINT_PAYLOAD missing — load data/blueprint/payload.js first");
    }
    return global.BLUEPRINT_PAYLOAD;
  }

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function fmt(n, digits) {
    if (n === null || n === undefined || Number.isNaN(n)) return "—";
    return Number(n).toFixed(digits === undefined ? 2 : digits);
  }

  function convertSizes(footMm, allowanceMm) {
    var allow = allowanceMm === undefined ? 12 : Number(allowanceMm);
    var foot = Number(footMm);
    var last = foot + allow;
    var uk = (last - 101.6) / 8.46;
    return {
      foot_mm: foot,
      foot_cm: foot / 10,
      allowance_mm: allow,
      last_mm: last,
      mondopoint: Math.round(foot),
      cn_hao: Math.round((foot / 10) * 10) / 10,
      eu: last / (20 / 3),
      uk_kids: uk,
      us_kids: uk + 1
    };
  }

  function predictShoe(heightCm, sex) {
    var data = payload();
    var ols = sex === "boy" ? data.stats.boy_ols : data.stats.girl_ols;
    var y = ols.intercept + ols.slope * Number(heightCm);
    return {
      sex: sex,
      height_cm: Number(heightCm),
      predicted_cm: y,
      resid_sd: ols.resid_sd,
      low1: y - ols.resid_sd,
      high1: y + ols.resid_sd,
      low2: y - 2 * ols.resid_sd,
      high2: y + 2 * ols.resid_sd,
      ols: ols
    };
  }

  function nearestPoints(heightCm, sex, limit) {
    var group = payload().height_shoe[sex === "boy" ? "boy" : "girl"].points;
    var scored = group.map(function (p) {
      return { d: Math.abs(p.height_cm - heightCm), p: p };
    });
    scored.sort(function (a, b) { return a.d - b.d; });
    return scored.slice(0, limit || 8).map(function (row) { return row.p; });
  }

  function binForHeight(heightCm) {
    var bins = payload().height_bins;
    var h = Number(heightCm);
    for (var i = 0; i < bins.length; i += 1) {
      if (h >= bins[i].lo && h < bins[i].hi) return bins[i];
    }
    return null;
  }

  var DOC_LINKS = [
    { id: "hub", href: "index.html", label: "工坊首页" },
    { id: "systems", href: "systems.html", label: "尺码体系" },
    { id: "allowance", href: "allowance.html", label: "放余量" },
    { id: "protocol", href: "protocol.html", label: "测量" },
    { id: "fit", href: "fit-check.html", label: "试穿核对" },
    { id: "terms", href: "terms.html", label: "对照词表" },
    { id: "appendix", href: "appendix.html", label: "计算附录" },
    { id: "caveats", href: "caveats.html", label: "范围" }
  ];

  var EXAMPLE_LINKS = [
    { id: "examples", href: "index.html", label: "示例首页" },
    { id: "converter", href: "converter.html", label: "换算尺" },
    { id: "fitting", href: "fitting.html", label: "身高估长" },
    { id: "atlas", href: "growth-atlas.html", label: "生长图集" },
    { id: "last", href: "last-blueprint.html", label: "楦型蓝图" },
    { id: "kit", href: "field-kit.html", label: "测量纸" },
    { id: "vignettes", href: "vignettes.html", label: "读图个案" },
    { id: "leftover", href: "leftover-fit.html", label: "残差" }
  ];

  function mount(opts) {
    opts = opts || {};
    var kind = opts.kind || "docs";
    var base = opts.base || ".";
    var exampleBase = opts.exampleBase || "../examples/blueprint";
    var docBase = opts.docBase || "../docs/blueprint";
    var dash = opts.dashboard || "../../index.html";
    var links = kind === "examples" ? EXAMPLE_LINKS : DOC_LINKS;
    var otherHref = kind === "examples" ? docBase + "/index.html" : exampleBase + "/index.html";
    var otherLabel = kind === "examples" ? "阅读页" : "交互示例";
    var nav = links.map(function (item) {
      var href = item.href.indexOf("http") === 0 ? item.href : (base + "/" + item.href).replace(/\/+/g, "/");
      if (base === ".") href = item.href;
      var cls = item.id === opts.active ? " active" : "";
      return '<a class="' + cls.trim() + '" href="' + href + '">' + item.label + "</a>";
    }).join("");

    var bar = document.createElement("header");
    bar.className = "bp-bar";
    bar.innerHTML =
      '<a class="bp-brand" href="' + (kind === "examples" ? "index.html" : "index.html") + '">' +
        "Blueprint Workshop" +
        "<small>儿童脚型蓝图工坊 · 个人笔记</small>" +
      "</a>" +
      '<nav class="bp-nav">' +
        nav +
        '<a href="' + otherHref + '">' + otherLabel + "</a>" +
        '<a href="' + dash + '">返回总览</a>' +
      "</nav>";
    document.body.insertBefore(bar, document.body.firstChild);

    if (!document.querySelector("footer.bp-foot")) {
      var foot = document.createElement("footer");
      foot.className = "bp-foot wrap";
      foot.innerHTML =
        "Personal study pages for <code>pang990801.github.io</code>. " +
        "Not a sampling frame, not a last spec, not medical advice.";
      document.body.appendChild(foot);
    }
  }

  function fillTable(el, headers, rows) {
    var thead = "<thead><tr>" + headers.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead>";
    var body = rows.map(function (row) {
      return "<tr>" + row.map(function (cell) { return "<td>" + cell + "</td>"; }).join("") + "</tr>";
    }).join("");
    el.innerHTML = thead + "<tbody>" + body + "</tbody>";
  }

  function echartsTheme() {
    return {
      backgroundColor: "rgba(7,22,39,0.15)",
      textStyle: { color: "#d7ecff" },
      legend: { textStyle: { color: "#d7ecff" } },
      categoryAxis: {
        axisLine: { lineStyle: { color: "#2a6a8d" } },
        axisLabel: { color: "#8fb4cc" },
        splitLine: { lineStyle: { color: "rgba(127,211,255,0.08)" } }
      },
      valueAxis: {
        axisLine: { lineStyle: { color: "#2a6a8d" } },
        axisLabel: { color: "#8fb4cc" },
        splitLine: { lineStyle: { color: "rgba(127,211,255,0.12)" } }
      }
    };
  }

  Blueprint.payload = payload;
  Blueprint.$ = $;
  Blueprint.$$ = $$;
  Blueprint.fmt = fmt;
  Blueprint.convertSizes = convertSizes;
  Blueprint.predictShoe = predictShoe;
  Blueprint.nearestPoints = nearestPoints;
  Blueprint.binForHeight = binForHeight;
  Blueprint.mount = mount;
  Blueprint.fillTable = fillTable;
  Blueprint.theme = echartsTheme;
  global.Blueprint = Blueprint;
})(window);
