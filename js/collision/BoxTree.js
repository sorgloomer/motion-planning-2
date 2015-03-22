var BoxTree = (function(Math, OBox, vec2, similar2) {

  var TEMP_OBOX = new OBox();

  function BoxTree() {
    this.box = new OBox();
    this.area = 0;
    this.children = null;
  }

  BoxTree.prototype.isLeaf = function _BoxTree_isLeaf() {
    return !this.children || this.children.length === 0;
  };
  BoxTree.prototype.process = function _BoxTree_process() {
    var box = this.box;
    var hsize = box.hsize;
    this.area = 4 * hsize[0] * hsize[1] * similar2.det(box.placement);
  };


  function collidesShallow(node1, node2, node2sim) {
    OBox.transform_(TEMP_OBOX, node2.box, node2sim);
    return OBox.collide(node1.box, TEMP_OBOX);
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
  function wrap(list, orientation) {
    var result = new BoxTree();
    result.children = copyArr(list);
    OBox.wrapAll(result.box, list.map(boxOf), orientation);
    result.process();
    return result;
  }

  BoxTree.collides = collides;
  BoxTree.wrap = wrap;
  BoxTree.prototype.collides = function(node2, node2sim) { return collides(this, node2, node2sim); };

  return BoxTree;
})(Math, OBox, vec2, similar2);
