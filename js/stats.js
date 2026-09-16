/**
 * Summary helpers for the personal foot-shape datasets.
 * Works in the browser (global FootStats) and in Node (module.exports).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.FootStats = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function mean(values) {
    if (!values.length) {
      return NaN;
    }
    var sum = 0;
    for (var i = 0; i < values.length; i += 1) {
      sum += values[i];
    }
    return sum / values.length;
  }

  function min(values) {
    return Math.min.apply(null, values);
  }

  function max(values) {
    return Math.max.apply(null, values);
  }

  function stdev(values) {
    if (values.length < 2) {
      return 0;
    }
    var m = mean(values);
    var acc = 0;
    for (var i = 0; i < values.length; i += 1) {
      var d = values[i] - m;
      acc += d * d;
    }
    return Math.sqrt(acc / (values.length - 1));
  }

  function pearson(pairs) {
    var n = pairs.length;
    if (n < 2) {
      return NaN;
    }
    var xs = [];
    var ys = [];
    for (var i = 0; i < n; i += 1) {
      xs.push(pairs[i][0]);
      ys.push(pairs[i][1]);
    }
    var mx = mean(xs);
    var my = mean(ys);
    var num = 0;
    var dx = 0;
    var dy = 0;
    for (var j = 0; j < n; j += 1) {
      var a = xs[j] - mx;
      var b = ys[j] - my;
      num += a * b;
      dx += a * a;
      dy += b * b;
    }
    return num / Math.sqrt(dx * dy);
  }

  function linearFit(pairs) {
    var n = pairs.length;
    var xs = pairs.map(function (p) {
      return p[0];
    });
    var ys = pairs.map(function (p) {
      return p[1];
    });
    var mx = mean(xs);
    var my = mean(ys);
    var num = 0;
    var den = 0;
    for (var i = 0; i < n; i += 1) {
      num += (xs[i] - mx) * (ys[i] - my);
      den += (xs[i] - mx) * (xs[i] - mx);
    }
    var slope = num / den;
    var intercept = my - slope * mx;
    return { slope: slope, intercept: intercept, r: pearson(pairs) };
  }

  function column(pairs, index) {
    return pairs.map(function (p) {
      return p[index];
    });
  }

  function describePairs(pairs, sex) {
    var heights = column(pairs, 0);
    var shoes = column(pairs, 1);
    var fit = linearFit(pairs);
    return {
      sex: sex,
      n: pairs.length,
      height_cm: {
        min: min(heights),
        max: max(heights),
        mean: mean(heights),
        stdev: stdev(heights),
      },
      shoe_length_cm: {
        min: min(shoes),
        max: max(shoes),
        mean: mean(shoes),
        stdev: stdev(shoes),
      },
      fit: fit,
    };
  }

  function crossingAge(ages, diffs) {
    for (var i = 1; i < diffs.length; i += 1) {
      if (diffs[i - 1] >= 0 && diffs[i] < 0) {
        return {
          after_age: ages[i - 1],
          at_age: ages[i],
          previous_diff_cm: diffs[i - 1],
          next_diff_cm: diffs[i],
        };
      }
    }
    return null;
  }

  function plumpnessTrend(bmiBins, values) {
    var pairs = [];
    for (var i = 0; i < bmiBins.length; i += 1) {
      pairs.push([bmiBins[i], values[i]]);
    }
    return linearFit(pairs);
  }

  function radarGrowth(series) {
    if (series.length < 2) {
      return [];
    }
    var first = series[0].values;
    var last = series[series.length - 1].values;
    var out = [];
    for (var i = 0; i < first.length; i += 1) {
      out.push({
        index: i,
        from: first[i],
        to: last[i],
        delta: last[i] - first[i],
      });
    }
    return out;
  }

  function siteDelta(a, b) {
    var out = [];
    for (var i = 0; i < a.length; i += 1) {
      out.push({
        index: i,
        a: a[i],
        b: b[i],
        delta: b[i] - a[i],
      });
    }
    return out;
  }

  function round(value, digits) {
    var p = Math.pow(10, digits);
    return Math.round(value * p) / p;
  }

  return {
    mean: mean,
    min: min,
    max: max,
    stdev: stdev,
    pearson: pearson,
    linearFit: linearFit,
    describePairs: describePairs,
    crossingAge: crossingAge,
    plumpnessTrend: plumpnessTrend,
    radarGrowth: radarGrowth,
    siteDelta: siteDelta,
    round: round,
  };
});
