import Vec3 from '/math/Vec3';
import Sim3 from '/math/Sim3';
import OBox from '/experiments_new/collision/obb3/Obb3';

const {min, sqrt} = Math;

function minBoundByDirXYZ(vertices, dx, dy, dz) {
  var res = Vec3.dotXYZ(vertices[0], dx, dy, dz);
  for (var i = 1; i < vertices.length; i++) {
    var curr = Vec3.dotXYZ(vertices[i], dx, dy, dz);
    res = min(res, curr);
  }
  return res;
}
function maxBoundByDirXYZ(vertices, dx, dy, dz) {
  return -minBoundByDirXYZ(vertices, -dx, -dy, -dz)
}
function minBoundByDir(vertices, d) {
  return minBoundByDirXYZ(vertices, d[0], d[1], d[2]);
}
function maxBoundByDir(vertices, d) {
  return maxBoundByDirXYZ(vertices, d[0], d[1], d[2]);
}

function _getBoxVertices(to, box) {
  const hsize = box.hsize, transform = box.transform;
  const sx = hsize[0], sy = hsize[1], sz = hsize[2];
  const mv = Sim3.mulVecIP, st = Vec3.setXYZ;
  mv(st(to[0], -sx, -sy, -sz), transform);
  mv(st(to[1], -sx, -sy, +sz), transform);
  mv(st(to[2], -sx, +sy, +sz), transform);
  mv(st(to[3], -sx, +sy, -sz), transform);
  mv(st(to[4], +sx, +sy, -sz), transform);
  mv(st(to[5], +sx, +sy, +sz), transform);
  mv(st(to[6], +sx, -sy, +sz), transform);
  mv(st(to[7], +sx, -sy, -sz), transform);
}

export default class OBoxCollider {
  constructor() {
    this._verticesA = Vec3.array(8);
    this._verticesB = Vec3.array(8);
    this._tempVec1 = Vec3.create();
    this._tempVec2 = Vec3.create();
  }

  collide(ba, bb) {
    return penetration(ba, bb) > 0;
  }

  maxBoxBoundByDir(box, dir) {
    const verticesA = this._verticesA;
    _getBoxVertices(verticesA, box);
    return maxBoundByDir(verticesA, dir);
  }
  minBoxBoundByDir(box, dir) {
    const verticesA = this._verticesA;
    _getBoxVertices(verticesA, box);
    return minBoundByDir(verticesA, dir);
  }
  penetration(ba, bb) {
    const temp1 = this._tempVec1;
    const temp2 = this._tempVec2;
    const transA = ba.transform;
    const transB = bb.transform;
    const verticesA = this._verticesA;
    const verticesB = this._verticesB;

    var minPenetration = 0;

    _getBoxVertices(verticesA, ba);
    _getBoxVertices(verticesB, bb);

    Sim3.getX(temp1, transA);  minPenetration = distDir();
    Sim3.getY(temp1, transA);  aggregate();
    Sim3.getZ(temp1, transA);  aggregate();

    Sim3.getX(temp1, transB);  aggregate();
    Sim3.getY(temp1, transB);  aggregate();
    Sim3.getZ(temp1, transB);  aggregate();

    // Vec3.crossIP stores result in temp1
    maybeAggregateCross(Sim3.getX(temp1, transA), Sim3.getX(temp2, transB));
    maybeAggregateCross(Sim3.getX(temp1, transA), Sim3.getY(temp2, transB));
    maybeAggregateCross(Sim3.getX(temp1, transA), Sim3.getZ(temp2, transB));
    maybeAggregateCross(Sim3.getY(temp1, transA), Sim3.getX(temp2, transB));
    maybeAggregateCross(Sim3.getY(temp1, transA), Sim3.getY(temp2, transB));
    maybeAggregateCross(Sim3.getY(temp1, transA), Sim3.getZ(temp2, transB));
    maybeAggregateCross(Sim3.getZ(temp1, transA), Sim3.getX(temp2, transB));
    maybeAggregateCross(Sim3.getZ(temp1, transA), Sim3.getY(temp2, transB));
    maybeAggregateCross(Sim3.getZ(temp1, transA), Sim3.getZ(temp2, transB));

    return minPenetration;

    function maybeAggregateCross(ref_a, b) {
      Vec3.crossIP(ref_a, b);
      const l2 = Vec3.len2(ref_a);
      if (l2 > 1e-5) {
        Vec3.scaleIP(ref_a, 1 / sqrt(l2));
        aggregate();
      } else {
        // debugger;
      }
    }
    function distDir() {
      const maxa = maxBoundByDir(verticesA, temp1);
      const mina = minBoundByDir(verticesA, temp1);
      const maxb = maxBoundByDir(verticesB, temp1);
      const minb = minBoundByDir(verticesB, temp1);
      return Math.min(maxa - minb, maxb - mina);
    }
    function aggregate() {
      const curr = distDir();
      if (curr < minPenetration) {
        minPenetration = curr;
      }
    }
  }
};
