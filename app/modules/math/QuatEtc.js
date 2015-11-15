
const {sqrt, random} = Math;


function setRandomUnit(q) {
  var w, x, y, z;
  for (var i = 0; i < 20; i++) {
    w = random() * 2 - 1;
    x = random() * 2 - 1;
    y = random() * 2 - 1;
    z = random() * 2 - 1;
    var l2 = w*w + x*x + y*y + z*z;

    if (l2 <= 1 && l2 > 1e-4) {
      var l = sqrt(l2);
      q[0] = w / l;
      q[1] = x / l;
      q[2] = y / l;
      q[3] = z / l;
      return q;
    }
  }
  q[0] = 1;
  q[1] = 0;
  q[2] = 0;
  q[3] = 0;
  return q;
}

function quat_to_rot(sim, q) {
  var a = q[3], b = q[0], c = q[1], d = q[2];

  sim[0] = a*a + b*b - c*c - d*d;
  sim[1] = 2*b*c - 2*a*d;
  sim[2] = 2*b*d + 2*a*c;

  sim[3] = 2*b*c + 2*a*d;
  sim[4] = a*a - b*b + c*c - d*d;
  sim[5] = 2*c*d - 2*a*b;

  sim[6] = 2*b*d - 2*a*c;
  sim[7] = 2*c*d + 2*a*b;
  sim[8] = a*a - b*b - c*c + d*d;
  return sim;
}

function quat_to_sim(sim, q) {
  quat_to_rot(sim, q);
  sim[9] = 0;
  sim[10] = 0;
  sim[11] = 0;
  return sim;
}

function rot_to_quat(q, sim) {
  const
    m00 = sim[0], m10 = sim[1], m20 = sim[2],
    m01 = sim[3], m11 = sim[4], m21 = sim[5],
    m02 = sim[6], m12 = sim[7], m22 = sim[8];

  const tr = m00 + m11 + m22;
  var S, qw, qx, qy, qz;

  if (tr > 0) {
    S = sqrt(tr+1.0) * 2; // S=4*qw
    qw = 0.25 * S;
    qx = (m21 - m12) / S;
    qy = (m02 - m20) / S;
    qz = (m10 - m01) / S;
  } else if ((m00 > m11) && (m00 > m22)) {
    S = sqrt(1.0 + m00 - m11 - m22) * 2; // S=4*qx
    qw = (m21 - m12) / S;
    qx = 0.25 * S;
    qy = (m01 + m10) / S;
    qz = (m02 + m20) / S;
  } else if (m11 > m22) {
    S = sqrt(1.0 + m11 - m00 - m22) * 2; // S=4*qy
    qw = (m02 - m20) / S;
    qx = (m01 + m10) / S;
    qy = 0.25 * S;
    qz = (m12 + m21) / S;
  } else {
    S = sqrt(1.0 + m22 - m00 - m11) * 2; // S=4*qz
    qw = (m10 - m01) / S;
    qx = (m02 + m20) / S;
    qy = (m12 + m21) / S;
    qz = 0.25 * S;
  }

  q[0] = qw;
  q[1] = qx;
  q[2] = qy;
  q[3] = qz;
  return q;
}

function transformQXYZ(to, q, x, y, z) {
  quat_to_rot(to, q);
  to[9] = x;
  to[10] = y;
  to[11] = z;
  return to;
}

export default {
  quat_to_rot,
  quat_to_sim,
  rot_to_quat,

  setRandomUnit,
  transformQXYZ
};