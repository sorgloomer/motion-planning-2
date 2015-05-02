var ParkingConfig = (function() {

  var DT = 0.40;

  function create() {
    return new Float32Array(6);
  }

  function load(config, model) {
    similar2.setXYCS(model.agentPlacement,
      config[0] * 10,
      config[1] * 10,
      config[2],
      config[3]
    );
    return config;
  }

  function rspan(x) {
    return (Math.random() * 2 - 1) * x;
  }

  function randomizeInput(inp) {
    inp[0] = rspan(1.0);
    inp[1] = rspan(1.5);
  }

  function applyInput(config, inp) {
    var dpos = config[4] * DT;

    var a = dpos * config[5];
    var sina = Math.sin(a), cosa = Math.cos(a);

    var nx =  config[2] * cosa + config[3] * sina;
    var ny = -config[2] * sina + config[3] * cosa;

    config[0] += dpos * config[3];
    config[1] -= dpos * config[2];
    config[2] = nx;
    config[3] = ny;
    config[4] = clamp(config[4] + inp[0] * DT, 1.0);
    config[5] = clamp(config[5] + inp[1] * DT, 2.4);
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
    to[4] = a[4] * it + b[4] * t;
    to[5] = a[5] * it + b[5] * t;
  }


  return {
    create: create,
    copy: vecn.copy,
    load: load,
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

