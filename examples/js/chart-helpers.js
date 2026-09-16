(function (global) {
  var NAV = [
    { id: "gallery", href: "index.html", label: "Gallery" },
    { id: "height-shoe", href: "height-shoe-scatter.html", label: "Height × size" },
    { id: "age-foot", href: "age-foot-length.html", label: "Age × length" },
    { id: "bmi", href: "bmi-foot-ratio.html", label: "BMI" },
    { id: "bilateral", href: "bilateral-symmetry.html", label: "L/R mix" },
    { id: "radar", href: "growth-radar.html", label: "Radar" },
    { id: "pressure", href: "plantar-pressure.html", label: "Pressure" },
    { id: "thickness", href: "tissue-thickness.html", label: "Thickness" },
    { id: "browser", href: "data-browser.html", label: "JSON" },
    { id: "docs", href: "../docs/index.html", label: "Docs" },
    { id: "board", href: "../index.html", label: "Dashboard" }
  ];

  function mountNav(activeId) {
    var bar = document.createElement("nav");
    bar.className = "topnav";
    var brand = document.createElement("a");
    brand.className = "brand";
    brand.href = "index.html";
    brand.textContent = "Foot-shape examples";
    bar.appendChild(brand);
    NAV.forEach(function (item) {
      var a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.label;
      a.setAttribute("data-nav", item.id);
      if (item.id === activeId) a.className = "active";
      bar.appendChild(a);
    });
    document.body.insertBefore(bar, document.body.firstChild);
  }

  function showError(message) {
    var el = document.createElement("div");
    el.className = "banner";
    el.setAttribute("role", "alert");
    el.textContent = message;
    document.body.insertBefore(el, document.querySelector(".wrap") || null);
  }

  function loadJSON(relPath) {
    return fetch(relPath).then(function (res) {
      if (!res.ok) {
        throw new Error("Could not load " + relPath + " (" + res.status + "). Serve the repo over http, not file://.");
      }
      return res.json();
    });
  }

  function bindChart(dom, option) {
    if (typeof echarts === "undefined") {
      throw new Error("ECharts did not load.");
    }
    var chart = echarts.init(dom, "dark");
    chart.setOption(option);
    window.addEventListener("resize", function () {
      chart.resize();
    });
    return chart;
  }

  function fmt(n, digits) {
    if (typeof n !== "number") return n;
    return n.toFixed(digits == null ? 2 : digits);
  }

  global.FootViz = {
    mountNav: mountNav,
    showError: showError,
    loadJSON: loadJSON,
    bindChart: bindChart,
    fmt: fmt
  };
})(window);
