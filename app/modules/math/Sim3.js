import Vec3 from '/math/Vec3';

const {sin, cos, abs} = Math;

function create() {
  return new Float64Array(12);
}

function set(to, a) {
  for (var i = 0; i < 12; i++) to[i] = a[i];
  return to;
}

function copy(a) {
  return set(create(), a);
}

function setIdentity(a) {
  a[0] = 1; a[1] = 0; a[2] = 0;
  a[3] = 0; a[4] = 1; a[5] = 0;
  a[6] = 0; a[7] = 0; a[8] = 1;
  a[9] = 0; a[10] = 0; a[11] = 0;
  return a;
}
function identity() {
  return setIdentity(create());
}

function setTranslationXYZ(a, x, y, z) {
  a[0] = 1; a[1] = 0; a[2] = 0;
  a[3] = 0; a[4] = 1; a[5] = 0;
  a[6] = 0; a[7] = 0; a[8] = 1;
  a[9] = x; a[10] = y; a[11] = z;
  return a;
}

function translationXYZ(x, y, z) {
  return setTranslationXYZ(create(), x, y, z);
}

function setTranslationV(a, v) {
  return setTranslationXYZ(a, v[0], v[1], v[2]);
}

function translationV(v) {
  return setTranslationV(create(), v);
}

function translateXYZ(a, x, y, z) {
  a[9] += x; a[10] += y; a[11] += z;
  return a;
}

function translateV(a, v) {
  return translateXYZ(a, v[0], v[1], v[2]);
}

function setRotationX(m, a) {
  const c = cos(a), s = sin(a);
  m[0] =  1; m[ 1] =  0; m[ 2] =  0;
  m[3] =  0; m[ 4] =  c; m[ 5] =  s;
  m[6] =  0; m[ 7] = -s; m[ 8] =  c;
  m[9] =  0; m[10] =  0; m[11] =  0;
  return m;
}

function setRotationY(m, a) {
  const c = cos(a), s = sin(a);
  m[ 0] =  c; m[ 1] =  0; m[ 2] = -s;
  m[ 3] =  0; m[ 4] =  1; m[ 5] =  0;
  m[ 6] =  s; m[ 7] =  0; m[ 8] =  c;
  m[ 9] =  0; m[10] =  0; m[11] =  0;
  return m;
}
function setRotationZ(m, a) {
  const c = cos(a), s = sin(a);
  m[ 0] =  c; m[ 1] =  s; m[ 2] =  0;
  m[ 3] = -s; m[ 4] =  c; m[ 5] =  0;
  m[ 6] =  0; m[ 7] =  0; m[ 8] =  1;
  m[ 9] =  0; m[10] =  0; m[11] =  0;
  return m;
}

function setRotationAxisAngle(m, v) {
  return setRotationAxisAngleXYZ(m, v[0], v[1], v[2]);
}

function setRotationAxisAngleScale(m, v, s) {
  return setRotationAxisAngleXYZ(m, v[0] * s, v[1] * s, v[2] * s);
}

function setRotationAxisAngleXYZ(m, vx, vy, vz) {
  const a = Vec3.lenXYZ(vx, vy, vz);
  if (-1e-4 < a && a < 1e-4) {
    return setIdentity(m);
  } else {
    // TODO: maybe rewrite to multiply by `il = 1/l` ?
    const ux = vx / a;
    const uy = vy / a;
    const uz = vz / a;

    const psin = sin(a);
    const pcos = cos(a);
    const ncos = 1 - pcos;

    m[0] = pcos + ux * ux * ncos;
    m[1] = ux * uy * ncos - uz * psin;
    m[2] = ux * uz * ncos + uy * psin;

    m[3] = uy * ux * ncos + uz * psin;
    m[4] = pcos + uy * uy * ncos;
    m[5] = uy * uz * ncos - ux * psin;

    m[6] = uz * ux * ncos - uy * psin;
    m[7] = uz * uy * ncos + ux * psin;
    m[8] = pcos + uz * uz * ncos;

    m[9] = 0;
    m[10] = 0;
    m[11] = 0;
    return m;
  }
}


function rotationX(a) {
  return setRotationX(create(), a);
}

function rotationY(a) {
  return setRotationY(create(), a);
}

function rotationZ(a) {
  return setRotationZ(create(), a);
}

function rotationAxisAngle(v) {
  return setRotationAxisAngle(create(), v);
}
function rotationAxisAngleScale(v) {
  return setRotationAxisAngleScale(create(), v);
}
function rotationAxisAngleXYZ(x, y, z) {
  return setRotationAxisAngleXYZ(create(), x, y, z);
}

function rotVecTo(to, v, s) {
  const vx = v[0], vy = v[1], vz = v[2];
  to[0] = vx * s[0] + vy * s[3] + vz * s[6];
  to[1] = vx * s[1] + vy * s[4] + vz * s[7];
  to[2] = vx * s[2] + vy * s[5] + vz * s[8];
  return to;
}

function rotVecIP(v, s) {
  return rotVecTo(v, v, s);
}

