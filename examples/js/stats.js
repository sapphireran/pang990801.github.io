/**
 * Small stats helpers for the personal example pages.
 * No dependencies. Safe to load before or after echarts.
 */
(function (root) {
  function mean(values) {
    if (!values.length) return NaN;
    var sum = 0;
    for (var i = 0; i < values.length; i++) sum += values[i];
    return sum / values.length;
  }

  function min(values) {
    return Math.min.apply(null, values);
  }

  function max(values) {
    return Math.max.apply(null, values);
  }

  function unzip(points) {
    var xs = [];
    var ys = [];
    for (var i = 0; i < points.length; i++) {
      xs.push(points[i][0]);
      ys.push(points[i][1]);
    }
    return { xs: xs, ys: ys };
  }

  /**
   * Ordinary least squares: y = intercept + slope * x.
   * Also returns Pearson r and the two endpoint pairs for a trend line.
   */
  function linearRegression(points) {
    var parts = unzip(points);
    var xs = parts.xs;
    var ys = parts.ys;
    var n = points.length;
    var meanX = mean(xs);
    var meanY = mean(ys);
    var ssxx = 0;
    var ssyy = 0;
    var ssxy = 0;
    for (var i = 0; i < n; i++) {
      var dx = xs[i] - meanX;
      var dy = ys[i] - meanY;
      ssxx += dx * dx;
      ssyy += dy * dy;
      ssxy += dx * dy;
    }
    var slope = ssxy / ssxx;
    var intercept = meanY - slope * meanX;
    var r = ssxy / Math.sqrt(ssxx * ssyy);
    var x0 = min(xs);
    var x1 = max(xs);
    return {
      n: n,
      slope: slope,
      intercept: intercept,
      r: r,
      r2: r * r,
      meanX: meanX,
      meanY: meanY,
      minX: x0,
      maxX: x1,
      minY: min(ys),
      maxY: max(ys),
      line: [
        [x0, intercept + slope * x0],
        [x1, intercept + slope * x1],
      ],
    };
  }

  function predictY(fit, x) {
    return fit.intercept + fit.slope * x;
  }

  function zipMeans(labels, a, b) {
    var rows = [];
    for (var i = 0; i < labels.length; i++) {
      rows.push({
        label: labels[i],
        a: a[i],
        b: b[i],
        diff: a[i] - b[i],
      });
    }
    return rows;
  }

  function ringPercent(value, placeholder) {
    return (100 * value) / (value + placeholder);
  }

  function format(n, digits) {
    if (typeof digits !== "number") digits = 2;
    return Number(n).toFixed(digits);
  }

  root.FootStats = {
    mean: mean,
    min: min,
    max: max,
    unzip: unzip,
    linearRegression: linearRegression,
    predictY: predictY,
    zipMeans: zipMeans,
    ringPercent: ringPercent,
    format: format,
  };
})(window);
