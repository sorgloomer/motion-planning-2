var similar2 = (function(Float32Array, Array, Math) {
  "use strict";

  function create() {
    return new Float32Array(4);
  }

  function clone(sim) {
    return set(create(), sim);
  }
  function array(cnt) {
    var buffer = new Float32Array(4 * cnt);
    var res = new Array(cnt);
    for (var i = 0; i < cnt; i++) res[i] = buffer.subarray(4 * i, 4 * i + 4);
    return res;
  }

  function scale(output, sim, s) {
    output[0] = sim[0] * s;
    output[1] = sim[1] * s;
    output[2] = sim[2] * s;
    output[3] = sim[3] * s;
    return output;
  }

  function set(output, sim){
    output.set(sim, 0);
    return output;
  }

  function setXYA(output, x, y, a) {
    return setXYCS(output, x, y, Math.cos(a), Math.sin(a));
  }
  function setXYCS(output, x, y, c, s) {
    output[0] = c;
    output[1] = s;
    output[2] = x;
    output[3] = y;
    return output;
  }

  function setTranslateXY(output, x, y) {
    output[0] = 1;
    output[1] = 0;
    output[2] = x;
    output[3] = y;
    return output;
  }
  function setTranslateV(output, v) {
    return setTranslateXY(output, v[0], v[1])
  }

  function setRotateCS(output, c, s) {
    output[0] = c;
    output[1] = s;
    output[2] = 0;
    output[3] = 0;
    return output;
  }
  function setRotateA(output, angle) {
    return setRotateCS(output, Math.cos(angle), Math.sin(angle));
  }
  function setRotateV(output, v) {
    return setRotateCS(output, v[0], v[1]);
  }
  function setIdentity(output) {
    output[0] = 1;
    output[1] = output[2] = output[3] = 0;
    return output;
  }


  function mul_(output, a, b) {
    var ac = a[0], as = a[1], ax = a[2], ay = a[3];
    var bc = b[0], bs = b[1], bx = b[2], by = b[3];
    output[0] = ac * bc - as * bs;
    output[1] = ac * bs + as * bc;
    output[2] = ax * bc - ay * bs + bx;
    output[3] = ax * bs + ay * bc + by;
    return output;
  }

  function transform_(output, v, sim) {
    var ac = sim[0], as = sim[1], ax = sim[2], ay = sim[3];
    var vx = v[0], vy = v[1];
    output[0] = vx * ac - vy * as + ax;
    output[1] = vx * as + vy * ac + ay;
    return output;
  }
  function rotate_(output, v, sim) {
    var ac = sim[0], as = sim[1];
    var vx = v[0], vy = v[1];
    output[0] = vx * ac - vy * as;
    output[1] = vx * as + vy * ac;
    return output;
  }

  function mul(a, b) {
    return mul_(a, a, b);
  }

  function transform(v, sim) {
    return transform_(v, v, sim);
  }
  function rotate(v, sim) {
    return rotate_(v, v, sim);
  }

  function getRotateV(output, sim) {
    output[0] = sim[0];
    output[1] = sim[1];
    return output;
  }
  function getTranslateV(output, sim) {
    output[0] = sim[2];
    output[1] = sim[3];
    return output;
  }

  function invert_(output, sim) {
    var c = sim[0], s = sim[1], x = sim[2], y = sim[3];
    var idet = 1.0 / (c * c + s * s);
    output[0] = idet * c;
    output[1] = -idet * s;
    output[2] = -idet * (c * x + s * y);
    output[3] = idet * (s * x + c * y);
    return output;
  }
  function invert(sim) {
    return invert_(sim, sim);
  }

  function getRotateM(output, sim) {
    output[0] = sim[0];
    output[1] = sim[1];
    output[2] = 0;
    output[3] = 0;
    return output;
  }
  function getTranslateM(output, sim) {
    output[0] = 1;
    output[1] = 0;
    output[2] = sim[2];
    output[3] = sim[3];
    return output;
  }


  function createIdentity() {
    return setIdentity(create());
  }
  function createRotateA(a) {
    return setRotateA(create(), a);
  }
  function createRotateCS(c, s) {
    return setRotateA(create(), c, s);
  }
  function createRotateV(v) {
    return setRotateV(create(), v);
  }
  function createTranslateXY(x, y) {
    return setTranslateXY(create(), x, y);
  }
  function createTranslateV(v) {
    return setTranslateV(create(), v);
  }
  function createXYA(x, y, a) {
    return setXYA(create(), x, y, a);
  }
  function createXYCS(x, y, c, s) {
    return setXYCS(create(), x, y, c, s);
  }

  function det(sim) {
    var c = sim[0], s = sim[1];
    return c * c + s * s;
  }
  function getScaleFactor(sim) {
    return Math.sqrt(det(sim));
  }

  return {
    ELEMENTS: 4,
    create: create,
    array: array,
    clone: clone,
    createXYA: createXYA,
    createXYCS: createXYCS,
    createIdentity: createIdentity,
    createRotateA: createRotateA,
    createRotateCS: createRotateCS,
    createRotateV: createRotateV,
    createTranslateXY: createTranslateXY,
    createTranslateV: createTranslateV,

    mul_: mul_,
    transform_: transform_,
    rotate_: rotate_,
    invert_: invert_,
    mul: mul,
    transform: transform,
    rotate: rotate,
    invert: invert,

    set: set,
    setXYA: setXYA,
    setXYCS: setXYCS,
    setIdentity: setIdentity,
    setRotateCS: setRotateCS,
    setRotateA: setRotateA,
    setRotateV: setRotateV,
    setTranslateXY: setTranslateXY,
    setTranslateV: setTranslateV,

    scale: scale,
    det: det,
    getRotateV: getRotateV,
    getRotateM: getRotateM,
    getTranslateV: getTranslateV,
    getTranslateM: getTranslateM,
    getScaleFactor: getScaleFactor
  }

})(Float32Array, Array, Math);