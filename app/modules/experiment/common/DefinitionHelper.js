import Sim3 from '/math/Sim3';
import Vec3 from '/math/Vec3';
import OBox from '/math/solids/OBox';
import lists from '/utils/lists';
import { RAD_TO_DEG, DEG_TO_RAD, TWO_PI, PI } from '/utils/math';


const {sin, cos, tan} = Math;

export function OBox_setPlacement(obox, sx, sy, sz, cx, cy, cz, rx, ry, rz, ang) {
  const angrad = ang * DEG_TO_RAD;
  Vec3.setXYZ(obox.hsize, sx / 2, sy / 2, sz / 2);
  Sim3.setRotationAxisAngleXYZ(obox.transform, rx * angrad, ry * angrad, rz * angrad);
  Sim3.translateXYZ(obox.transform, cx, cy, cz);
}

export function OBox_makePlacement(sx, sy, sz, cx, cy, cz, rx, ry, rz, ang) {
  const r = new OBox();
  OBox_setPlacement(r, sx, sy, sz, cx, cy, cz, rx, ry, rz, ang);
  return r;
}

export function makeRing(radius, thickness, segments, sim = null) {
  const width = 2 * tan(PI / segments) * (radius + thickness / 2);
  return [lists.generate(segments, i => {
    const a = i / segments * TWO_PI;
    const res = OBox_makePlacement(
      thickness, thickness, width,
      radius * cos(a), 0, radius * sin(a),
      0, 1, 0, a * RAD_TO_DEG
    );
    if (sim) Sim3.mulIP(res.transform, sim);
    return res;
  })[2]];
}

export default {
  OBox_setPlacement,
  OBox_makePlacement,
  makeRing
};