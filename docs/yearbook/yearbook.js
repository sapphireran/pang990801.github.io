(function () {
  const STORAGE_KEY = "yearbook-lang";

  function currentLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "zh" || stored === "en") return stored;
    return document.documentElement.lang === "en" ? "en" : "zh";
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

  function mountToggle() {
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

  function markCurrentNav() {
    const here = location.pathname.replace(/\/+$/, "");
    document.querySelectorAll(".nav a").forEach(function (link) {
      const href = link.getAttribute("href");
      if (!href) return;
      const resolved = new URL(href, location.href).pathname.replace(/\/+$/, "");
      if (resolved === here) link.setAttribute("aria-current", "page");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    mountToggle();
    applyLang(currentLang());
    markCurrentNav();
  });
})();
