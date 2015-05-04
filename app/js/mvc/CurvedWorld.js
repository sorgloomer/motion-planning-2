var CurvedWorld = (function() {
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
      { size: [5, 30], pos: [  -40,      0], angle:   0 },
      { size: [5, 30], pos: [   40,      0], angle:   0 },
      { size: [40, 5], pos: [    0,    -30], angle:   0 },
      { size: [40, 5], pos: [    0,     30], angle:   0 },


      { size: [2, 18], pos: [  -15,  -10.7], angle:   0 },
      { size: [2, 18], pos: [   15,  -10.7], angle:   0 },

      { size: [2,  5], pos: [  -15,   20.5], angle:   0 },
      { size: [2,  5], pos: [   15,   20.5], angle:   0 }
    ]
      .concat(slice(2, 2, 26, 26, 0, -5, 62, 118, 9))  // top curve
      .concat(slice(2, 2, 19, 19, 0, -5, 40, 140, 11)) // bottom curve
    ;


  return {
    walls: SHAPE_WALLS,
    agent: SHAPE_U,
    start: { pos: [-26, -20], angle: 0 },
    target: { pos: [26, -20], angle: 0 },
    hsize: [60, 40]
  };
})();