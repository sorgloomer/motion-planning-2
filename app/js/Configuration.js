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

  function lerp(output, a, b, t) {
    output[0] = a[0] + (b[0] - a[0]) * t;
    output[1] = a[1] + (b[1] - a[1]) * t;
    var dang = fmod(b[2] - a[2] + PI, TWO_PI) - PI;
    output[2] = a[2] + dang * t;
  }

  function set(output, a) {
    output.set(a);
  }
  function setXYA(output, x, y, a) {
    output[0] = x;
    output[1] = y;
    output[2] = fmod(a, TWO_PI);
  }
  return {
    create: create,
    load: load,
    dist: dist,
    lerp: lerp,
    set: set,
    setXYA: setXYA
  };
})(Math, Float32Array, similar2);

