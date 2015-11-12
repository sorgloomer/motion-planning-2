import OBoxCollider from '/math/OBoxCollider';
import Sim3 from '/math/Sim3';
import Sim3Etc from '/math/Sim3Etc';
import lists from '/utils/lists';
import BoxTreeNode from '/collision/BoxTreeNode';

export default class BoxTreeCollider {
  constructor() {
    this._obox_collider = new OBoxCollider();
    this._temp_node = new BoxTreeNode();
  }
  _node_penetration(node1, node2) {
    const dist2 = Sim3Etc.getTDist2(node1, node2);
    const radsum = node1.radius + node2.radius;
    if (dist2 < radsum * radsum) {
      return this._obox_collider.penetration(node1.obox, node2.obox);
    } else {
      return radsum - sqrt(dist2);
    }
  }
  _penetration_b_transformed(nodeA, nodeB, simB) {

    const pen = this._node_penetration(nodeA, nodeB);
    if (pen > 0) {
      const cases =
        ((nodeA.volume > nodeB.volume) ? 4 : 0) +
        (nodeA.children ? 2 : 0) +
        (nodeB.children ? 1 : 0);
      switch (cases) {
        case 0: case 4:
        return pen;
        case 1: case 3: case 5:
        return lists.selectMax(nodeB.children, n => this.penetration(nodeA, n, simB));
        case 2: case 6: case 7:
        return lists.selectMax(nodeA.children, n => this._penetration_b_transformed(n, nodeB, simB));
      }
    } else {
      return pen;
    }
  }
  penetration(nodeA, nodeB, simB) {
    const temp_node = this._temp_node;

    temp_node.set(nodeB);
    Sim3.mulIP(temp_node.obox.transform, simB);

    return this._penetration_b_transformed(nodeA, temp_node, simB);
  }
}