var ParkingConfig = (function() {

  var DT = 0.15;
  var TWO_PI = Math.PI * 2;

  function create() {
    return new Float32Array(4);
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

  function randomizeInput(inp) {
    inp[0] = rspan(1.0);
    inp[1] = rspan(1.5);
  }

  function applyInput(config, inp) {
    var dpos = inp[0] * DT;

    var a = dpos * inp[1];
    var sina = Math.sin(a), cosa = Math.cos(a);

    var nx =  config[2] * cosa + config[3] * sina;
    var ny = -config[2] * sina + config[3] * cosa;

    config[0] += dpos * config[3];
    config[1] -= dpos * config[2];
    config[2] = nx;
    config[3] = ny;
  }

  function clamp(a, x) {
    if (a > x) return x;
    if (a < -x) return -x;
    return a;
  }

  function createInput() {
    return vecn.create(2);
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


  return {
    create: create,
    copy: vecn.copy,
    loadModel: loadModel,
    loadSample: loadSample,
    loadView: loadView,
    dist: vecn.dist,
    lerp: lerp,
    set: vecn.set,
    normalize: normalize,
    randomize: randomize,
    input: {
      create: createInput,
      apply: applyInput,
      randomize: randomizeInput
    }
  };
})();

