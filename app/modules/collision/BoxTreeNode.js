import Vec3 from '/math/Vec3';

export default class BoxTreeNode {
  constructor(obox = null, children = null) {
    this.obox = obox ? obox.clone() : new OBox();
    this.volume = obox.volume();
    this.radius = Vec3.len(this.obox.hsize);
    this.children = children;
  }

  set(node) {
    this.obox.set(node.obox);
    this.volume = node.volume;
    this.radius = node.radius;
    this.children = node.children;
  }
}