import Vec3 from '/math/Vec3';

const { sqrt, acos, sin, cos } = Math;

const EPS = 1e-5;

function create() {
  return new Float64Array(4);
}

function array(n) {
  const r = new Array(n);
  for (var i = 0; i < n; i++) r[i] = create();
  return r;
}

function setWXYZ(to, w, x, y, z) {
  to[0] = w;
  to[1] = x;
  to[2] = y;
  to[3] = z;
  return to;
}

function slerpTo(to, a, b, t) {
  var it = 1 - t;
  var omega = acos(dot(a, b));
  var sino = sin(omega);
  var x1 = sin(it * omega) / sino;
  var x2 = sin(t * omega) / sino;

  to[0] = x1 * a[0] + x2 * b[0];
  to[1] = x1 * a[1] + x2 * b[1];
  to[2] = x1 * a[2] + x2 * b[2];
  to[3] = x1 * a[3] + x2 * b[3];
  return to;
}

function slerpIP(a, b, t) {
  return slerpTo(a, a, b, t);
}
function slerp(a, b, t) {
  return slerpTo(create(), a, b, t);
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
function dotXYZW(a, w, x, y, z) {
  return a[0] * w + a[1] * x + a[2] * y + a[3] * z;
}

function len2(a) {
  return dot(a, a);
}

function len(a) {
  return sqrt(len2(a));
}

function dist2(a, b) {
  const d0 = a[0] - b[0];
  const d1 = a[1] - b[1];
  const d2 = a[2] - b[2];
  const d3 = a[3] - b[3];
  return d0 * d0 + d1 * d1 + d2 * d2 + d3 * d3;
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
  r[3] = a[3];
  return r;
}

function scaleTo(to, q, s) {
  to[0] = q[0] * s;
  to[1] = q[1] * s;
  to[2] = q[2] * s;
  to[3] = q[3] * s;
  return to;
}

function negTo(to, a) {
  to[0] = -a[0];
  to[1] = -a[1];
  to[2] = -a[2];
  to[3] = -a[3];
  return to;
}
function directTo(to, a, b) {
  if (dot(a, b) < 0) {
    return negTo(to, a);
  } else {
    return copyTo(to, a);
  }
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


function setIdentity(q) {
  q[0] = 1;
  q[1] = q[2] = q[3] = 0;
  return q;
}

function identity() {
  return setIdentity(create());
}

function mulTo(to, a, b) {
  var
    a1 = a[0], b1 = a[1], c1 = a[2], d1 = a[3],
    a2 = b[0], b2 = b[1], c2 = b[2], d2 = b[3];

  to[0] = a1*a2 - b1*b2 - c1*c2 - d1*d2;
  to[1] = a1*b2 + b1*a2 + c1*d2 - d1*c2;
  to[2] = a1*c2 - b1*d2 + c1*a2 + d1*b2;
  to[3] = a1*d2 + b1*c2 - c1*b2 + d1*a2;
  return to;
}
function mulIP(a, b) {
  return mulTo(a, a, b);
}
function mul(a, b) {
  return mulTo(create(), a, b);
}

function setAxisAngleXYZA(to, ax, ay, az, ang) {
  const sina = sin(ang / 2);
  to[0] = cos(ang / 2);
  to[1] = sina * ax;
  to[2] = sina * ay;
  to[3] = sina * az;
  return to;
}

function setAxisAngleVA(to, v, ang) {
  return setAxisAngleXYZA(to, v[0], v[1], v[2], ang);
}

function setEulerScaleXYZS(to, x, y, z, s) {
  const l = Vec3.lenXYZ(x, y, z);
  if (l < EPS) {
    return setIdentity(to);
  } else {
    return setAxisAngleXYZA(to, x / l, y / l, z / l, s * l);
  }
}
function setEulerXYZ(to, x, y, z) {
  return setEulerScaleXYZS(to, x, y, z, 1);
}
function setEulerV(to, v) {
  return setEulerXYZ(to, v[0], v[1], v[2]);
}
function setEulerScaleVS(to, v, s) {
  return setEulerXYZ(to, v[0], v[1], v[2], s);
}

export default {
  DIMS: 4,
  create,
  array,
  setWXYZ,

  identity, setIdentity,

  copy, copyTo,

  mul, mulTo, mulIP,

  slerp, slerpTo, slerpIP,

  dot, dotXYZW,

  len, len2,
  dist, dist2,

  normalize,
  normalizeTo,
  normalizeIP,

  directTo,

  setAxisAngleXYZA,
  setAxisAngleVA,
  setEulerScaleXYZS,
  setEulerXYZ,
  setEulerV,
  setEulerScaleVS
};

