var ParkingWorld = (function() {
  "use strict";

  var SHAPE_CAR = [
    { size: [0.1, 0.6], pos: [  2.0,  7.0], angle:  0 },
    { size: [0.1, 0.6], pos: [  2.0,  1.0], angle:  0 },
    { size: [0.1, 0.6], pos: [ -2.0,  7.0], angle:  0 },
    { size: [0.1, 0.6], pos: [ -2.0,  1.0], angle:  0 },
    { size: [1.9, 4.0], pos: [    0,  4.0], angle:  0 }
  ];


  var SHAPE_WALLS = [
      { size: [25, 30], pos: [  -32,      0], angle:   0 },
      { size: [15, 30], pos: [   28,      0], angle:   0 },
      { size: [40,  5], pos: [    0,    -30], angle:   0 },
      { size: [40, 10], pos: [    0,     30], angle:   0 },


      { size: [2, 4], pos: [   10,  -20.0], angle:   0 },
      { size: [2, 4], pos: [   10,  -10.0], angle:   0 },
      { size: [2, 4], pos: [   10,   10.0], angle:   0 },
      { size: [2, 4], pos: [   10,   20.0], angle:   0 }
    ]
    ;


  return {
    walls: SHAPE_WALLS,
    agent: SHAPE_CAR,
    start: { pos: [-5, -18], angle: 0 },
    target: { pos: [12, -2], angle: 0 },
    hsize: [60, 40]
  };
})();