
const { sqrt } = Math;



function getTDist2(a, b) {
  const dx = a[9] - b[9];
  const dy = a[10] - b[10];
  const dz = a[11] - b[11];
  return dx * dx + dy * dy + dz * dz;
}

function getTDist(a, b) {
  return sqrt(getTDist2(a, b));
}

export default {
  getTDist2,
  getTDist
};