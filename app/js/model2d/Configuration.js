var Configuration = (function() {

  var DT = 0.3;

  function create() {
    return new Float32Array(4);
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

