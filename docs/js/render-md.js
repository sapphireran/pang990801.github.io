(function (global) {
  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch];
    });
  }

  function inline(s) {
    s = escapeHtml(s);
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    return s;
  }

  function renderMarkdown(src) {
    var lines = src.replace(/\r\n/g, "\n").split("\n");
    var html = [];
    var i = 0;
    var inCode = false;
    var code = [];
    var listType = null;

    function closeList() {
      if (listType) {
        html.push(listType === "ul" ? "</ul>" : "</ol>");
        listType = null;
      }
    }

    function isTableSep(line) {
      return /^\s*\|?\s*:?-{3,}.*\|/.test(line);
    }

    while (i < lines.length) {
      var line = lines[i];
      if (line.indexOf("```") === 0) {
        if (!inCode) {
          closeList();
          inCode = true;
          code = [];
        } else {
          html.push("<pre><code>" + escapeHtml(code.join("\n")) + "</code></pre>");
          inCode = false;
        }
        i += 1;
        continue;
      }
      if (inCode) {
        code.push(line);
        i += 1;
        continue;
      }
      if (!line.trim()) {
        closeList();
        i += 1;
        continue;
      }
      if (line.charAt(0) === "#") {
        closeList();
        var m = line.match(/^(#{1,4})\s+(.*)$/);
        if (m) {
          var lvl = m[1].length;
          html.push("<h" + lvl + ">" + inline(m[2]) + "</h" + lvl + ">");
          i += 1;
          continue;
        }
      }
      if (line.indexOf("|") !== -1 && i + 1 < lines.length && isTableSep(lines[i + 1])) {
        closeList();
        var rows = [];
        while (i < lines.length && lines[i].indexOf("|") !== -1) {
          if (isTableSep(lines[i])) {
            i += 1;
            continue;
          }
          var cells = lines[i].replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map(function (c) {
            return c.trim();
          });
          rows.push(cells);
          i += 1;
        }
        var head = rows.shift() || [];
        html.push("<table><thead><tr>" + head.map(function (c) { return "<th>" + inline(c) + "</th>"; }).join("") + "</tr></thead><tbody>");
        rows.forEach(function (r) {
          html.push("<tr>" + r.map(function (c) { return "<td>" + inline(c) + "</td>"; }).join("") + "</tr>");
        });
        html.push("</tbody></table>");
        continue;
      }
      var ul = line.match(/^\s*[-*]\s+(.*)$/);
      if (ul) {
        if (listType !== "ul") {
          closeList();
          listType = "ul";
          html.push("<ul>");
        }
        html.push("<li>" + inline(ul[1]) + "</li>");
        i += 1;
        continue;
      }
      var ol = line.match(/^\s*\d+\.\s+(.*)$/);
      if (ol) {
        if (listType !== "ol") {
          closeList();
          listType = "ol";
          html.push("<ol>");
        }
        html.push("<li>" + inline(ol[1]) + "</li>");
        i += 1;
        continue;
      }
      closeList();
      var para = [line];
      while (i + 1 < lines.length) {
        var nxt = lines[i + 1];
        if (!nxt.trim()) break;
        if (nxt.charAt(0) === "#") break;
        if (nxt.indexOf("```") === 0) break;
        if (/^\s*[-*]\s+/.test(nxt) || /^\s*\d+\.\s+/.test(nxt)) break;
        if (nxt.indexOf("|") !== -1 && i + 2 < lines.length && isTableSep(lines[i + 2])) break;
        para.push(nxt);
        i += 1;
      }
      html.push("<p>" + inline(para.join(" ")) + "</p>");
      i += 1;
    }
    closeList();
    if (inCode) html.push("<pre><code>" + escapeHtml(code.join("\n")) + "</code></pre>");
    return html.join("\n");
  }

  var PAGES = [
    { file: "architecture.md", title: "Architecture" },
    { file: "charts.md", title: "Chart catalogue" },
    { file: "data-dictionary.md", title: "Data dictionary" },
    { file: "methodology.md", title: "How to read the pictures" },
    { file: "local-preview.md", title: "Local preview" },
    { file: "known-quirks.md", title: "Known quirks" }
  ];

  function currentFile() {
    var q = new URLSearchParams(location.search).get("doc");
    return q || "architecture.md";
  }

  function boot() {
    var nav = document.getElementById("docnav");
    var file = currentFile();
    PAGES.forEach(function (p) {
      var a = document.createElement("a");
      a.href = "index.html?doc=" + encodeURIComponent(p.file);
      a.textContent = p.title;
      if (p.file === file) a.className = "active";
      nav.appendChild(a);
    });
    var extra = document.createElement("a");
    extra.href = "../examples/index.html";
    extra.textContent = "Examples";
    nav.appendChild(extra);
    var dash = document.createElement("a");
    dash.href = "../index.html";
    dash.textContent = "Dashboard";
    nav.appendChild(dash);

    fetch(file).then(function (res) {
      if (!res.ok) throw new Error("Missing " + file + " (" + res.status + ")");
      return res.text();
    }).then(function (md) {
      document.getElementById("content").innerHTML = renderMarkdown(md);
      document.title = file.replace(".md", "") + " · foot-shape notes";
    }).catch(function (err) {
      document.getElementById("content").innerHTML = "<p class='err'>" + escapeHtml(err.message) + ". Serve the repo over http.</p>";
    });
  }

  global.DocsHub = { boot: boot, renderMarkdown: renderMarkdown, PAGES: PAGES };
})(window);
