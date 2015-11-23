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
    var _this = this;
    var samples = this.samples = [];
    var edges = this.edges = [];
    this.map = map;

    var quad = new NBoxTree(map.sampleBounds);
    var trialCount = 0;
    var target = map.target;
    var Configuration = map.configuration;
    var ConfigurationInput = Configuration.input;

    var resolution = map.resolution;
    var resolution2 = resolution * resolution * 0.90;

    var localSampler = map.sampler;

    var solutionSample = null;
    var TEMP_INPUT = ConfigurationInput.create();
    var TEMP = Configuration.create();

    putNewItemByPos(map.start, null);


    function putNewItemByPos(dot, parent) {
      dot = Configuration.copy(dot);
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
        if (result || node.sampleBounds.dist2(p) > resolution2) {
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


    function verifyDot(item, edot) {
      var p = item.pos;
      return !hasNear(edot)
        && !helper.checkLine(localSampler, p, edot, resolution * 1.01, resolution, Configuration.lerp);
    }

    function chooseDistRnd(arr) {
      var idx = Math.random();
      idx *= idx;
      idx *= idx;
      idx = Math.floor(idx * (arr.length - 0.00001));
      return arr[idx];
    }

    function putRandomDot() {
      var item = chooseDistRnd(samples);
      trialCount++;

      ConfigurationInput.randomize(TEMP_INPUT);
      var dot = Configuration.set(TEMP, item.pos);
      ConfigurationInput.apply(dot, TEMP_INPUT);
      Configuration.set(_this.trial, dot);
      if (verifyDot(item, dot)) {
        var newItem = putNewItemByPos(dot, item);
        _this.samplesSaved++;
        if (vec.dist2(dot, target) < resolution2) {
          _this.hasSolution = true;
          solutionSample = newItem;
        }
      } else {
        if (_this.wrongSampleCallback) {
          _this.wrongSampleCallback(dot);
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
      if (Math.random() < 0.02) {
        samples.sort(itemCmp);
      }
      helper.iterate(_this, putRandomDot, sampleCnt);
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

    this.trial = Configuration.create();
    this.samplesGenerated = 0;
    this.samplesSaved = 0;
    this.continueForever = false;
    this.hasSolution = false;
    this.wrongSampleCallback = null;
    this.iterate = iterate;
    this.getSolution = getSolution;
  }

  return RrtInc;
});