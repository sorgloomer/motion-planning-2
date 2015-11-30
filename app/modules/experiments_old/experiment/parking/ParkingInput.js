var DT = 0.15;

function rspan(x) {
  return (Math.random() * 2 - 1) * x;
}

function randomize(inp) {
  inp[0] = rspan(1.0);
  inp[1] = rspan(1.5);
}

function applyTo(to, config, inp) {
  var dpos = inp[0] * DT;

  var a = dpos * inp[1];
  var sina = Math.sin(a), cosa = Math.cos(a);

  var nx =  config[2] * cosa + config[3] * sina;
  var ny = -config[2] * sina + config[3] * cosa;

  // car model is rotated by 90 degrees
  to[0] = config[0] + dpos * config[3];
  to[1] = config[1] - dpos * config[2];
  to[2] = nx;
  to[3] = ny;
  return to;
}

function applyIP(config, inp) {
  return applyTo(config, config, inp);
}

function create() {
  return new Float64Array(2);
}

export default {
  create, randomize, applyTo, applyIP
};

