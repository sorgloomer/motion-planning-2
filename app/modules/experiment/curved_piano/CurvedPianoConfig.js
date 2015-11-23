
import Sim2 from '/math/Sim2';
import VecN from '/math/VecN'

var DT = 0.2;
var TWO_PI = Math.PI * 2;

function create() {
  return new Float64Array(4);
}

function make(px, py, acos, asin) {
  const result = create();
  result[0] = px;
  result[1] = py;
  result[2] = acos;
  result[3] = asin;
  return result;
}

function loadModel(config, model) {
  return loadView(indexer, config);
  function indexer() { return model.agents[0].placement; }
}
function loadSample(simil, config) {
  return loadView(indexer, config);
  function indexer() { return simil; }
}

function loadView(indexer, config) {
  var tmp = indexer(0);
  if (tmp) {
    Sim2.setXYCS(tmp,
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
}

function lerp(a, b, t, to = create()) {
  return lerpTo(to, a, b, t);
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
  to[0] = 0;
  return to;
}

export default {
  initial, create, randomize,
  copy: VecN.copy, copyTo: VecN.copyTo,
  lerp, lerpTo,
  dist: VecN.dist, dist2: VecN.dist2,

  loadModel: loadModel,
  loadView: loadView,
  loadSample: loadSample
};

