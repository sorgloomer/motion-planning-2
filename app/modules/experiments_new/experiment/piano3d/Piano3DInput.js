import QuatEtc from '/math/QuatEtc';
import Quat from '/math/Quat';
import Vec3Etc from '/math/Vec3Etc';

const { random } = Math;

const [temp_quat1, temp_quat2] = Quat.array(2);

function create() {
  return new Float64Array(6);
}

function _store_quat(arr, idx, quat) {
  arr[idx + 0] = quat[0];
  arr[idx + 1] = quat[1];
  arr[idx + 2] = quat[2];
  arr[idx + 3] = quat[3];
}
function _load_quat(arr, idx, quat) {
  quat[0] = arr[idx + 0];
  quat[1] = arr[idx + 1];
  quat[2] = arr[idx + 2];
  quat[3] = arr[idx + 3];
}

function randomize(c = create()) {
  Vec3Etc.uniformInSphere(c, 0, 1);
  Vec3Etc.uniformInSphere(c, 3, 1);
  return c;
}


function applyTo(dest, config, action, dt = 0.1) {
  dest[0] = config[0] + action[0] * dt * 3;
  dest[1] = config[1] + action[1] * dt * 3;
  dest[2] = config[2] + action[2] * dt * 3;

  _load_quat(config, 3, temp_quat1);
  Quat.setEulerScaleXYZS(temp_quat2, action[3], action[4], action[5], dt);
  Quat.mulIP(temp_quat1, temp_quat2);
  _store_quat(dest, 3, temp_quat1);
  return dest;
}

function applyIP(config, action, opt_dt) {
  return applyTo(config, config, action, opt_dt);
}

function costOf(inp) {
  return 0.2;
}

export default {
  create, randomize, applyTo, applyIP, costOf
};
