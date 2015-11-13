
const {sqrt } = Math;

export function quaternionSetSim(q, sim) {

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
  } else if ((m00 > m11)&(m00 > m22)) {
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

  q.w = qw;
  q.x = qx;
  q.y = qy;
  q.z = qz;
  return q;
}