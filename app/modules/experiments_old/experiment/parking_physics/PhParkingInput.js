import similar2 from '/math/Sim2';
import vecn from '/math/VecN';

var DT = 0.1;

function rspan(x) {
  return (Math.random() * 2 - 1) * x;
}

function randomize(inp) {
  inp[0] = rspan(1.0);
  inp[1] = rspan(2.0);
}

function applyTo(to, config, inp) {
  var dpos = config[4] * DT;

  var a = dpos * config[5];
  var sina = Math.sin(a), cosa = Math.cos(a);

  var nx =  config[2] * cosa + config[3] * sina;
  var ny = -config[2] * sina + config[3] * cosa;

  to[0] = config[0] + dpos * config[3];
  to[1] = config[1] - dpos * config[2];
  to[2] = nx;
  to[3] = ny;
  to[4] = clamp(config[4] + inp[0] * DT, 1.0);
  to[5] = clamp(config[5] + inp[1] * DT, 2.4);
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
  return vecn.create(2);
}

export default {
  create, randomize,
  applyTo, applyIP
};
