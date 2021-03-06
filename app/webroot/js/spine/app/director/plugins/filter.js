var Filter;
Filter = function() {
  var extend, include;
  extend = {
    options: {
      func: 'select'
    },
    filter: function(query, options) {
      var opts;
      opts = $.extend({}, this.options, options);
      if (!query) {
        return this.all();
      }
      return this.select(function(item) {
        return item[opts.func](query, opts);
      });
    },
    sortByOrder: function(arr) {
      return arr.sort(function(a, b) {
        var aInt, bInt;
        aInt = parseInt(a.order);
        bInt = parseInt(b.order);
        if (aInt < bInt) {
          return -1;
        } else if (aInt > bInt) {
          return 1;
        } else {
          return 0;
        }
      });
    },
    sortByReverseOrder: function(arr) {
      return arr.sort(function(a, b) {
        var aInt, bInt;
        aInt = parseInt(a.order);
        bInt = parseInt(b.order);
        if (aInt < bInt) {
          return 1;
        } else if (aInt > bInt) {
          return -1;
        } else {
          return 0;
        }
      });
    },
    sortByName: function(arr) {
      return arr.sort(function(a, b) {
        a = a._name;
        b = b._name;
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        } else {
          return 0;
        }
      });
    }
  };
  include = {
    select: function(query) {
      var atts, key, value;
      query = query != null ? query.toLowerCase() : void 0;
      atts = (this.selectAttributes || this.attributes).apply(this);
      for (key in atts) {
        value = atts[key];
        value = value != null ? value.toLowerCase() : void 0;
        if (!((value != null ? value.indexOf(query) : void 0) === -1)) {
          return true;
        }
      }
      return false;
    }
  };
  return {
    extended: function() {
      this.extend(extend);
      return this.include(include);
    }
  };
};
Spine.Model.Filter = Filter();
