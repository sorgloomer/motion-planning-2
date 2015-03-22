var WORLD = (function(utils) {
  "use strict";


  var SHAPE_U = [
    { size: [2, 1], pos: [0, -1.0], angle: 0 },
    { size: [1, 2], pos: [-3.5, 0], angle: 1 },
    { size: [1, 2], pos: [3.5, 0], angle: -1 }
  ];


  var SHAPE_GROUND = [
    { size: [5, 30], pos: [  -40,   0], angle:   0 },
    { size: [5, 30], pos: [   40,   0], angle:   0 },
    { size: [40, 5], pos: [    0, -30], angle:   0 },
    { size: [40, 5], pos: [    0,  30], angle:   0 },

    { size: [2 , 1], pos: [    0,  15], angle:   0 },
    { size: [2 , 1], pos: [ -4.5,  14], angle: 0.4 },
    { size: [2 , 1], pos: [ -4.5,  14], angle: 0.4 }

  ];

  var SHAPE_DOUBLE = [
    { size: [1, 1], pos: [-0.66, 0.66], angle: 0 },
    { size: [1, 1], pos: [0.66, -0.66], angle: 0 }
  ];


  return {
    walls: SHAPE_GROUND,
    agent: SHAPE_U,
    start: { pos: [0, 0], angle: 0 }
  };
})(utils);