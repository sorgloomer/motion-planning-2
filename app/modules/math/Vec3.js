
const { sqrt } = Math;

function create() {
  return new Float64Array(3);
}

function array(n) {
  const r = new Array(n);
  for (var i = 0; i < n; i++) r[i] = create();
  return r;
}

function setXYZ(to, x, y, z) {
  to[0] = x;
  to[1] = y;
  to[2] = z;
  return to;
}

function set(to, a) {
  return setXYZ(to, a[0], a[1], a[2]);
}

function addTo(to, a, b) {
  to[0] = a[0] + b[0];
  to[1] = a[1] + b[1];
  to[2] = a[2] + b[2];
  return to;
}

function add(a, b) {
  return addTo(create(), a, b);
}

function addIP(a, b) {
  return addTo(a, a, b);
}

function subTo(to, a, b) {
  to[0] = a[0] - b[0];
  to[1] = a[1] - b[1];
  to[2] = a[2] - b[2];
  return to;
}

function sub(a, b) {
  return subTo(create(), a, b);
}

function subIP(a, b) {
  return subTo(a, a, b);
}

function lerpTo(to, a, b, t) {
  var it = 1 - t;
  to[0] = a[0] * it + b[0] * t;
  to[1] = a[1] * it + b[1] * t;
  to[2] = a[2] * it + b[2] * t;
  return to;
}
function lerpIP(a, b, t) {
  return lerpTo(a, a, b, t);
}
function lerp(a, b, t) {
  return lerpTo(create(), a, b, t);
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function dotXYZ(a, x, y, z) {
  return a[0] * x + a[1] * y + a[2] * z;
}

function scaleTo(to, a, s) {
  to[0] = a[0] * s;
  to[1] = a[1] * s;
  to[2] = a[2] * s;
  return to;
}

function scaleIP(a, s) {
  return scaleTo(a, a, s);
}

function scale(a, s) {
  return scaleTo(create(), a, s);
}

function len2(a) {
  return dot(a, a);
}

function len(a) {
  return sqrt(len2(a));
}

function len2XYZ(x, y, z) {
  return x*x + y * y + z*z;
}
function lenXYZ(x, y, z) {
  return sqrt(len2XYZ(x, y, z));
}

function dist2(a, b) {
  const d0 = a[0] - b[0];
  const d1 = a[1] - b[1];
  const d2 = a[2] - b[2];
  return d0 * d0 + d1 * d1 + d2 * d2;
}

function dist(a, b) {
  return sqrt(dist2(a, b));
}

function copy(a) {
  return copyTo(create(), a);
}

function copyTo(r, a) {
  r[0] = a[0];
  r[1] = a[1];
  r[2] = a[2];
  return r;
}

function unit(dir) {
  return unitSet(create(), dir);
}

function unitSet(a, dir) {
  a[0] = 0;
  a[1] = 0;
  a[2] = 0;
  a[dir] = 1;
  return a;
}

function crossTo(to, a, b) {
  const
    a0 = a[0], a1 = a[1], a2 = a[2],
    b0 = b[0], b1 = b[1], b2 = b[2]
  ;
  to[0] = a1 * b2 - a2 * b1;
  to[1] = a2 * b0 - a0 * b2;
  to[2] = a0 * b1 - a1 * b0;
  return to;
}

function crossIP(a, b) {
  return crossTo(a, a, b);
}
function cross(a, b) {
  return crossTo(create(), a, b);
}

function normalizeTo(to, a) {
  return scaleTo(to, a, 1 / len(a));
}

function normalize(a) {
  return normalizeTo(create(), a);
}
function normalizeIP(a) {
  return normalizeTo(a, a);
}

export default {
  DIMS: 3,
  create,
  array,
  set,
  setXYZ,
  unit,
  unitSet,

  copy,
  copyTo,

  scale,
  scaleTo,
  scaleIP,

  lerp,
  lerpTo,
  lerpIP,

  dot,
  dotXYZ,

  cross,
  crossTo,
  crossIP,

  add,
  addTo,
  addIP,

  sub,
  subTo,
  subIP,

  len,
  len2,
  dist,
  dist2,
  lenXYZ,
  len2XYZ,

  normalize,
  normalizeTo,
  normalizeIP
};

