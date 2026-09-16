(function (global) {
  var ALLOWED = {
    "README.md": true,
    "architecture.md": true,
    "charts.md": true,
    "data-dictionary.md": true,
    "styling.md": true,
    "measurement-notes.md": true,
    "examples-guide.md": true
  };

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function inline(text) {
    var out = escapeHtml(text);
    out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, label, href) {
      var safe = String(href);
      if (!/^(https?:|mailto:|#|\.\/|\.\.\/|[A-Za-z0-9._-]+\.(md|html|json|js|css))/i.test(safe)) {
        return label;
      }
      var extra = /\.md$/i.test(safe) && safe.indexOf("http") !== 0
        ? "read.html?f=" + encodeURIComponent(safe.replace(/^\.\//, ""))
        : safe;
      return '<a href="' + extra + '">' + label + "</a>";
    });
    return out;
  }

  function render(md) {
    var lines = md.replace(/\r\n/g, "\n").split("\n");
    var html = [];
    var i = 0;
    var inCode = false;
    var code = [];
    var inList = false;
    var inTable = false;

    function closeList() {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
    }
    function closeTable() {
      if (inTable) {
        html.push("</tbody></table>");
        inTable = false;
      }
    }

    while (i < lines.length) {
      var line = lines[i];

      if (line.indexOf("```") === 0) {
        closeList();
        closeTable();
        if (!inCode) {
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

      if (/^\s*\|/.test(line)) {
        closeList();
        if (!inTable) {
          html.push("<table>");
          inTable = true;
          var cells = line.split("|").slice(1, -1).map(function (c) { return "<th>" + inline(c.trim()) + "</th>"; });
          html.push("<thead><tr>" + cells.join("") + "</tr></thead><tbody>");
          if (i + 1 < lines.length && /^\s*\|?\s*-+/.test(lines[i + 1])) i += 1;
        } else if (!/^\s*\|?\s*-+/.test(line)) {
          var tds = line.split("|").slice(1, -1).map(function (c) { return "<td>" + inline(c.trim()) + "</td>"; });
          html.push("<tr>" + tds.join("") + "</tr>");
        }
        i += 1;
        continue;
      }
      closeTable();

      var heading = /^(#{1,3})\s+(.*)$/.exec(line);
      if (heading) {
        closeList();
        var level = heading[1].length;
        html.push("<h" + level + ">" + inline(heading[2]) + "</h" + level + ">");
        i += 1;
        continue;
      }

      if (/^\s*[-*]\s+/.test(line)) {
        if (!inList) {
          html.push("<ul>");
          inList = true;
        }
        html.push("<li>" + inline(line.replace(/^\s*[-*]\s+/, "")) + "</li>");
        i += 1;
        continue;
      }
      closeList();

      if (/^\s*\d+\.\s+/.test(line)) {
        var items = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
          items.push("<li>" + inline(lines[i].replace(/^\s*\d+\.\s+/, "")) + "</li>");
          i += 1;
        }
        html.push("<ol>" + items.join("") + "</ol>");
        continue;
      }

      if (!line.trim()) {
        i += 1;
        continue;
      }

      html.push("<p>" + inline(line) + "</p>");
      i += 1;
    }
    closeList();
    closeTable();
    if (inCode) html.push("<pre><code>" + escapeHtml(code.join("\n")) + "</code></pre>");
    return html.join("\n");
  }

  function requestedFile() {
    var params = new URLSearchParams(window.location.search);
    var name = params.get("f") || "README.md";
    name = name.replace(/^.*[\\/]/, "");
    if (!ALLOWED[name]) return null;
    return name;
  }

  global.DocsMd = {
    requestedFile: requestedFile,
    render: render,
    escapeHtml: escapeHtml
  };
})(window);
