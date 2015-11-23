import similar2 from '/math/Sim2';
import vecn from '/math/VecN';

export default function(SEGMENTS, SEGMENT_SIZE) {

  var SIMILAR_INIT = similar2.create();
  similar2.setXYA(SIMILAR_INIT, 0, -10, 0);
  var SIMILAR_TEMP = similar2.create();
  var SIMILAR_TEMP2 = similar2.create();

  function create() {
    return new Float64Array(SEGMENTS);
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
    for (var i = 0; i < SEGMENTS; i++) {
      similar2.setRotateA(SIMILAR_TEMP2, config[i]);
      similar2.mul_(SIMILAR_TEMP, SIMILAR_TEMP2, SIMILAR_TEMP);
      tmp = indexer(i);
      if (tmp) similar2.set(tmp, SIMILAR_TEMP);

      similar2.setTranslateXY(SIMILAR_TEMP2, 0, SEGMENT_SIZE);
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
    return (Math.random() * (b - a)) + a;
  }


  function lerpTo(to, a, b, t) {
    var it = 1 - t;
    for (var i = 0; i < SEGMENTS; i++) {
      to[i] = a[i] * it + b[i] * t;
    }
    return to;
  }

  function lerp(a, b, t, to = create()) {
    return lerpTo(to, a, b, t);
  }

  function randomize(config, nbox) {
    for (var i = 0; i < SEGMENTS; i++) {
      config[i] = rint(nbox.min[i], nbox.max[i]);
    }
    return config;
  }

  function make(angle) {
    const result = create();
    for (let i = 0; i < result.length; i++) result[i] = angle;
    return result;
  }

  function initial(config = create()) {
    return config;
  }

  return {
    initial, create, randomize,
    copy: vecn.copy, copyTo: vecn.copyTo,
    lerp, lerpTo,
    dist: vecn.dist, dist2: vecn.dist2,

    loadModel, loadSample, loadView, make
  };
}