/**
 * Load a dataset JSON file relative to the current page.
 * Docs live in /docs, examples in /examples, so the default root is "..".
 */
(function (root) {
  "use strict";

  function join(base, rel) {
    if (!base) {
      return rel;
    }
    return base.replace(/\/$/, "") + "/" + rel.replace(/^\//, "");
  }

  root.FootData = {
    root: "..",
    url: function (id) {
      return join(this.root, "data/" + id + ".json");
    },
    load: function (id) {
      return fetch(this.url(id)).then(function (res) {
        if (!res.ok) {
          throw new Error("failed to load " + id + " (" + res.status + ")");
        }
        return res.json();
      });
    },
    catalog: function () {
      return fetch(join(this.root, "data/catalog.json")).then(function (res) {
        if (!res.ok) {
          throw new Error("failed to load catalog (" + res.status + ")");
        }
        return res.json();
      });
    },
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
