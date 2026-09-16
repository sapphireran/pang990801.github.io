/* Shared helpers for the personal lab pages. No network except same-origin /data. */
(function (root) {
  const Lab = {};

  Lab.loadData = async function loadData(name) {
    const paths = [
      "../../data/" + name,
      "/data/" + name,
      "../data/" + name,
    ];
    let last;
    for (const path of paths) {
      try {
        const response = await fetch(path);
        if (response.ok) return response.json();
        last = new Error(path + " → " + response.status);
      } catch (err) {
        last = err;
      }
    }
    throw last;
  };

  Lab.mean = function mean(xs) {
    return xs.reduce((a, b) => a + b, 0) / xs.length;
  };

  Lab.pearson = function pearson(xs, ys) {
    const n = xs.length;
    const mx = Lab.mean(xs);
    const my = Lab.mean(ys);
    let num = 0;
    let dx = 0;
    let dy = 0;
    for (let i = 0; i < n; i += 1) {
      const a = xs[i] - mx;
      const b = ys[i] - my;
      num += a * b;
      dx += a * a;
      dy += b * b;
    }
    return num / Math.sqrt(dx * dy);
  };

  Lab.ols = function ols(xs, ys) {
    const mx = Lab.mean(xs);
    const my = Lab.mean(ys);
    let num = 0;
    let den = 0;
    for (let i = 0; i < xs.length; i += 1) {
      num += (xs[i] - mx) * (ys[i] - my);
      den += (xs[i] - mx) ** 2;
    }
    const slope = num / den;
    const intercept = my - slope * mx;
    return { slope, intercept };
  };

  Lab.mondopoint = function mondopoint(cm) {
    return Math.round(cm * 10);
  };

  Lab.euRough = function euRough(cm) {
    return Math.round((cm * 10) / 6.67 + 2);
  };

  Lab.symmetry = function symmetry(i, coeff) {
    const c = Object.assign({ a: 36, da: 13, b: 17, db: 6, cc: 11, dc: 4, d: 27, dd: 10, base: 63 }, coeff);
    const ln = Math.log(i + 1);
    const a = Math.round(c.a - c.da * ln);
    const b = Math.round(c.b - c.db * ln);
    const cc = Math.round(c.cc - c.dc * ln);
    const d = Math.round(c.d - c.dd * ln);
    const same = c.base + a + b + cc + d;
    const total = same + a + b + cc + d;
    return { a, b, c: cc, d, same, total, samePct: (100 * same) / total };
  };

  Lab.download = function download(filename, text, type) {
    const blob = new Blob([text], { type: type || "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  Lab.rowsToCsv = function rowsToCsv(rows) {
    if (!rows.length) return "";
    const keys = Object.keys(rows[0]);
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
    return [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
  };

  root.Lab = Lab;
})(window);
