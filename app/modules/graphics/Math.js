
import Quat from '/math/Quat';
import QuatEtc from '/math/QuatEtc';

var temp_quat = Quat.create();

export function mquat_to_bquat(bq, mq) {
  bq.w = mq[0];
  bq.x = mq[1];
  bq.y = mq[2];
  bq.z = mq[3];
  return bq;
}

export function quaternionSetSim(q, sim) {
  return mquat_to_bquat(q, QuatEtc.rot_to_quat(temp_quat, sim));
}