var Configuration = (function(Math, Float32Array, similar2) {

  var TWO_PI = Math.PI * 2, PI = Math.PI;
  function create() {
    return new Float32Array(3);
  }

  function load(config, model) {
    similar2.setXYA(model.agentPlacement, config[0], config[1], config[2]);
    return config;
  }

  function fmod(a, b) {
    return a - Math.floor(a / b) * b;
  }
  function sqr(x) {
    return x * x;
  }
  function dist(a, b) {
    var da = fmod(Math.abs(a - b), TWO_PI);
    da = PI - Math.abs(da - PI);
    return Math.sqrt(sqr(a[0] - b[0]) + sqr(a[1] - b[1]) + da * da);
  }

  return {
    create: create,
    load: load,
    dist: dist
  };
})(Math, Float32Array, similar2);

