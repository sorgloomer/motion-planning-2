import Vec3 from '/math/Vec3';

export default class BoxTreeNode {
  constructor(obox, children) {
    this.obox = obox.clone();
    this.radius = Vec3.len(this.obox.hsize);
    this.children = children;
  }
}