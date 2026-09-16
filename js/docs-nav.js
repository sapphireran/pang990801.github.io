/**
 * Shared header for personal docs and example pages.
 * Set window.DOCS_ROOT ("" or "..") before this script runs, or use
 * <script data-root="..">.
 */
(function () {
  "use strict";
  var script = document.currentScript;
  var root = (window.DOCS_ROOT !== undefined
    ? window.DOCS_ROOT
    : script && script.getAttribute("data-root")) || "..";
  if (root === ".") {
    root = "";
  }
  function href(path) {
    return root ? root + "/" + path : path;
  }
  var path = window.location.pathname;
  function active(fragment) {
    return path.indexOf(fragment) !== -1 ? " class=\"is-active\"" : "";
  }
  var nav =
    '<div class="docs-bar">' +
    '<a class="docs-brand" href="' + href("index.html") + '">儿童脚型可视化</a>' +
    '<nav class="docs-nav">' +
    '<a href="' + href("index.html") + '">总览</a>' +
    '<a href="' + href("docs/index.html") + '"' + active("/docs/") + ">说明</a>" +
    '<a href="' + href("examples/index.html") + '"' + active("/examples/") + ">示例</a>" +
    '<a href="' + href("docs/data-dictionary.html") + '"' + active("/docs/data-dictionary") + ">数据</a>" +
    "</nav></div>";
  var mount = document.getElementById("site-nav");
  if (mount) {
    mount.innerHTML = nav;
  } else {
    document.body.insertAdjacentHTML("afterbegin", nav);
  }
})();
