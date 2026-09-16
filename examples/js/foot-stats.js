/**
 * Small personal helpers for the extracted foot-shape series.
 * Works in the browser (window.FootStats) and in Node (module.exports).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.FootStats = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function asNumbers(values) {
    if (!values || !values.length) {
      throw new Error("asNumbers: empty series");
    }
    return values.map(function (value) {
      var n = Number(value);
      if (!isFinite(n)) {
        throw new Error("asNumbers: not finite: " + value);
      }
      return n;
    });
  }

  function sortedCopy(values) {
    return asNumbers(values).slice().sort(function (a, b) {
      return a - b;
    });
  }

  function sum(values) {
    return asNumbers(values).reduce(function (acc, n) {
      return acc + n;
    }, 0);
  }

  function mean(values) {
    var nums = asNumbers(values);
    return sum(nums) / nums.length;
  }

  function min(values) {
    return Math.min.apply(null, asNumbers(values));
  }

  function max(values) {
    return Math.max.apply(null, asNumbers(values));
  }

  function quantile(values, q) {
    if (q < 0 || q > 1) {
      throw new Error("quantile: q must be in [0, 1]");
    }
    var nums = sortedCopy(values);
    if (nums.length === 1) {
      return nums[0];
    }
    var pos = (nums.length - 1) * q;
    var lo = Math.floor(pos);
    var hi = Math.ceil(pos);
    if (lo === hi) {
      return nums[lo];
    }
    var t = pos - lo;
    return nums[lo] * (1 - t) + nums[hi] * t;
  }

  function median(values) {
    return quantile(values, 0.5);
  }

  function variance(values, sample) {
    var nums = asNumbers(values);
    if (nums.length < 2) {
      return 0;
    }
    var m = mean(nums);
    var acc = 0;
    for (var i = 0; i < nums.length; i += 1) {
      var d = nums[i] - m;
      acc += d * d;
    }
    return acc / (nums.length - (sample ? 1 : 0));
  }

  function stdev(values, sample) {
    return Math.sqrt(variance(values, sample));
  }

  function pearson(xs, ys) {
    var a = asNumbers(xs);
    var b = asNumbers(ys);
    if (a.length !== b.length) {
      throw new Error("pearson: length mismatch");
    }
    if (a.length < 2) {
      throw new Error("pearson: need at least two pairs");
    }
    var mx = mean(a);
    var my = mean(b);
    var num = 0;
    var dx = 0;
    var dy = 0;
    for (var i = 0; i < a.length; i += 1) {
      var x = a[i] - mx;
      var y = b[i] - my;
      num += x * y;
      dx += x * x;
      dy += y * y;
    }
    if (dx === 0 || dy === 0) {
      return 0;
    }
    return num / Math.sqrt(dx * dy);
  }

  function linearRegression(xs, ys) {
    var a = asNumbers(xs);
    var b = asNumbers(ys);
    if (a.length !== b.length) {
      throw new Error("linearRegression: length mismatch");
    }
    if (a.length < 2) {
      throw new Error("linearRegression: need at least two pairs");
    }
    var mx = mean(a);
    var my = mean(b);
    var num = 0;
    var den = 0;
    for (var i = 0; i < a.length; i += 1) {
      num += (a[i] - mx) * (b[i] - my);
      den += (a[i] - mx) * (a[i] - mx);
    }
    if (den === 0) {
      return { slope: 0, intercept: my, r: 0, r2: 0 };
    }
    var slope = num / den;
    var intercept = my - slope * mx;
    var r = pearson(a, b);
    return {
      slope: slope,
      intercept: intercept,
      r: r,
      r2: r * r
    };
  }

  function predict(model, x) {
    return model.slope * x + model.intercept;
  }

  function summarizeNumeric(values) {
    var nums = asNumbers(values);
    return {
      n: nums.length,
      min: min(nums),
      q1: quantile(nums, 0.25),
      median: median(nums),
      q3: quantile(nums, 0.75),
      max: max(nums),
      mean: mean(nums),
      stdev: stdev(nums, true)
    };
  }

  function unzipRecords(records, xKey, yKey) {
    var xs = [];
    var ys = [];
    for (var i = 0; i < records.length; i += 1) {
      xs.push(records[i][xKey]);
      ys.push(records[i][yKey]);
    }
    return { xs: xs, ys: ys };
  }

  function summarizePairs(records, xKey, yKey) {
    var parts = unzipRecords(records, xKey, yKey);
    var fit = linearRegression(parts.xs, parts.ys);
    return {
      x: summarizeNumeric(parts.xs),
      y: summarizeNumeric(parts.ys),
      fit: fit
    };
  }

  function ringShare(highlighted, placeholder) {
    var total = highlighted + placeholder;
    if (total === 0) {
      return 0;
    }
    return highlighted / total;
  }

  function generateSymmetryByAge() {
    var ages = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    return ages.map(function (age, i) {
      var a = Math.round(36 - 13 * Math.log(i + 1));
      var b = Math.round(17 - 6 * Math.log(i + 1));
      var c = Math.round(11 - 4 * Math.log(i + 1));
      var d = Math.round(27 - 10 * Math.log(i + 1));
      return {
        ageYears: age,
        label: age + "岁",
        leftLarger10to20: a,
        leftLargerOver20: b,
        rightLargerOver20: c,
        rightLarger10to20: d,
        same: 63 + a + b + c + d
      };
    });
  }

  function symmetrySlices(row) {
    return [
      { name: "双脚相同", value: row.same },
      { name: "左脚比右脚大10-20%", value: row.leftLarger10to20 },
      { name: "左脚比右脚大20%以上", value: row.leftLargerOver20 },
      { name: "右脚比左脚大20%以上", value: row.rightLargerOver20 },
      { name: "右脚比左脚大10-20%", value: row.rightLarger10to20 }
    ];
  }

  function zipAgeSeries(payload) {
    return payload.agesYears.map(function (age, i) {
      return {
        ageYears: age,
        girlsFootLengthCm: payload.girlsFootLengthCm[i],
        boysFootLengthCm: payload.boysFootLengthCm[i],
        girlMinusBoyCm: payload.girlMinusBoyCm[i]
      };
    });
  }

  function zipBmiSeries(payload) {
    return payload.bmi.map(function (bmi, i) {
      return {
        bmi: bmi,
        girlsIndex: payload.girlsIndex[i],
        boysIndex: payload.boysIndex[i]
      };
    });
  }

  function formatFixed(value, digits) {
    return Number(value).toFixed(digits == null ? 2 : digits);
  }

  function formatPct(share) {
    return (share * 100).toFixed(1) + "%";
  }

  return {
    asNumbers: asNumbers,
    sum: sum,
    mean: mean,
    min: min,
    max: max,
    quantile: quantile,
    median: median,
    variance: variance,
    stdev: stdev,
    pearson: pearson,
    linearRegression: linearRegression,
    predict: predict,
    summarizeNumeric: summarizeNumeric,
    unzipRecords: unzipRecords,
    summarizePairs: summarizePairs,
    ringShare: ringShare,
    generateSymmetryByAge: generateSymmetryByAge,
    symmetrySlices: symmetrySlices,
    zipAgeSeries: zipAgeSeries,
    zipBmiSeries: zipBmiSeries,
    formatFixed: formatFixed,
    formatPct: formatPct
  };
});
