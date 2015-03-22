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
    //gravity: [0, -10],
    bodies: [
      {
        name: 'ground',
        type: 'static',
        pos: [0, 0],
        angle: 0,
        shape: SHAPE_GROUND
      },
      {
        name: 'agent',
        type: 'dynamic',
        pos: [0, 0],
        angle: 1,
        shape: SHAPE_U
      }
      /*
      ,{
        type: 'dynamic',
        pos: [0, 10],
        angle: 3,
        shape: SHAPE_U
      }*/
    ].concat(utils.range(0, function (i) {
        return {
          type: 'dynamic',
          pos: [Math.random() * 10, 10 + i * 1.5],
          angle: Math.random() * 3.14,
          shape: SHAPE_DOUBLE
        }
      }))
  };
})(utils);