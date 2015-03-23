var WORLD = (function(utils) {
  "use strict";

  function slice(sx, sy, radx, rady, px, py, startdeg, enddeg, slices) {
    var res = [];
    for (var i = 0; i < slices; ++i) {
      var a = (startdeg + (enddeg - startdeg) * i / (slices - 1))  / 180 * Math.PI;
      res.push({ size: [sx, sy], pos: [Math.cos(a) * radx + px, Math.sin(a) * rady + py], angle: a });
    }
    return res;
  }


  var SHAPE_U = slice(1, 1.5, 22, 22, 0, -22, 75, 105, 5);


  var SHAPE_WALLS = [
      { size: [5, 30], pos: [  -40,   0], angle:   0 },
      { size: [5, 30], pos: [   40,   0], angle:   0 },
      { size: [40, 5], pos: [    0, -30], angle:   0 },
      { size: [40, 5], pos: [    0,  30], angle:   0 },

      { size: [2, 18], pos: [ -15,  -10], angle:   0 },
      { size: [2, 18], pos: [  15,  -10], angle:   0 },

      { size: [2, 6], pos: [ -17,  20], angle:   0 },
      { size: [2, 6], pos: [  17,  20], angle:   0 }
    ]
      .concat(slice(1, 1, 25, 25, 0, -5, 50, 130, 20))
      .concat(slice(1, 1, 20, 20, 0, -5, 40, 140, 20))
    ;


  return {
    walls: SHAPE_WALLS,
    agent: SHAPE_U,
    start: { pos: [0, 0], angle: 0 }
  };
})(utils);