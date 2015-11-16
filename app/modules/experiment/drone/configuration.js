
import QuatEtc from '/math/QuatEtc';
import Quat from '/math/Quat';
import VecN from '/math/VecN';

const { random, sqrt } = Math;

const temp_quat = Quat.create();
const temp_quat2 = Quat.create();

function rinterval(a, b) {
  return random() * (b - a) + a;
}

function create() {
  return new Float64Array(3 + 3 + 4 + 3);
}

function _store_quat(config, quat) {
  config[6] = quat[0];
  config[7] = quat[1];
  config[8] = quat[2];
  config[9] = quat[3];
}
function _load_quat(config, quat) {
  quat[0] = config[6];
  quat[1] = config[7];
  quat[2] = config[8];
  quat[3] = config[9];
}

function copyTo(to, a) {
  to.set(a, 0);
  return to;
}
function copy(a) {
  return copyTo(create(), a);
}

function dist(a, b) {
  return VecN.dist(a, b);
}


function lerp(a, b, t, to = create()) {
  const it = 1 - t;

  to[0] = a[0] * it + b[0] * t;
  to[1] = a[1] * it + b[1] * t;
  to[2] = a[2] * it + b[2] * t;
  to[3] = a[3];
  to[4] = a[4];
  to[5] = a[5];
  _load_quat(a, temp_quat);
  _load_quat(b, temp_quat2);
  Quat.slerpIP(temp_quat, temp_quat2, t);
  _store_quat(to, temp_quat);
  to[10] = a[10];
  to[11] = a[11];
  to[12] = a[12];
  return to;
}


function initial(to = create()) {
  to[0] = 0;
  to[1] = 0;
  to[2] = 0;
  to[3] = 0;
  to[4] = 0;
  to[5] = 0;
  to[6] = 1;
  to[7] = 0;
  to[8] = 0;
  to[9] = 0;
  to[10] = 0;
  to[11] = 0;
  to[12] = 0;
  return to;
}

function to_sim(sim, conf) {
  _load_quat(conf, temp_quat);
  QuatEtc.transformQXYZ(sim, temp_quat, conf[0], conf[1], conf[2]);
  return sim;
}

function make(tx, ty, tz, qw, qx, qy, qz) {
  var r = create();
  r[0] = tx;
  r[1] = ty;
  r[2] = tz;
  r[3] = 0;
  r[4] = 0;
  r[5] = 0;
  r[6] = qw;
  r[7] = qx;
  r[8] = qy;
  r[9] = qz;
  r[10] = 0;
  r[11] = 0;
  r[12] = 0;
  return r;
}

export default {
  initial, create, randomize,
  copy, copyTo,
  dist, lerp, to_sim, make
};