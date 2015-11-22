
const {sqrt, random} = Math;


function setRandomUnit(v) {
  var x, y, z;
  for (var i = 0; i < 20; i++) {
    x = random() * 2 - 1;
    y = random() * 2 - 1;
    z = random() * 2 - 1;
    var l2 = x*x + y*y + z*z;

    if (l2 <= 1 && l2 > 1e-4) {
      var l = sqrt(l2);
      v[1] = x / l;
      v[2] = y / l;
      v[3] = z / l;
      return v;
    }
  }
  v[0] = 0;
  v[1] = 0;
  v[2] = 0;
  return v;
}


function uniformInSphere(x, idx = 0, radius = 1) {
  for (var i = 0; i < 20; i++) {
    var x0 = random() * 2 - 1;
    var x1 = random() * 2 - 1;
    var x2 = random() * 2 - 1;
    var l2 = x0*x0 + x1*x1 + x2*x2;
    if (l2 <= 1) {
      x[idx + 0] = x0 * radius;
      x[idx + 1] = x1 * radius;
      x[idx + 2] = x2 * radius;
      return;
    }
  }
  x[idx + 0] = 0;
  x[idx + 1] = 0;
  x[idx + 2] = 0;
}

export default {
  setRandomUnit,
  uniformInSphere
};