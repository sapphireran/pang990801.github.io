(function (global) {
  const STORAGE_KEY = "yearbook-lang";

  function currentLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "zh" || stored === "en") return stored;
    return "zh";
  }

  function applyLang(lang) {
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
    document.body.setAttribute("data-lang", lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang-btn") === lang));
    });
    const title = document.querySelector("title");
    if (title && title.dataset.zh && title.dataset.en) {
      title.textContent = lang === "en" ? title.dataset.en : title.dataset.zh;
    }
  }

  function mountLang() {
    const host = document.querySelector("[data-lang-toggle]");
    if (!host) return;
    host.innerHTML =
      '<button type="button" data-lang-btn="zh">中文</button>' +
      '<button type="button" data-lang-btn="en">EN</button>';
    host.addEventListener("click", function (event) {
      const btn = event.target.closest("[data-lang-btn]");
      if (!btn) return;
      applyLang(btn.getAttribute("data-lang-btn"));
    });
  }

  function markNav() {
    const here = location.pathname.replace(/\/+$/, "");
    document.querySelectorAll(".nav a").forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href) return;
      const resolved = new URL(href, location.href).pathname.replace(/\/+$/, "");
      if (resolved === here) link.setAttribute("aria-current", "page");
    });
  }

  function pack() {
    if (!global.YEARBOOK) {
      throw new Error("YEARBOOK payload missing. Load data/yearbook/payload.js first.");
    }
    return global.YEARBOOK;
  }

  function chart(selector, theme) {
    const el = document.querySelector(selector);
    if (!el) throw new Error("Missing chart host " + selector);
    const instance = echarts.init(el, theme || "dark");
    window.addEventListener("resize", function () {
      instance.resize();
    });
    return instance;
  }

  function ols(points) {
    const n = points.length;
    if (n < 2) return null;
    let sx = 0;
    let sy = 0;
    for (let i = 0; i < n; i += 1) {
      sx += points[i][0];
      sy += points[i][1];
    }
    const mx = sx / n;
    const my = sy / n;
    let num = 0;
    let den = 0;
    let ssRes = 0;
    let ssTot = 0;
    for (let i = 0; i < n; i += 1) {
      const x = points[i][0];
      const y = points[i][1];
      num += (x - mx) * (y - my);
      den += (x - mx) * (x - mx);
    }
    const slope = den === 0 ? 0 : num / den;
    const intercept = my - slope * mx;
    for (let i = 0; i < n; i += 1) {
      const y = points[i][1];
      const yHat = slope * points[i][0] + intercept;
      ssRes += (y - yHat) * (y - yHat);
      ssTot += (y - my) * (y - my);
    }
    return {
      n: n,
      slope: slope,
      intercept: intercept,
      r2: ssTot === 0 ? 0 : 1 - ssRes / ssTot,
      mx: mx,
      my: my,
    };
  }

  function fitLine(points, fit) {
    if (!fit || !points.length) return [];
    const xs = points.map(function (p) { return p[0]; });
    const minX = Math.min.apply(null, xs);
    const maxX = Math.max.apply(null, xs);
    return [
      [minX, fit.slope * minX + fit.intercept],
      [maxX, fit.slope * maxX + fit.intercept],
    ];
  }

  function fmt(n, digits) {
    if (n === null || n === undefined || Number.isNaN(n)) return "—";
    return Number(n).toFixed(digits == null ? 2 : digits);
  }

  function darkBase() {
    return {
      backgroundColor: "rgba(0,0,0,0)",
      textStyle: { color: "#f4efe4" },
      tooltip: { trigger: "axis" },
      grid: { left: 48, right: 24, top: 40, bottom: 40, containLabel: true },
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    mountLang();
    applyLang(currentLang());
    markNav();
  });

  global.Desk = {
    pack: pack,
    chart: chart,
    ols: ols,
    fitLine: fitLine,
    fmt: fmt,
    darkBase: darkBase,
    applyLang: applyLang,
    currentLang: currentLang,
  };
})(window);
