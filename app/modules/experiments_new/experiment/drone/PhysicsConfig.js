import QuatEtc from '/math/QuatEtc';
import Quat from '/math/Quat';
import VecN from '/math/VecN';
import Sim3 from '/math/Sim3';

const { random, sqrt } = Math;

const temp_quat = Quat.create();
const temp_quat2 = Quat.create();
const temp_sim = Sim3.create();

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

function lerp(a, b, t, to = create()) {
  return lerpTo(to, a, b, t);
}

function lerpTo(to, a, b, t) {
  const it = 1 - t;

  for (let i = 0; i < 6; i++) to[i] = a[i] * it + b[i] * t;

  _load_quat(a, temp_quat);
  _load_quat(b, temp_quat2);
  Quat.slerpIP(temp_quat, temp_quat2, t);
  _store_quat(to, temp_quat);

  for (let i = 10; i < 13; i++) to[i] = a[i] * it + b[i] * t;
  return to;
}


function initial(to = create()) {
  to[0] = 0; // px
  to[1] = 0; // py
  to[2] = 0; // pz
  to[3] = 0; // vx
  to[4] = 0; // vy
  to[5] = 0; // vz
  to[6] = 1; // qw
  to[7] = 0; // qx
  to[8] = 0; // qy
  to[9] = 0; // qz
  to[10] = 0; // ox
  to[11] = 0; // oy
  to[12] = 0; // oz
  return to;
}

function to_sim3(sim, conf) {
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

function randomize(config, nbox) {
  for (let i = 0; i < 6; i++) config[i] = rinterval(nbox.min[i], nbox.max[i]);
  QuatEtc.setRandomUnit(temp_quat);
  _store_quat(config, temp_quat);
  for (let i = 10; i < 13; i++) config[i] = rinterval(nbox.min[i], nbox.max[i]);
  return config;
}


export default {
  initial, create, randomize,
  copy, copyTo,
  lerp, lerpTo,

  dist: VecN.dist, dist2: VecN.dist2,
  to_sim3, make
};