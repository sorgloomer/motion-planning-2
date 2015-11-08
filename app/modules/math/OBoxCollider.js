import Vec3 from '/math/Sim3';
import Sim3 from '/math/Sim3';
import OBox from '/math/OBox';

const {min} = Math;

function minDirXYZ(vertices, dx, dy, dz) {
  var res = Vec3.dotXYZ(vertices[0], dx, dy, dz);
  for (var i = 1; i < vertices.length; i++) {
    var curr = dotXYZ(vertices[i], dx, dy, dz);
    res = min(res, curr);
  }
  return res;
}
function maxDirXYZ(vertices, dx, dy, dz) {
  return -minDirXYZ(vertices, -dx, -dy, -dz)
}
function minDir(vertices, d) {
  return minDirXYZ(vertices, d[0], d[1], d[2]);
}
function maxDir(vertices, d) {
  return maxDirXYZ(vertices, d[0], d[1], d[2]);
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
    const temp1 = this._tempVec1;
    const temp2 = this._tempVec2;
    const transA = ba.transform;
    const transB = ba.transform;
    const verticesA = this._verticesA;
    const verticesB = this._verticesB;
    const radsum = ba.radius + bb.radius;
    var minPenetration = 0;
    Sim3.getT(temp1, transA);
    Sim3.getT(temp2, transB);
    if (Vec3.dist2(temp1, temp2) > radsum * radsum) {
      return -radsum;
    } else {
      _getBoxVertices(verticesA, ba);
      _getBoxVertices(verticesB, bb);

      Sim3.getX(temp1, transA);  minPenetration = distDir();
      Sim3.getY(temp1, transA);  aggregate();
      Sim3.getZ(temp1, transA);  aggregate();

      Sim3.getX(temp1, transB);  aggregate();
      Sim3.getY(temp1, transB);  aggregate();
      Sim3.getZ(temp1, transB);  aggregate();

      // Vec3.crossIP stores result in temp1
      Vec3.crossIP(Sim3.getX(temp1, transA), Sim3.getX(temp2, transB)); aggregate();
      Vec3.crossIP(Sim3.getX(temp1, transA), Sim3.getY(temp2, transB)); aggregate();
      Vec3.crossIP(Sim3.getX(temp1, transA), Sim3.getZ(temp2, transB)); aggregate();
      Vec3.crossIP(Sim3.getY(temp1, transA), Sim3.getX(temp2, transB)); aggregate();
      Vec3.crossIP(Sim3.getY(temp1, transA), Sim3.getY(temp2, transB)); aggregate();
      Vec3.crossIP(Sim3.getY(temp1, transA), Sim3.getZ(temp2, transB)); aggregate();
      Vec3.crossIP(Sim3.getZ(temp1, transA), Sim3.getX(temp2, transB)); aggregate();
      Vec3.crossIP(Sim3.getZ(temp1, transA), Sim3.getY(temp2, transB)); aggregate();
      Vec3.crossIP(Sim3.getZ(temp1, transA), Sim3.getZ(temp2, transB)); aggregate();

      return minPenetration;
    }

    function distDir() {
      return maxDir(verticesA, temp1) - minDir(verticesB, temp1);
    }
    function aggregate() {
      minPenetration = min(minPenetration, distDir());
    }
  }
};
