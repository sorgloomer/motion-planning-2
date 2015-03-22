var vec2 = (function(Float32Array, Array, Math){
  "use strict";

  function create() {
    return new Float32Array(2);
  }

  function clone(v) {
    return set(create(), v);
  }
  function array(cnt) {
    var buffer = new Float32Array(2 * cnt);
    var res = new Array(cnt);
    for (var i = 0; i < cnt; i++) res[i] = buffer.subarray(2 * i, 2 * i + 2);
    return res;
  }

  function add_(output, a, b) {
    output[0] = a[0] + b[0];
    output[1] = a[1] + b[1];
    return output;
  }
  function sub_(output, a, b) {
    output[0] = a[0] - b[0];
    output[1] = a[1] - b[1];
    return output;
  }
  function scale_(output, v, s) {
    output[0] = v[0] * s;
    output[1] = v[1] * s;
    return output;
  }

  function cmul_(output, a, b) {
    var ax = a[0], ay = a[1], bx = b[0], by = b[1];
    output[0] = ax * bx - ay * by;
    output[1] = ax * by + ay * bx;
    return output;
  }

  function set(output, v){
    output.set(v, 0);
    return output;
  }

  function setXY(output, x, y) {
    output[0] = x;
    output[1] = y;
    return output;
  }
  function setA(output, angle) {
    return setXY(output, Math.cos(angle), Math.sin(angle));
  }


  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }
  function cross(a, b) {
    return a[0] * b[1] - a[1] * b[0];
  }
  function len2(v) {
    return dot(v, v);
  }
  function len(v) {
    return Math.sqrt(len2(v));
  }


  function add(a, b) {
    return add_(a, a, b);
  }
  function sub(a, b) {
    return sub_(a, a, b);
  }
  function scale(v, s) {
    return scale_(v, v, s);
  }
  function cmul(a, b) {
    return cmul_(a, a, b);
  }

  function createXY(x, y) {
    return setXY(create(), x, y);
  }
  function createA(angle) {
    return setA(create(), angle);
  }

  function right_(output, v) {
    var vx = v[0], vy = v[1];
    output[0] = -vy;
    output[1] = vx;
    return output;
  }
  function right(v) {
    return right_(v, v);
  }

  return {
    ELEMENTS: 2,
    create: create,
    array: array,
    clone: clone,
    createXY: createXY,
    createA: createA,
    set: set,
    setXY: setXY,
    setA: setA,
    add_: add_,
    sub_: sub_,
    scale_: scale_,
    right_: right_,
    cmul_: cmul_,
    add: add,
    sub: sub,
    scale: scale,
    right: right,
    cmul: cmul,
    dot: dot,
    cross: cross,
    len2: len2,
    len: len
  }

})(Float32Array, Array, Math);