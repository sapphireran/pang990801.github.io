(function () {
  var path = (location.pathname.split("/").pop() || "index.html").replace(/^\s+|\s+$/g, "");
  if (!path) path = "index.html";
  document.querySelectorAll(".desk-nav a").forEach(function (link) {
    var href = link.getAttribute("href") || "";
    var leaf = href.split("/").pop();
    if (leaf === path || (path === "index.html" && href === "index.html")) {
      link.setAttribute("aria-current", "page");
      link.classList.add("is-current");
    }
  });

  var stamp = document.querySelector("[data-desk-stamp]");
  if (stamp) {
    var now = new Date();
    stamp.textContent =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0");
  }
})();
