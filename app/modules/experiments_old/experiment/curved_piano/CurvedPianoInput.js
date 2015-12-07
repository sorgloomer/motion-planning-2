import VecN from '/math/VecN'

var DT = 0.2;
var TWO_PI = Math.PI * 2;


function rspan(x) {
  return (Math.random() * 2 - 1) * x;
}
function rint(a, b) {
  return (Math.random() * (b - a))  + a;
}


function randomize(inp) {
  inp[0] = rspan(1.0);
  inp[1] = rspan(1.0);
  inp[2] = rspan(1.0);
}

function applyTo(to, config, inp) {
  var a = inp[2] * DT;
  var sina = Math.sin(a), cosa = Math.cos(a);
  var newx = config[2] * cosa + config[3] * sina;
  var newy = -config[2] * sina + config[3] * cosa;

  to[2] = newx;
  to[3] = newy;


  to[0] = config[0] + inp[0] * DT;
  to[1] = config[1] + inp[1] * DT;
  return to;
}

function applyIP(config, inp) {
  return applyTo(config, config, inp);
}

function create() {
  return new Float64Array(3);
}

function lerp(to, a, b, t) {
  var it = 1 - t;


  var omega = Math.acos(a[2] * b[2] + a[3] * b[3]);
  var sinOmega = Math.sin(omega);
  var sinO1 = Math.sin(it * omega) / sinOmega;
  var sinO2 = Math.sin(t * omega) / sinOmega;

  to[0] = a[0] * it + b[0] * t;
  to[1] = a[1] * it + b[1] * t;
  to[2] = sinO1 * a[2] + sinO2 * b[2];
  to[3] = sinO1 * a[3] + sinO2 * b[3];
}


function costOf(inp) {
  return 0.2;
}

export default {
  create, applyTo, applyIP, randomize, costOf
};

