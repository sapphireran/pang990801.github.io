(function (global) {
  var LINKS = [
    { id: "dash", href: "index.html", label: "仪表盘" },
    { id: "notes", href: "docs/index.html", label: "伴读" },
    { id: "encodings", href: "examples/encodings/index.html", label: "图解" },
    { id: "workbook", href: "examples/workbook/index.html", label: "练习" },
    { id: "tour", href: "examples/tour/index.html", label: "导览" }
  ];

  function join(base, rel) {
    if (!base || base === ".") return rel;
    return base.replace(/\/$/, "") + "/" + rel;
  }

  function mount(options) {
    options = options || {};
    var base = options.base || ".";
    var active = options.active || "";
    if (document.querySelector(".studio-bar")) return;

    var bar = document.createElement("header");
    bar.className = "studio-bar";
    bar.innerHTML =
      '<a class="studio-brand" href="' + join(base, "docs/index.html") + '">脚型伴读</a>' +
      '<nav class="studio-nav">' +
      LINKS.map(function (link) {
        var cls = link.id === active ? ' class="active"' : "";
        return '<a' + cls + ' href="' + join(base, link.href) + '">' + link.label + "</a>";
      }).join("") +
      "</nav>";
    document.body.insertBefore(bar, document.body.firstChild);

    var footer = document.createElement("p");
    footer.className = "footer";
    footer.textContent =
      "Personal teaching companion for the 2020 children’s foot-shape Pages site. Not a clinical reference.";
    document.body.appendChild(footer);
  }

  function mean(xs) {
    return xs.reduce(function (a, b) { return a + b; }, 0) / xs.length;
  }

  function pearson(xs, ys) {
    var mx = mean(xs);
    var my = mean(ys);
    var num = 0;
    var dx = 0;
    var dy = 0;
    for (var i = 0; i < xs.length; i++) {
      var a = xs[i] - mx;
      var b = ys[i] - my;
      num += a * b;
      dx += a * a;
      dy += b * b;
    }
    return num / Math.sqrt(dx * dy);
  }

  function ols(xs, ys) {
    var mx = mean(xs);
    var my = mean(ys);
    var num = 0;
    var den = 0;
    for (var i = 0; i < xs.length; i++) {
      num += (xs[i] - mx) * (ys[i] - my);
      den += (xs[i] - mx) * (xs[i] - mx);
    }
    var slope = num / den;
    var intercept = my - slope * mx;
    var ssRes = 0;
    var ssTot = 0;
    for (var j = 0; j < xs.length; j++) {
      var fit = intercept + slope * xs[j];
      ssRes += (ys[j] - fit) * (ys[j] - fit);
      ssTot += (ys[j] - my) * (ys[j] - my);
    }
    return {
      slope: slope,
      intercept: intercept,
      rSquared: 1 - ssRes / ssTot
    };
  }

  function bin2d(points, xMin, xMax, yMin, yMax, nx, ny) {
    var cells = [];
    var i;
    for (i = 0; i < nx * ny; i++) cells.push(0);
    var xSpan = xMax - xMin;
    var ySpan = yMax - yMin;
    points.forEach(function (p) {
      var cx = Math.min(nx - 1, Math.max(0, Math.floor(((p[0] - xMin) / xSpan) * nx)));
      var cy = Math.min(ny - 1, Math.max(0, Math.floor(((p[1] - yMin) / ySpan) * ny)));
      cells[cy * nx + cx] += 1;
    });
    var data = [];
    for (var y = 0; y < ny; y++) {
      for (var x = 0; x < nx; x++) {
        data.push([x, y, cells[y * nx + x]]);
      }
    }
    return {
      data: data,
      xEdges: Array.from({ length: nx }, function (_, idx) {
        return xMin + (idx + 0.5) * xSpan / nx;
      }),
      yEdges: Array.from({ length: ny }, function (_, idx) {
        return yMin + (idx + 0.5) * ySpan / ny;
      })
    };
  }

  function fmt(n, digits) {
    if (typeof n !== "number" || !isFinite(n)) return "—";
    return n.toFixed(digits);
  }

  function requireData() {
    if (!global.COMPANION_DATA) {
      throw new Error("COMPANION_DATA is not loaded");
    }
    return global.COMPANION_DATA;
  }

  global.CompanionStudio = {
    mount: mount,
    mean: mean,
    pearson: pearson,
    ols: ols,
    bin2d: bin2d,
    fmt: fmt,
    requireData: requireData
  };
})(window);
