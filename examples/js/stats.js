(function (global) {
  function mean(values) {
    return values.reduce(function (sum, value) { return sum + value; }, 0) / values.length;
  }

  function ols(xs, ys) {
    var mx = mean(xs);
    var my = mean(ys);
    var varX = 0;
    var cov = 0;
    for (var i = 0; i < xs.length; i += 1) {
      var dx = xs[i] - mx;
      varX += dx * dx;
      cov += dx * (ys[i] - my);
    }
    var slope = varX ? cov / varX : 0;
    var intercept = my - slope * mx;
    var sse = 0;
    var sst = 0;
    for (var j = 0; j < xs.length; j += 1) {
      var residual = ys[j] - (slope * xs[j] + intercept);
      sse += residual * residual;
      sst += (ys[j] - my) * (ys[j] - my);
    }
    return {
      slope: slope,
      intercept: intercept,
      rmse: Math.sqrt(sse / xs.length),
      rSquared: sst ? 1 - sse / sst : 1,
    };
  }

  function predictLastCm(heightCm, fit) {
    return fit.slope * heightCm + fit.intercept;
  }

  function mondopoint(lastCm) {
    return Math.round(lastCm * 10);
  }

  global.FOOT_STATS = {
    mean: mean,
    ols: ols,
    predictLastCm: predictLastCm,
    mondopoint: mondopoint,
  };
})(window);
