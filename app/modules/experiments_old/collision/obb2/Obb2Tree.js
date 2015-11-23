import Sim2 from '/math/Sim2';
import Vec2 from '/math/Vec2';
import Obb2 from '/experiments_old/collision/obb2/Obb2';

var TEMP_OBOX = new Obb2();

function Obb2Tree() {
  this.box = new Obb2();
  this.area = 0;
  this.children = null;
  this.leafCount = 0;
}

Obb2Tree.prototype.isLeaf = function _BoxTree_isLeaf() {
  return !this.children || this.children.length === 0;
};
Obb2Tree.prototype.process = function _BoxTree_process() {
  var box = this.box;
  var hsize = box.hsize;
  var leafCount = 0;

  if (this.children) {
    this.children.forEach(function(c) {
      leafCount += c.leafCount;
    });
  } else {
    leafCount = 1;
  }
  this.leafCount = leafCount;
  this.area = 4 * hsize[0] * hsize[1] * Sim2.det(box.placement);
};


function collidesShallow(node1, node2, node2sim) {
  Obb2.transform_(TEMP_OBOX, node2.box, node2sim);
  return Obb2.collide(node1.box, TEMP_OBOX);
}

function collides(node1, node2, node2sim, inspectCb) {

  function bound(node1, node2) {
    if (!collidesShallow(node1, node2, node2sim)) return false;
    var disc = (node1.area > node2.area) ? 0 : 4;
    if (node1.isLeaf()) disc += 1;
    if (node2.isLeaf()) disc += 2;
    switch (disc) {
      case 0: case 2: case 6:
      return node1.children.some(bound2);
      case 1: case 4:  case 5:
      return node2.children.some(bound1);
      case 3: case 7:
      return true;
    }
    function bound1(node2) {
      var res = bound(node1, node2);
      if (inspectCb) inspectCb(node2, 2, res);
      return res;
    }
    function bound2(node1) {
      var res = bound(node1, node2);
      if (inspectCb) inspectCb(node1, 1, res);
      return res;
    }
  }
  var res = bound(node1, node2);
  if (inspectCb) {
    inspectCb(node1, 1, res);
    inspectCb(node2, 2, res);
  }
  return res;
}

function boxOf(x) {
  return x.box;
}
function copyArr(a) {
  return a && a.slice(0);
}
function wrap(list, orientation, children) {
  var result = new Obb2Tree();
  result.children = copyArr(children || list);
  Obb2.wrapAll(result.box, list.map(boxOf), orientation);
  result.process();
  return result;
}

Obb2Tree.collides = collides;
Obb2Tree.wrap = wrap;
Obb2Tree.prototype.collides = function(node2, node2sim) { return collides(this, node2, node2sim); };

export default Obb2Tree;
