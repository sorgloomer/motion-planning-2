import similar2 from '/math/Sim2';
import vecn from '/math/VecN';


const ACCELERATION = 1.0;
const STEERING_SPEED = 3.0;

function rspan(x) {
  return (Math.random() * 2 - 1) * x;
}

function randomize(inp) {
  inp[0] = rspan(1.0);
  inp[1] = rspan(1.0);
  inp[2] = 0.1 + Math.random() * 0.3;
}

function applyTo(to, config, inp) {
  var DT = inp[2];
  var dpos = config[4] * DT;

  var a = dpos * config[5];
  var sina = Math.sin(a), cosa = Math.cos(a);

  var nx =  config[2] * cosa + config[3] * sina;
  var ny = -config[2] * sina + config[3] * cosa;

  // car model is rotated by 90 degrees
  to[0] = config[0] + dpos * config[3];
  to[1] = config[1] - dpos * config[2];
  to[2] = nx;
  to[3] = ny;
  to[4] = clamp(config[4] + inp[0] * ACCELERATION * DT, 1.0);
  to[5] = clamp(config[5] + inp[1] * STEERING_SPEED * DT, 2.4);
  return to;
}

function applyIP(config, inp) {
  return applyTo(config, config, inp);
}

function clamp(a, x) {
  if (a > x) return x;
  if (a < -x) return -x;
  return a;
}

function create() {
  return vecn.create(3);
}

function costOf(inp) {
  return inp[2];
}
export default {
  create, randomize,
  costOf,
  applyTo, applyIP
};
