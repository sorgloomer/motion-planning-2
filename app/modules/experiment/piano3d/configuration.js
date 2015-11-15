
import QuatEtc from '/math/QuatEtc';
import Quat from '/math/Quat';

const { random, sqrt } = Math;

const temp_quat = Quat.create();
const temp_quat2 = Quat.create();

function rinterval(a, b) {
  return random() * (b - a) + a;
}

function create() {
  return new Float64Array(7);
}

function _store_quat(config, quat) {
  config[3] = quat[0];
  config[4] = quat[1];
  config[5] = quat[2];
  config[6] = quat[3];
}
function _load_quat(config, quat) {
  quat[0] = config[3];
  quat[1] = config[4];
  quat[2] = config[5];
  quat[3] = config[6];
}

function randomize(config, nbox) {
  config[0] = rinterval(nbox.min[0], nbox.max[0]);
  config[1] = rinterval(nbox.min[1], nbox.max[1]);
  config[2] = rinterval(nbox.min[2], nbox.max[2]);

  QuatEtc.setRandomUnit(temp_quat);
  _store_quat(config, temp_quat);
  return config;
}

function copy(a, to = create()) {
  to.set(a, 0);
  return to;
}

function dist(a, b) {
  const x0 = b[0] - a[0];
  const x1 = b[1] - a[1];
  const x2 = b[2] - a[2];
  const x3 = b[3] - a[3];
  const x4 = b[4] - a[4];
  const x5 = b[5] - a[5];
  const x6 = b[6] - a[6];
  return sqrt(
    x0*x0 + x1*x1 + x2*x2 + x3*x3
    + x4*x4 + x5*x5 + x6*x6);
}

function lerp(a, b, t, to = create()) {
  const it = 1 - t;

  to[0] = a[0] * it + b[0] * t;
  to[1] = a[1] * it + b[1] * t;
  to[2] = a[2] * it + b[2] * t;
  _load_quat(a, temp_quat);
  _load_quat(b, temp_quat2);
  Quat.slerpIP(temp_quat, t);
  _store_quat(to, temp_quat);
  return to;
}

function initial(to = create()) {
  to[0] = 0;
  to[1] = 0;
  to[2] = 0;
  to[3] = 1;
  to[4] = 0;
  to[5] = 0;
  to[6] = 0;
  return to;
}

function to_sim(sim, conf) {
  _load_quat(conf, temp_quat);
  QuatEtc.transformQXYZ(sim, temp_quat, conf[0], conf[1], conf[2]);
  return sim;
}

export default {
  initial, create, randomize, copy, dist, lerp, to_sim
};