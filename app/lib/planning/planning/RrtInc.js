define('planning.RrtInc', [
  'utils.utils',
  'math.vec', 'math.NBoxTree', 'math.NBox',
  'planning.helper'
], function(
  utils,
  vec, NBoxTree, NBox,
  helper
) {


  var itemCmp = utils.byCmp("score");

  function RrtInc(map) {
    var self = this;
    var samples = this.samples = [];
    var edges = this.edges = [];
    this.map = map;

    var quad = new NBoxTree(map.nbox);
    var trialCount = 0;
    var target = map.target;

    var resolution = map.resolution;
    var resolution2 = resolution * resolution * 0.95;

    var localSampler = map.sampler;

    var solutionSample = null;
    var TEMP = map.start.slice(0);

    putNewItemByPos(map.start, null);


    function putNewItemByPos(dot, parent) {
      var item = { pos: dot, fails: 0, parent: parent };
      if (putDotInTree(dot)) {
        samples.push(item);
        if (parent) {
          edges.push([parent, item]);
        }
      }
      return item;
    }

    function hasNear(p) {
      var result = false;
      function visit(dot) {
        if (vec.dist2(dot, p) < resolution2) {
          result = true;
        }
      }
      quad.traverse(function(node) {
        if (result || node.nbox.dist2(p) > resolution2) {
          return true;
        } else {
          var dots = node.dots;
          if (dots) {
            dots.forEach(visit);
          }
        }
      });
      return result;
    }


    function len2(a) {
      var s = 0;
      for (var i = 0; i < a.length; i++) s += a[i] * a[i];
      return s;
    }
    function len(a) {
      return Math.sqrt(len2(a));
    }
    function scale(v, s) {
      for (var i = 0; i < v.length; i++) v[i] *= s;
    }
    function fmod(a, b) {
      return a - Math.floor(a / b) * b;
    }
    function verifyDot(item, temp, edot) {
      scale(temp, resolution/len(temp));
      self.samplesGenerated++;

      var p = item.pos;
      for (var i = 0; i < edot.length; i++) {
        edot[i] = p[i] + temp[i];
      }
      edot[2] = fmod(edot[2], Math.PI * 2);

      return !hasNear(edot)
        && !helper.checkLine(localSampler, p, edot, resolution * 1.01, resolution);
    }

    function putRandomDot() {
      for (var i = 0; i < TEMP.length; i++) TEMP[i] = Math.random() * 2 - 1;
      var idx = Math.random();
      idx *= idx;
      idx *= idx;
      idx = (idx * (samples.length - 0.0001)) | 0;
      var item = samples[idx];
      trialCount++;

      var dot = new Array(TEMP.length);
      if (verifyDot(item, TEMP, dot)) {
        var newItem = putNewItemByPos(dot, item);
        if (vec.dist2(dot, target) < resolution2) {
          self.hasSolution = true;
          solutionSample = newItem;
        }
      } else {
        if (self.wrongSampleCallback) {
          self.wrongSampleCallback(dot);
        }
        item.fails++;
      }
    }

    function itemScore(a) {
      return a.fails + vec.dist(a.pos, target) * 0.02;
    }


    function putDotInTree(dot) {
      return quad.putDot(dot, 0);
    }

    function iterate(sampleCnt) {
      samples.forEach(function(item) {
        item.score = itemScore(item);
      });
      samples.sort(itemCmp);
      helper.iterate(self, putRandomDot, sampleCnt);
    }

    function getSolution() {
      function parent(item) {
        return item.parent;
      }
      function cost(a, b) {
        return vec.dist(a.pos, b.pos);
      }
      function mapToPos(item) {
        return item.pos;
      }
      return helper.pathToRoot(parent, solutionSample, cost, mapToPos);
    }

    this.samplesGenerated = 0;
    this.continueForever = false;
    this.hasSolution = false;
    this.wrongSampleCallback = null;
    this.iterate = iterate;
    this.getSolution = getSolution;
  }

  return RrtInc;
});