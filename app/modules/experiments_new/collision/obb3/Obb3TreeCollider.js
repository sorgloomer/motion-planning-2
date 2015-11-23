import OBoxCollider from '/experiments_new/collision/obb3/Obb3Collider';
import Sim3 from '/math/Sim3';
import Sim3Etc from '/math/Sim3Etc';
import lists from '/utils/lists';
import BoxTreeNode from '/experiments_new/collision/obb3/Obb3TreeNode';
import OBox from '/experiments_new/collision/obb3/Obb3';


const {sqrt} = Math;
export default class BoxTreeCollider {
  constructor() {
    this._obox_collider = new OBoxCollider();
    this._temp_obox = new OBox();
    this._hit_coins = 0;
  }
  _node_penetration(node1, node2, sim) {
    const obox1 = node1.obox, obox2 = this._temp_obox;
    obox2.copy(node2.obox);
    Sim3.mulIP(obox2.transform, sim);

    const dist2 = Sim3Etc.getTDist2(obox1.transform, obox2.transform);
    const radsum = node1.radius + node2.radius;
    if (dist2 < radsum * radsum) {
      return this._obox_collider.penetration(obox1, obox2);
    } else {
      return radsum - sqrt(dist2);
    }
  }
  penetration(nodeA, nodeB, simB) {
    const cases =
      ((nodeA.volume > nodeB.volume) ? 4 : 0) +
      (nodeA.children ? 2 : 0) +
      (nodeB.children ? 1 : 0);
    const pen = this._node_penetration(nodeA, nodeB, simB);
    if (pen > 0) {
      switch (cases) {
        case 0: case 4:
        nodeA._hit = nodeB._hit = true;
        return pen;
        case 1: case 3: case 5:
        this._hit_coins--;
        if (this._hit_coins === 0) {
          nodeB.children.forEach(n => n._hit = true);
        }
        return lists.selectMax(nodeB.children, n => this.penetration(nodeA, n, simB));
        case 2: case 6: case 7:
        this._hit_coins--;
        if (this._hit_coins === 0) {
          nodeA.children.forEach(n => n._hit = true);
        }
        return lists.selectMax(nodeA.children, n => this.penetration(n, nodeB, simB));
      }
    } else {
      return pen;
    }
  }

  collide(nodeA, nodeB, simB) {
    return this.penetration(nodeA, nodeB, simB) > 0;
  }
}