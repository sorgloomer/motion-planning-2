var BoxTreeBuilder = (function(Math, vec2, similar2, BoxTree) {

  var DIRARR = halfcircle(8);

  function halfcircle(slices) {
    var flts = new Float32Array(2 * slices);

    var res = [], a, i, j;
    for (i = 0, j = 0; i < slices; ++i, j += 2) {
      a = i * Math.PI / slices;
      flts[j] = Math.cos(a);
      flts[j + 1] = Math.sin(a);
      res.push(flts.subarray(j, j + 2));
    }
    return res;
  }

  function maxBy(list, by) {
    if (list && list.length > 0) {
      var val = by(list[0]), item = list[0];
      for (var i = 1; i < list.length; i++) {
        var currItem = list[i];
        var currVal = by(currItem);
        if (currVal > val) {
          val = currVal;
          item = currItem;
        }
      }
      return item;
    }
  }

  function nonEmpty(arr) {
    return arr && arr.length > 0;
  }
  function measure(separated) {
    if (nonEmpty(separated[0]) && nonEmpty(separated[1])) {
      var node1 = BoxTree.wrap(separated[0]);
      var node2 = BoxTree.wrap(separated[1]);
      var score = -OBox.penetration(node1.box, node2.box);
      return {
        score: score,
        node1: node1,
        node2: node2
      };
    }
  }

  function fromList(list, mapper) {
    if (mapper === undefined) mapper = invoke_aabb;

    var allLeaves = list.map(function(item) {
      var res = new BoxTree();
      mapper(res, item);
      res.process();
      return res;
    });


    function recurse(list) {
      if (!nonEmpty(list)) throw new Error('cant build tree from an empty list');
      if (list.length < 2) {
        return list[0];
      } else {

        var best = maxBy(DIRARR.map(function(dir) { return splitByDir(list, dir); }).filter(boolify).map(measure), scoreOf);

        if (best) {
          return BoxTree.wrap([
            recurse(best.node1.children),
            recurse(best.node2.children)
          ]);
        } else {
          return BoxTree.wrap(list);
        }
      }
    }

    return recurse(allLeaves);

    function scoreOf(x) { return x.score; }
    function boolify(x) { return !!x; }
    function invoke_aabb(node, item) { item.aabb(node); }
  }

  function dotSimilarTranslation(simi, dir) {
      return simi[2] * dir[0] + simi[3] * dir[1];
  }

  function compare(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }
  function byValue(a, b) {
    return compare(a.value, b.value);
  }
  function nodeOf(x) {
    return x.node;
  }
  function splitByDir(nodes, dir) {
    nodes = nodes.map(function(node) {
      return {
        value: dotSimilarTranslation(node.box.placement, dir),
        node: node
      };
    });
    nodes.sort(byValue);
    nodes = nodes.map(nodeOf);
    var mid = nodes.length >> 2;
    return [ nodes.slice(0, mid), nodes.slice(mid) ];
  }


  return {
    fromList: fromList
  };

})(Math, vec2, similar2, BoxTree);
