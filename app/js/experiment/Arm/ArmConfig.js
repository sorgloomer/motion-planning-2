var ArmConfig = (function() {

  var DT = 0.1;
  var SEGMENTS = 4;

  var SIMILAR_INIT = similar2.create();
  similar2.setXYA(SIMILAR_INIT, 0, -20, 0);
  var SIMILAR_TEMP = similar2.create();
  var SIMILAR_TEMP2 = similar2.create();

  function create() {
    return new Float32Array(SEGMENTS);
  }

  function loadModel(config, model) {
    var agents = model.agents;
    return loadView(indexer, config);
    function indexer(i) {
      return i < 0 ? null : agents[i].placement;
    }
  }

  function loadSample(simil, config) {
    return loadView(indexer, config);
    function indexer(i) {
      return i < 0 ? simil : null;
    }
  }

  function loadView(indexer, config) {
    similar2.set(SIMILAR_TEMP, SIMILAR_INIT);
    var tmp;
    for (var i = 0;i < SEGMENTS; i++) {
      similar2.setRotateA(SIMILAR_TEMP2, config[i]);
      similar2.mul_(SIMILAR_TEMP, SIMILAR_TEMP2, SIMILAR_TEMP);
      tmp = indexer(i);
      if (tmp) similar2.set(tmp, SIMILAR_TEMP);

      similar2.setTranslateXY(SIMILAR_TEMP2, 0, 8);
      similar2.mul_(SIMILAR_TEMP, SIMILAR_TEMP2, SIMILAR_TEMP);
    }
    tmp = indexer(-1);
    if (tmp) similar2.set(tmp, SIMILAR_TEMP);
    return config;
  }

  function rspan(x) {
    return (Math.random() * 2 - 1) * x;
  }
  function rint(a, b) {
    return (Math.random() * (b - a))  + a;
  }


  function randomizeInput(inp) {
    for (var i = 0; i < SEGMENTS; i++) inp[i] = rspan(1.0);
  }

  function applyInput(config, inp) {
    for (var i = 0; i < SEGMENTS; i++) config[i] += DT * inp[i];
  }

  function createInput() {
    return vecn.create(SEGMENTS);
  }

  function lerp(to, a, b, t) {
    var it = 1 - t;
    for (var i = 0; i < SEGMENTS; i++) {
      to[i] = a[i] * it + b[i] * t;
    }
  }


  function randomize(config, nbox) {
    for (var i = 0; i < SEGMENTS; i++) {
      config[i] = rint(nbox.min[i], nbox.max[i]);
    }
    return config;
  }

  return {
    create: create,
    randomize: randomize,
    copy: vecn.copy,
    loadModel: loadModel,
    loadSample: loadSample,
    loadView: loadView,
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

