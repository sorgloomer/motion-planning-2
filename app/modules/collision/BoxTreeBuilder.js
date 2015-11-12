import Vec3 from '/math/Vec3';
import Sim3 from '/math/Sim3';
import OBoxCollider from '/math/OBoxCollider';
import lists from '/utils/lists';
import BoxTreeNode from '/collision/BoxTreeNode';

const { random, sqrt, max, min, floor } = Math;
function randomUnitVec3(result = Vec3.create()) {
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


const temp_randomRot3 = Vec3.array(3);
function randomRot3(result = Sim3.create()) {
  var v1 = randomUnitVec3(temp_randomRot3[0]);
  var v2 = randomUnitVec3(temp_randomRot3[1]);
  var v3 = Vec3.crossTo(temp_randomRot3[2], v1, v2);
  Vec3.crossTo(v2, v1, v3);
  Vec3.normalizeIP(v1);
  Vec3.normalizeIP(v2);
  Vec3.normalizeIP(v3);
  return Sim3.setRotationVecs(result, v1, v2, v3);
}

export default class BoxTreeBuilder {
  constructor() {
    this._random_rots = lists.generate(64, () => randomRot3());
    this._box_collider = new OBoxCollider();
  }


  function _calcEnclosingBox(boxes, rot) {
    var result = new OBox();
    var v = Vec3.create();
    const collider = this._box_collider;

    Sim3.getX(v, rot);
    var xmin = lists.selectMin(boxes, b => collider.minBoxBoundByDir(b, v));
    var xmax = lists.selectMax(boxes, b => collider.maxBoxBoundByDir(b, v));
    Sim3.getY(v, rot);
    var ymin = lists.selectMin(boxes, b => collider.minBoxBoundByDir(b, v));
    var ymax = lists.selectMax(boxes, b => collider.maxBoxBoundByDir(b, v));
    Sim3.getZ(v, rot);
    var zmin = lists.selectMin(boxes, b => collider.minBoxBoundByDir(b, v));
    var zmax = lists.selectMax(boxes, b => collider.maxBoxBoundByDir(b, v));


    Sim3.setTranslationXYZ(result.transform,
      (xmin + xmax) / 2,
      (ymin + ymax) / 2,
      (zmin + zmax) / 2);
    Sim3.mulIP(result.transform, rot);
    result.hsize[0] = (xmax - xmin) / 2;
    result.hsize[1] = (ymax - ymin) / 2;
    result.hsize[2] = (zmax - zmin) / 2;
    return result;
  }

  function _splitByRot(boxes, rot) {
    const dir = Sim3.getX(Vec3.create(), rot);
    const collider = this._box_collider;
    const sorted = lists.sortedBy(boxes, b => collider.maxBoxBoundByDir(b, dir));
    const mid = floor(boxes.length / 2);
    const list1 = sorted.slice(0, mid);
    const list2 = sorted.slice(mid);
    const bbox1 = this._calcEnclosingBox(list1, rot);
    const bbox2 = this._calcEnclosingBox(list2, rot);
    const bboxa = this._calcEnclosingBox(boxes, rot);
    const volume1 = bbox1.volume();
    const volume2 = bbox2.volume();
    const maxVolume = max(volume1, volume2);
    const splitNegScore = 0.02 * (volume1 + volume2) + maxVolume;
    if (list1.length < 1 || list2.length < 1) throw new Error("BoxTreeBuilder._splitByRot:1");
    return { parts: [list1, list2], bboxa, splitNegScore };
  }

  function buildBoxTree(boxes) {
    if (boxes.length < 2) {
      return new BoxTreeNode(boxes[0], null);
    } else {
      const splitData = lists.minBy(this._random_rots.map(rot => this._splitByRot(boxes, rot)), i => i.splitNegScore);
      return new BoxTreeNode(splitData.bboxa, splitData.parts.map(bs => this.buildBoxTree(bs)));
    }
  }
}
