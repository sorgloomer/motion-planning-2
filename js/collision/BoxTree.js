var BoxTree = (function(Math, OBox, vec2, similar2) {

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



  function listVertices(output, node) {
    vec2.setXY(output[0], node.xmin, node.ymin);
    vec2.setXY(output[1], node.xmin, node.ymax);
    vec2.setXY(output[2], node.xmax, node.ymin);
    vec2.setXY(output[3], node.xmax, node.ymax);
    return output;
  }

  var TEMP_OBOX = new OBox();
  var TEMP_TEMP = vec2.array(6);
  var TEMP_VERTICES = TEMP_TEMP.subarray(0, 4);
  var TEMP_VEC = TEMP_TEMP[4];
  var TEMP_VEC2 = TEMP_TEMP[5];
  var max = Math.max;
  var min = Math.min;



  function testOverlapBy(points1, points2, dx, dy) {
    var min1, max1, min2, max2, curr, i;
    min1 = max1 = dotvxy(points1[0], dx, dy);
    for (i = 1; i < points1.length; i++) {
      curr = dotvxy(points1[i], dx, dy);
      min1 = min(min1, curr);
      max1 = max(max1, curr);
    }
    min2 = max2 = dotvxy(points2[0], dx, dy);
    for (i = 1; i < points2.length; i++) {
      curr = dotvxy(points2[i], dx, dy);
      min2 = min(min2, curr);
      max2 = max(max2, curr);
    }
    return max1 >= min2 && min1 <= max2;
  }

  function collidesShallow(node1, node2, node2sim) {
    OBox.transform(TEMP_OBOX, node2.box, node2sim);
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
