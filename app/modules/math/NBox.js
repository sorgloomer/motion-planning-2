import VecN from '/math/VecN';

const {sqrt} = Math;

function copyarr(a) {
  return a.slice(0);
}

function clamp(x, mi, ma) {
  if (x < mi) return mi;
  if (x > ma) return ma;
  return x;
}

export default class NBox {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }

  contains(dot) {
    var min = this.min, max = this.max;
    for (var i = 0; i < min.length; i++) {
      var x = dot[i];
      if (x < min[i] || x > max[i]) return false;
    }
    return true;
  }

  width(dim) {
    return this.max[dim] - this.min[dim];
  }


  split(dim) {
    var min = this.min, max = this.max;
    var minmid = VecN.copy(min);
    var maxmid = VecN.copy(max);
    var mid = (min[dim] + max[dim]) * 0.5;
    minmid[dim] = maxmid[dim] = mid;
    return [
      new NBox(min, maxmid),
      new NBox(minmid, max)
    ];
  }

  split2() {
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
  }

  size() {
    return VecN.sub(this.max, this.min);
  }

  sizeTo(to) {
    return VecN.subTo(to, this.max, this.min);
  }

  dist2(p) {
    var min = this.min, max = this.max;
    var coord, delta, result = 0;
    for (var i = 0, mi = p.length; i < mi; i++) {
      coord = p[i];
      delta = clamp(coord, min[i], max[i]) - coord;
      result += delta * delta;
    }
    return result;
  }
  dist(p) {
    return sqrt(this.dist2(p));
  }
  dims() {
    return this.min.length;
  }

  fatten(ratio) {
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
  }
  static make(min, max) {
    return new NBox(VecN.make(min), VecN.make(max));
  }
};


