
define('math.NBoxTree', [ 'math.vec' ], function(vec) {
  function Node(nbox) {
    this.sampleBounds = nbox;
    this.ch = null;
    this.dots = [];
  }

  function NBoxTree(nbox) {
    this.root = new Node(nbox);
    this.maxcnt = 3;
    this.count = 0;
    this._measurement = 0;
    this._measurementBox = 0;
  }

  NBoxTree.Node = Node;

  var NodeProto = Node.prototype;
  var NBoxTreeProto = NBoxTree.prototype;

  NodeProto.isLeaf = function () {
    return !this.ch;
  };
  function newNode(nbox) {
    return new Node(nbox);
  }

  function putChild(dot, ch, depth, maxcnt) {
    return ch.some(function (c) {
      return c.putDot(dot, depth, maxcnt);
    });
  }

  NodeProto.putDot = function (dot, depth, maxcnt) {
    var ch = this.ch;
    if (this.sampleBounds.contains(dot)) {
      if (!ch && this.dots.length > maxcnt) {
        ch = this.split(depth + 1);
      }
      if (ch) {
        return putChild(dot, ch, depth + 1, maxcnt);
      } else {
        this.dots.push(dot);
      }
      return true;
    } else {
      return false;
    }
  };

  NodeProto.split = function (depth) {
    var ch = this.ch = this.sampleBounds.split2().map(newNode);
    this.dots.forEach(function (dot) {
      putChild(dot, ch, depth);
    });
    this.dots = null;
    return ch;
  };


  NBoxTreeProto.traverse = function (fn, ctx) {
    var depth = 0;

    function bound(node) {
      if (!fn.call(ctx, node, depth)) {
        var ch = node.ch;
        if (ch) {
          depth++;
          ch.forEach(bound);
          depth--;
        }
      }
    }

    bound(this.root);
  };

  NBoxTreeProto.inspect = function() {
    var maxdepth = 0;
    var dotcount = 0;
    var depth = 0;

    function bound(node) {
      if (maxdepth < depth) maxdepth = depth;
      if (node.dots) dotcount += node.dots.length;

      var ch = node.ch;
      if (ch) {
        depth++;
        ch.forEach(bound);
        depth--;
      }
    }

    bound(this.root);
    console.log(" " + dotcount + "\t-\t" + maxdepth);

  };

  function foreach(arr, fn) {
    for (var i = 0; i < arr.length; i++) {
      fn(arr[i]);
    }
  }

  NBoxTreeProto.nearest = function (dot) {
    var currentBest = null;
    var currentRadius2 = 0;

    var visitCnt = 0, boxCnt = 0;

    function visit(savedDot) {
      visitCnt++;
      var dist2 = vec.dist2(savedDot, dot);
      if (currentBest === null || dist2 < currentRadius2) {
        currentBest = savedDot;
        currentRadius2 = dist2;
      }
    }

    function intrav(node) {
      if (node.sampleBounds.contains(dot)) {
        bound(node);
      }
    }

    function outtrav(node) {
      if ((currentBest === null || node.sampleBounds.dist2(dot) < currentRadius2)
        && !node.sampleBounds.contains(dot)) {
        bound(node);
      }
    }

    function bound(node) {
      boxCnt++;
      var ch = node.ch, dots = node.dots;
      if (ch) {
        foreach(ch, intrav);
        foreach(ch, outtrav);
      }
      if (dots) {
        foreach(dots, visit);
      }
    }

    bound(this.root);
    this._measurement = visitCnt;
    this._measurementBox = boxCnt;
    return currentBest;
  };

  NBoxTreeProto.hasInRange = function (p, dist) {
    var dist2 = dist * dist;
    var result = false;

    function visit(dot) {
      if (!result && vec.dist2(dot, p) <= dist2) {
        result = true;
      }
    }

    function bound(node) {
      if (node.sampleBounds.dist2(p) <= dist2) {
        var ch = node.ch;
        var dots = node.dots;
        if (dots) {
          dots.forEach(visit);
        }
        if (!result && ch) {
          ch.forEach(bound);
        }
      }
    }

    bound(this.root);
    return result;
  };

  NBoxTreeProto.enumerateInRange = function (p, maxDist, fn, ctx) {
    var maxDist2 = maxDist * maxDist;

    function visit(dot) {
      var actualDist2 = vec.dist2(dot, p);
      if (actualDist2 <= maxDist2) {
        fn.call(ctx, dot, actualDist2);
      }
    }

    function bound(node) {
      if (node.sampleBounds.dist2(p) <= maxDist2) {
        var ch = node.ch;
        var dots = node.dots;
        if (dots) {
          dots.forEach(visit);
        }
        if (ch) {
          ch.forEach(bound);
        }
      }
    }

    bound(this.root);
  };

  NBoxTreeProto.putDot = function (dot) {
    this.count++;
    var success = this.root.putDot(dot, 0, this.maxcnt);
    if (!success) throw new Error("NBoxTree.putDot: outside");
    return true;
  };

  return NBoxTree;
});
