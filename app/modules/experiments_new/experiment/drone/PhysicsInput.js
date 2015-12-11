import QuatEtc from '/math/QuatEtc';
import Quat from '/math/Quat';
import Vec3 from '/math/Vec3';
import Vec3Etc from '/math/Vec3Etc';
import Sim3 from '/math/Sim3';

const { random } = Math;

const [temp_quat1, temp_quat2] = Quat.array(2);
const temp_vec1 = Vec3.create();
const temp_vec2 = Vec3.create();
const temp_sim1 = Sim3.create();

const GRAVITY = 0.5;
const MASS = 1.0;
const THRUST_FORCE = MASS * GRAVITY;
const THRUST_VARIANCE = 0.3;
const ROTATION_TORQUE = 0.2;
const ROTATION_TORQUE_Y = ROTATION_TORQUE * 0.1;
const MOMENT_OF_INERTIA = 5.0;

function create() {
  return new Float64Array(5);
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

function _store_vec(arr, idx, vec) {
  arr[idx + 0] = vec[0];
  arr[idx + 1] = vec[1];
  arr[idx + 2] = vec[2];
}
function _load_vec(arr, idx, vec) {
  vec[0] = arr[idx + 0];
  vec[1] = arr[idx + 1];
  vec[2] = arr[idx + 2];
}

function randomize(c = create()) {
  c[0] = 1.0 + (random() * 2 - 1) * THRUST_VARIANCE;
  Vec3Etc.uniformInSphere(c, 1, 1);
  c[0] *= THRUST_FORCE;
  c[1] *= ROTATION_TORQUE;
  c[2] *= ROTATION_TORQUE_Y; // Torque around selfY axis
  c[3] *= ROTATION_TORQUE;
  c[4] = 0.1 + random() * 1.9; // dt
  return c;
}



function applyTo(dest, config, action) {

  const dt = action[4];
  // load previous orientation
  _load_quat(config, 6, temp_quat1);
  QuatEtc.quat_to_sim(temp_sim1, temp_quat1);

  // load torque
  _load_vec(action, 1, temp_vec1);
  Sim3.mulVecIP(temp_vec1, temp_sim1);

  // integrate torque to angular velocity
  _load_vec(config, 10, temp_vec2);
  Vec3.scaleIP(temp_vec1, dt / MOMENT_OF_INERTIA); // convert torque to delta angular velocity
  Vec3.addIP(temp_vec2, temp_vec1);
  _store_vec(dest, 10, temp_vec2);

  // calculate new orientation
  Quat.setEulerScaleVS(temp_quat2, temp_vec2, dt);
  Quat.mulIP(temp_quat1, temp_quat2);
  _store_quat(dest, 6, temp_quat1);

  // calculate acceleration towards selfY
  QuatEtc.quat_to_sim(temp_sim1, temp_quat1);
  Vec3.setXYZ(temp_vec1, 0, -action[0], 0);
  Sim3.mulVecIP(temp_vec1, temp_sim1);

  // calculate integrate acceleration to velocity
  _load_vec(config, 3, temp_vec2);
  temp_vec1[1] -= GRAVITY * MASS; // apply gravitational force
  Vec3.scaleIP(temp_vec1, dt / MASS); // convert force to delta velocity
  Vec3.addIP(temp_vec2, temp_vec1);
  _store_vec(dest, 3, temp_vec2);


  _load_vec(config, 0, temp_vec1);
  Vec3.scaleIP(temp_vec2, dt);
  Vec3.addIP(temp_vec1, temp_vec2);
  _store_vec(dest, 0, temp_vec1);

  return dest;
}

function applyIP(config, action, opt_dt) {
  return applyTo(config, config, action, opt_dt);
}

function costOf(inp) {
  return inp[4];
}
export default {
  create, randomize, applyTo, applyIP, costOf
};
