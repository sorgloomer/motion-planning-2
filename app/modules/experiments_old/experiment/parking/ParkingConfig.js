import similar2 from '/math/Sim2';
import vecn from '/math/VecN';

var DT = 0.15;
var TWO_PI = Math.PI * 2;
var DEG_TO_RAD = Math.PI / 180;

function create() {
  return vecn.create(4);
}

function loadModel(config, model) {
  return loadView(indexer, config);
  function indexer() {
    return model.agents[0].placement;
  }
}
function loadSample(simil, config) {
  return loadView(indexer, config);
  function indexer() {
    return simil;
  }
}
function loadView(indexer, config) {
  var placement = indexer(0);
  if (placement) {
    similar2.setXYCS(placement,
      config[0] * 10,
      config[1] * 10,
      config[2],
      config[3]
    );
  }
  return config;
}

function rspan(x) {
  return (Math.random() * 2 - 1) * x;
}
function rint(a, b) {
  return (Math.random() * (b - a))  + a;
}

function clamp(a, x) {
  if (a > x) return x;
  if (a < -x) return -x;
  return a;
}

function lerpTo(to, a, b, t) {
  var it = 1 - t;

  var omega = Math.acos(a[2] * b[2] + a[3] * b[3]);
  var sinOmega = Math.sin(omega);
  var sinO1 = Math.sin(it * omega) / sinOmega;
  var sinO2 = Math.sin(t * omega) / sinOmega;

  to[0] = a[0] * it + b[0] * t;
  to[1] = a[1] * it + b[1] * t;
  to[2] = sinO1 * a[2] + sinO2 * b[2];
  to[3] = sinO1 * a[3] + sinO2 * b[3];
  return to;
}

function lerp(a, b, t, to = create()) {
  return lerpTo(to, a, b, t);
}

function normalize(config) {
  var len = Math.sqrt(config[2] * config[2] + config[3] * config[3]);
  config[2] /= len;
  config[3] /= len;
  return config;
}

function randomize(config, nbox) {
  config[0] = rint(nbox.min[0], nbox.max[0]);
  config[1] = rint(nbox.min[1], nbox.max[1]);
  var a = Math.random() * TWO_PI;
  config[2] = Math.cos(a);
  config[3] = Math.sin(a);
  return config;
}

function initial(to = create()) {
  return to;
}
function make(x, y, a) {
  const r = create();
  r[0] = x;
  r[1] = y;
  r[2] = Math.cos(a * DEG_TO_RAD);
  r[3] = Math.sin(a * DEG_TO_RAD);
  return r;
}

export default {
  initial, create, randomize,
  lerp, lerpTo,
  dist: vecn.dist,
  dist2: vecn.dist2,
  copy: vecn.copy,
  copyTo: vecn.copyTo,

  loadModel, loadSample, loadView, make
};
