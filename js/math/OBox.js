var OBox = (function(Float32Array, vec2, similar2) {

  var TEMP_TEMP = vec2.array(10);
  var TEMP_VERTICES1 = TEMP_TEMP.subarray(0, 4);
  var TEMP_VERTICES2 = TEMP_TEMP.subarray(4, 8);
  var TEMP_VEC1 = TEMP_TEMP[8];
  var TEMP_VEC2 = TEMP_TEMP[9];
  var max = Math.max;
  var min = Math.min;

  function OBox() {
    var arr = new Float32Array(6);
    this._buffer = arr;
    this.hsize = arr.subarray(0, 2);
    this.placement = arr.subarray(2, 6);
  }



  function vertices(_this, output) {
    var placement = _this.placement;
    var hsize = _this.hsize;
    var hw = hsize[0], hh = hsize[1];
    help(output[0], hw, hh);
    help(output[1], hw,-hh);
    help(output[2],-hw,-hh);
    help(output[3],-hw, hh);
    return _this;

    function help(v, px, py) {
      similar2.transform(vec2.setXY(v, px, py), placement);
    }
  }

  function set(output, other) {
    output._buffer.set(other._buffer, 0);
    return output;
  }

  function transform_(output, what, sim) {
    similar2.transform_(output.placement, what.placement, sim);
    vec2.set(output.hsize, what.hsize);
    return output;
  }

  function transform(what, sim) {
    return transform_(what, what, sim);
  }

  function dotvxy(point, dx, dy) {
    return point[0] * dx + point[1] * dy;
  }


  function wrapAll(_this, list, dir) {
    var min1, max1, min2, max2, i, j, jitem, v1, v2, first = true;

    vec2.set(TEMP_VEC1, dir);
    vec2.right_(TEMP_VEC2, dir);

    for (i = 0; i < list.length; ++i) {
      vertices(list[i], TEMP_VERTICES1);
      for (j = 0; j < TEMP_VERTICES1.length; ++j) {
        jitem = TEMP_VERTICES1[j];
        v1 = vec2.dot(jitem, TEMP_VEC1);
        v2 = vec2.dot(jitem, TEMP_VEC2);
        if (first) {
          min1 = max1 = v1;
          min2 = max2 = v2;
          first = false;
        } else {
          min1 = min(min1, v1);
          max1 = max(max1, v1);
          min2 = min(min2, v2);
          max2 = max(max2, v2);
        }
      }
    }
    var mid1 = 0.5 * (min1 + max1), mid2 = 0.5 * (min2 + max2);
    _this.hsize[0] = 0.5 * (max1 - min1);
    _this.hsize[1] = 0.5 * (max2 - min2);

    _this.placement[0] = TEMP_VEC1[0];
    _this.placement[1] = TEMP_VEC1[1];
    vec2.cmul(vec2.setXY(TEMP_VEC2, mid1, mid2), TEMP_VEC1);
    _this.placement[2] = TEMP_VEC2[0];
    _this.placement[3] = TEMP_VEC2[1];
  }

  function penetrationByDir(points1, points2, dx, dy) {
    var min1, max1, min2, max2, i, curr;
    min1 = max1 = dotvxy(points1[0], dx, dy);
    for (i = 1; i < points1.length; ++i) {
      curr = dotvxy(points1[i], dx, dy);
      min1 = min(min1, curr);
      max1 = max(max1, curr);
    }
    min2 = max2 = dotvxy(points2[0], dx, dy);
    for (i = 1; i < points2.length; ++i) {
      curr = dotvxy(points2[i], dx, dy);
      min2 = min(min2, curr);
      max2 = max(max2, curr);
    }
    return min(max1 - min2, max2 - min1);
  }


  function min4(a, b, c, d) {
    return min(min(a, b), min(c, d));
  }
  function penetration(a, b) {
    vertices(a, TEMP_VERTICES1);
    vertices(b, TEMP_VERTICES2);
    var ap = a.placement, bp = b.placement;
    var ax = ap[0], ay = ap[1], bx = bp[0], by = bp[1];
    return min4(
      penetrationByDir(TEMP_VERTICES1, TEMP_VERTICES2,  ax, ay),
      penetrationByDir(TEMP_VERTICES1, TEMP_VERTICES2, -ay, ax),
      penetrationByDir(TEMP_VERTICES1, TEMP_VERTICES2,  bx, by),
      penetrationByDir(TEMP_VERTICES1, TEMP_VERTICES2, -by, bx)
    );
  }
  function collide(a, b) {
    return penetration(a, b) >= 0;
  }

  OBox.penetration = penetration;
  OBox.collide = collide;
  OBox.transform_ = transform_;
  OBox.transform = transform;
  OBox.set = set;
  OBox.vertices = vertices;
  OBox.wrapAll = wrapAll;

  return OBox;

})(Float32Array, vec2, similar2);