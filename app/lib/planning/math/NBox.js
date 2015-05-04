/**
 * Created by Hege on 2014.09.28..
 */

define('math.NBox', ['math.vec'], function(vec) {
  function NBox(min, max) {
    this.min = min;
    this.max = max;
  }

  var Proto = NBox.prototype;
  Proto.contains = function (dot) {
    var min = this.min, max = this.max;
    for (var i = 0; i < min.length; i++) {
      var x = dot[i];
      if (x < min[i] || x > max[i]) return false;
    }
    return true;
  };
  Proto.width = function (dim) {
    return this.max[dim] - this.min[dim];
  };
  Proto.split = function (dim) {
    var min = this.min, max = this.max;
    var minmid = vec.copy(min);
    var maxmid = vec.copy(max);
    var mid = (min[dim] + max[dim]) * 0.5;
    minmid[dim] = maxmid[dim] = mid;
    return [
      new NBox(min, maxmid),
      new NBox(minmid, max)
    ];
  };
  Proto.split2 = function () {
    var bd = 0, bv = this.width(0);
    var dims = this.dims();
    for (var i = 1; i < dims; i++) {
      var cv = this.width(i);
      if (cv > bv) {
        bv = cv;
        bd = i;
      }
    }
    return this.split(bd);
  };
  Proto.size = function () {
    return vec.sub(this.max, this.min);
  };
  Proto.sizeTo = function (to) {
    return vec.subTo(to, this.max, this.min);
  };

  Proto.dist2 = function (p) {
    var min = this.min, max = this.max;
    var coord, delta, result = 0;
    for (var i = 0, mi = p.length; i < mi; i++) {
      coord = p[i];
      delta = clamp(coord, min[i], max[i]) - coord;
      result += delta * delta;
    }
    return result;
  };
  Proto.dist = function (p) {
    return Math.sqrt(this.dist2(p));
  };
  Proto.dims = function () {
    return this.min.length;
  };
  Proto.fatten = function (ratio) {
    if (ratio === undefined) ratio = 0.25;
    var size = this.size();
    var i;
    var nmin = copyarr(this.min);
    var nmax = copyarr(this.max);
    for (i = 0; i < size.length; i++) {
      nmin[i] -= size[i] * ratio;
      nmax[i] += size[i] * ratio;
    }
    return new NBox(nmin, nmax);
  };
  function copyarr(a) {
    return a.slice(0);
  }

  function clamp(x, mi, ma) {
    if (x < mi) return mi;
    if (x > ma) return ma;
    return x;
  }
  return NBox;
});



