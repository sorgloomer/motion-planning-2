var ArmWorld = (function() {
  "use strict";


  function times(n, item) {
    var result = new Array(n);
    for (var i = 0; i < n; i++) {
      result[i] = item;
    }
    return result;
  }

  var SHAPE_WALLS = [
    { size: [5, 10], pos: [  0,  10 ], angle: 0 },
    { size: [2,  2], pos: [ -20, -10 ], angle: 0 }
    ];

  var SEGM = [{ size: [1.5, 4], pos: [0, 4], angle: 0 }];

  return {
    walls: SHAPE_WALLS,
    agents: times(4, SEGM),
    hsize: [60, 40]
  };
})();