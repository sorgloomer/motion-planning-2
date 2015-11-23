const {sqrt} = Math;

function dims(a) {
  return a.length;
}

function copyTo(to, a) {
  for (var i = 0; i < to.length; i++) {
    to[i] = a[i];
  }
  return to;
}
function addTo(to, a, b) {
  for (var i = 0, mi = a.length; i < mi; i++) {
    to[i] = a[i] + b[i];
  }
  return to;
}

function add(a, b) {
  return addTo(_alloc(a), a, b);
}

function subTo(to, a, b) {
  for (var i = 0, mi = a.length; i < mi; i++) {
    to[i] = a[i] - b[i];
  }
  return to;
}

function sub(a, b) {
  return subTo(_alloc(a), a, b);
}

function lerpTo(to, a, b, t) {
  var it = 1 - t;
  for (var i = 0, mi = a.length; i < mi; i++) {
    to[i] = a[i] * it + b[i] * t;
  }
  return to;
}

function dot(a, b) {
  var res = 0;
  for (var i = 0, mi = a.length; i < mi; i++) {
    res += a[i] * b[i];
  }
  return res;
}

function scaleTo(to, v, s) {
  for (var i = 0; i < v.length; i++) {
    to[i] = v[i] * s;
  }
  return to;
}
function scale(v, s) {
  return scaleTo(_alloc(v), v, s);
}

function len2(a) {
  var res = 0, ai;
  for (var i = 0, mi = a.length; i < mi; i++) {
    res += (ai = a[i]) * ai;
  }
  return res;
}

function len(a) {
  return sqrt(len2(a));
}

function dist2(a, b) {
  var res = 0;
  for (var i = 0, mi = a.length; i < mi; i++) {
    var ai = a[i] - b[i];
    res += ai * ai;
  }
  return res;
}

function dist(a, b) {
  return sqrt(dist2(a, b));
}

function copy(a) {
  return new Float64Array(a);
}

function zero(dims) {
  return alloc(dims);
}

function unit(dims, dir) {
  var res = zero(dims);
  res[dir] = 1;
  return res;
}

function alloc(dims) {
  return new Float64Array(dims);
}
function _alloc(other) {
  return new Float64Array(other.length);
}

function V(...args) {
  return new Float64Array(args);
}
function make(args) {
  return new Float64Array(args);
}

export default {
  V,
  make,
  alloc,
  zero,
  unit,
  dims,

  copy,
  copyTo,

  scaleTo,
  scale,
  lerpTo,

  dot,
  add,
  addTo,
  sub,
  subTo,
  len,
  len2,
  dist,
  dist2
};
