/**
 * Tiny helper for the docs / example pages.
 * Loads a JSON dataset from /data and caches it for the session.
 */
(function (global) {
  var cache = {};

  function datasetUrl(name) {
    var file = name.indexOf(".json") === -1 ? name + ".json" : name;
    return new URL("../data/" + file, document.baseURI).href;
  }

  function loadDataset(name) {
    if (cache[name]) {
      return Promise.resolve(cache[name]);
    }
    return fetch(datasetUrl(name), { cache: "no-cache" }).then(function (res) {
      if (!res.ok) {
        throw new Error("Could not load " + name + " (" + res.status + ")");
      }
      return res.json();
    }).then(function (data) {
      cache[name] = data;
      return data;
    });
  }

  function loadCatalog() {
    return loadDataset("catalog");
  }

  global.FootData = {
    load: loadDataset,
    catalog: loadCatalog,
    url: datasetUrl
  };
})(window);
