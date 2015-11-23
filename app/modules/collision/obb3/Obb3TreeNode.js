import Vec3 from '/math/Vec3';
import OBox from '/collision/obb3/Obb3';

export default class BoxTreeNode {
  constructor(obox = null, children = null) {
    const my_obox = obox ? obox.clone() : new OBox();
    this.obox = my_obox;
    this.volume = my_obox.volume();
    this.radius = Vec3.len(my_obox.hsize);
    this.children = children;
    this._hit = false;
  }

  visit(cb) {
    cb(this);
    if (this.children) {
      this.children.forEach(c => c.visit(cb));
    }
  }

  set(node) {
    this.obox.copy(node.obox);
    this.volume = node.volume;
    this.radius = node.radius;
    this.children = node.children;
  }
}