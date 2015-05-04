var PhysicsConfiguration = (function() {
  var DT = 0.01;
  var GRAVITY = new Float64Array([0.0, 0.5]);

  function create() {
    return vecn.create(7);
  }

  function createInput() {
    return vecn.create(2)
  }

  function randomizeInput(inp) {
    inp[0] = Math.random();
    inp[1] = 2 * Math.random() - 1;
    return inp;
  }

  function applyInput(config, inp) {
    config[0] += config[4] * DT;
    config[1] += config[5] * DT;
    config[4] += (config[2] * inp[0] + GRAVITY[0]) * DT;
    config[5] += (config[3] * inp[0] + GRAVITY[1]) * DT;

    var dAngle = DT * config[6];
    var sinDAngle = Math.sin(dAngle);
    var cosDAngle = Math.cos(dAngle);
    var newDirX = config[2] * cosDAngle + config[3] * sinDAngle;
    var newDirY = -config[2] * sinDAngle + config[3] * cosDAngle;

    config[2] = newDirX;
    config[3] = newDirY;
    config[6] += inp[1] * DT;
  }

  function lerp(to, a, b, t) {
    var it = 1 - t;

    var omega = Math.acos(a[2] * b[2] + a[3] * b[3]);
    var ax = a[2], ay = a[3], bx = b[2], by = b[3];
    var isino = 1 / Math.sin(omega);
    var sino1 = Math.sin(it * omega) * isino;
    var sino2 = Math.sin(t * omega) * isino;
    to[2] = sino1 * ax + sino2 * bx;
    to[3] = sino1 * ay + sino2 * by;

    to[0] = a[0] * it + b[0] * t;
    to[1] = a[1] * it + b[1] * t;
    to[4] = a[4] * it + b[4] * t;
    to[5] = a[5] * it + b[5] * t;
    to[6] = a[6] * it + b[6] * t;
  }

  return {
    create: create,
    copy: vecn.copy,
    dist: vecn.dist,
    lerp: lerp,
    input: {
      apply: applyInput,
      create: createInput,
      randomize: randomizeInput
    }
  };
})();

