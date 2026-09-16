(function (global) {
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function inline(text) {
    var escaped = escapeHtml(text);
    return escaped
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  }

  function renderTable(rows) {
    var html = ["<table>"];
    rows.forEach(function (row, index) {
      var cells = row.split("|").slice(1, -1).map(function (cell) {
        return cell.trim();
      });
      if (index === 1 && cells.every(function (cell) { return /^:?-+:?$/.test(cell); })) {
        return;
      }
      var tag = index === 0 ? "th" : "td";
      html.push("<tr>" + cells.map(function (cell) {
        return "<" + tag + ">" + inline(cell) + "</" + tag + ">";
      }).join("") + "</tr>");
    });
    html.push("</table>");
    return html.join("");
  }

  function render(markdown) {
    var lines = markdown.replace(/\r\n/g, "\n").split("\n");
    var out = [];
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];
      if (line.indexOf("```") === 0) {
        var fence = [];
        i += 1;
        while (i < lines.length && lines[i].indexOf("```") !== 0) {
          fence.push(escapeHtml(lines[i]));
          i += 1;
        }
        out.push("<pre><code>" + fence.join("\n") + "</code></pre>");
        i += 1;
        continue;
      }
      if (line.charAt(0) === "|") {
        var table = [];
        while (i < lines.length && lines[i].charAt(0) === "|") {
          table.push(lines[i]);
          i += 1;
        }
        out.push(renderTable(table));
        continue;
      }
      if (/^### /.test(line)) {
        out.push("<h3>" + inline(line.slice(4)) + "</h3>");
        i += 1;
        continue;
      }
      if (/^## /.test(line)) {
        out.push("<h2>" + inline(line.slice(3)) + "</h2>");
        i += 1;
        continue;
      }
      if (/^# /.test(line)) {
        out.push("<h1>" + inline(line.slice(2)) + "</h1>");
        i += 1;
        continue;
      }
      if (/^[-*] /.test(line)) {
        var items = [];
        while (i < lines.length && /^[-*] /.test(lines[i])) {
          items.push("<li>" + inline(lines[i].slice(2)) + "</li>");
          i += 1;
        }
        out.push("<ul>" + items.join("") + "</ul>");
        continue;
      }
      if (/^\d+\. /.test(line)) {
        var ordered = [];
        while (i < lines.length && /^\d+\. /.test(lines[i])) {
          ordered.push("<li>" + inline(lines[i].replace(/^\d+\. /, "")) + "</li>");
          i += 1;
        }
        out.push("<ol>" + ordered.join("") + "</ol>");
        continue;
      }
      if (line.trim() === "") {
        i += 1;
        continue;
      }
      var para = [line];
      i += 1;
      while (i < lines.length && lines[i].trim() && !/^(#|```|\||[-*] |\d+\. )/.test(lines[i])) {
        para.push(lines[i]);
        i += 1;
      }
      out.push("<p>" + inline(para.join(" ")) + "</p>");
    }
    return out.join("\n");
  }

  global.MARKDOWN_LITE = { render: render, escapeHtml: escapeHtml };
})(window);
