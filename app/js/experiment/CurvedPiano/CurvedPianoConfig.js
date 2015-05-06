var CurvedPianoConfig = (function() {

  var DT = 0.2;
  var TWO_PI = Math.PI * 2;

  function create() {
    return new Float32Array(4);
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
      similar2.setXYCS(tmp,
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
    inp[1] = rspan(1.0);
    inp[2] = rspan(1.0);
  }

  function applyInput(config, inp) {
    var a = inp[2] * DT;
    var sina = Math.sin(a), cosa = Math.cos(a);
    var newx = config[2] * cosa + config[3] * sina;
    var newy = -config[2] * sina + config[3] * cosa;

    config[2] = newx;
    config[3] = newy;


    config[0] += inp[0] * DT;
    config[1] += inp[1] * DT;
  }

  function createInput() {
    return vecn.create(3);
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
    randomize: randomize,
    copy: vecn.copy,
    loadModel: loadModel,
    loadView: loadView,
    loadSample: loadSample,
    dist: vecn.dist,
    lerp: lerp,
    set: vecn.set,
    input: {
      create: createInput,
      apply: applyInput,
      randomize: randomizeInput
    }
  };
})();

