import utils from '/utils/utils';

export default function(SEGMENTS, SEGMENT_SIZE) {
  const HALF_SEGMENT_SIZE = SEGMENT_SIZE / 2;
  var SHAPE_WALLS = [
    {size: [5, 10], pos: [0, 20], angle: 0},
    {size: [2, 2], pos: [-20, 0], angle: 0}
  ];

  var SHAPE_SEGMENT = [{size: [1.5, HALF_SEGMENT_SIZE], pos: [0, HALF_SEGMENT_SIZE], angle: 0}];

  return {
    walls: SHAPE_WALLS,
    agents: utils.times(SEGMENTS, SHAPE_SEGMENT),
    hsize: [60, 40]
  };
}