function mulVecTo(to, v, s) {
  const vx = v[0], vy = v[1], vz = v[2];
  to[0] = vx * s[0] + vy * s[3] + vz * s[6] + s[ 9];
  to[1] = vx * s[1] + vy * s[4] + vz * s[7] + s[10];
  to[2] = vx * s[2] + vy * s[5] + vz * s[8] + s[11];
  return to;
}

function mulVecIP(v, s) {
  return mulVecTo(v, v, s);

}

function mulTo(to, a, b) {
  const
    a00 = a[ 0],  a01 = a[ 1], a02 = a[ 2],
    a10 = a[ 3],  a11 = a[ 4], a12 = a[ 5],
    a20 = a[ 6],  a21 = a[ 7], a22 = a[ 8],
    a30 = a[ 9],  a31 = a[10], a32 = a[11],

    b00 = b[ 0],  b01 = b[ 1], b02 = b[ 2],
    b10 = b[ 3],  b11 = b[ 4], b12 = b[ 5],
    b20 = b[ 6],  b21 = b[ 7], b22 = b[ 8],
    b30 = b[ 9],  b31 = b[10], b32 = b[11]
  ;

  to[ 0] = a00 * b00 + a01 * b10 + a02 * b20;
  to[ 1] = a00 * b01 + a01 * b11 + a02 * b21;
  to[ 2] = a00 * b02 + a01 * b12 + a02 * b22;

  to[ 3] = a10 * b00 + a11 * b10 + a12 * b20;
  to[ 4] = a10 * b01 + a11 * b11 + a12 * b21;
  to[ 5] = a10 * b02 + a11 * b12 + a12 * b22;

  to[ 6] = a20 * b00 + a21 * b10 + a22 * b20;
  to[ 7] = a20 * b01 + a21 * b11 + a22 * b21;
  to[ 8] = a20 * b02 + a21 * b12 + a22 * b22;

  to[ 9] = a30 * b00 + a31 * b10 + a32 * b20 + b30;
  to[10] = a30 * b01 + a31 * b11 + a32 * b21 + b31;
  to[11] = a30 * b02 + a31 * b12 + a32 * b22 + b32;
  return to;
}

function mulIP(a, b) {
  return mulTo(a, a, b);
}

/*
|R  0|     |S  0|     | R*S    0|
|    |  *  |    |  =  |         |
|t  1|     |v  1|     |t*S+v   1|
*/

function transposeTo(to, a) {
  to[0] = a[0];
  to[1] = a[3];
  to[2] = a[6];

  to[3] = a[1];
  to[4] = a[4];
  to[5] = a[7];

  to[6] = a[2];
  to[7] = a[5];
  to[8] = a[8];
  return to;
}
function invertTo(to, a) {
  // Transpose rotation
  to[0] = a[0];
  to[1] = a[3];
  to[2] = a[6];

  to[3] = a[1];
  to[4] = a[4];
  to[5] = a[7];

  to[6] = a[2];
  to[7] = a[5];
  to[8] = a[8];

  // Multiply translation by inverted rotation and negate
  to[ 9] = - a[ 9] * a[0] - a[10] * a[1] - a[11] * a[2];
  to[10] = - a[ 9] * a[3] - a[10] * a[4] - a[11] * a[5];
  to[11] = - a[ 9] * a[6] - a[10] * a[7] - a[11] * a[8];

  return to;
}


function getX(to, s) {
  to[0] = s[0];
  to[1] = s[1];
  to[2] = s[2];
  return to;
}

function getY(to, s) {
  to[0] = s[3];
  to[1] = s[4];
  to[2] = s[5];
  return to;
}
function getZ(to, s) {
  to[0] = s[6];
  to[1] = s[7];
  to[2] = s[8];
  return to;
}
function getT(to, s) {
  to[0] = s[9];
  to[1] = s[10];
  to[2] = s[11];
  return to;
}

function setRotationVecs(to, r0, r1, r2) {
  to[0] = r0[0]; to[1] = r0[1]; to[2] = r0[2];
  to[3] = r1[0]; to[4] = r1[1]; to[5] = r1[2];
  to[6] = r2[0]; to[7] = r2[1]; to[8] = r2[2];
  to[9] = 0; to[10] = 0; to[11] = 0;
  return to;
}

export default {
  DIMS: 3,
  create,
  set,
  copy,

  rotVecTo,
  rotVecIP,
  mulVecTo,
  mulVecIP,
  mulTo,
  mulIP,

  getX,
  getY,
  getZ,
  getT,

  identity,
  setIdentity,

  setTranslationXYZ,
  setTranslationV,
  translationXYZ,
  translationV,
  translateXYZ,
  translateV,

  setRotationX,
  setRotationY,
  setRotationZ,
  setRotationAxisAngle,
  setRotationAxisAngleScale,
  setRotationAxisAngleXYZ,

  rotationX,
  rotationY,
  rotationZ,

  rotationAxisAngle,
  rotationAxisAngleScale,
  rotationAxisAngleXYZ,

  transposeTo,
  invertTo,

  setRotationVecs
};

