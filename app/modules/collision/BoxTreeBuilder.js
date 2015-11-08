import Vec3 from '/math/Vec3';


const { random, sqrt } = Math;
function randomUnit(result = Vec3.create()) {
  for (var i = 0; i < 16; i++) {
    result[0] = random() * 2 - 1;
    result[1] = random() * 2 - 1;
    result[2] = random() * 2 - 1;
    var lenSq = Vec3.len2(result);
    if (lenSq >= 0.001 && lenSq <= 1) {
      return Vec3.scaleIP(result, 1 / sqrt(lenSq));
    }
  }
  return Vec3.setXYZ(result, 1, 0, 0);
}


export default class BoxTreeBuilder {
  constructor() {
    this.random_directions = generateRandomDirections();
  }



}
