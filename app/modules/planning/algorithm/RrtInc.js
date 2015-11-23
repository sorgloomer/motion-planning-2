import NBox from '/math/NBox';
import NBoxTree from '/math/NBoxTree';
import Helper from '/planning/utils/Helper';
import { comparerByField } from '/utils/order';

var itemCmp = comparerByField("score");

function RrtInc(map) {
  var _this = this;
  var samples = this.samples = [];
  var edges = this.edges = [];
  this.map = map;

  var quad = new NBoxTree(map.sampleBounds);
  var trialCount = 0;
  var target = map.target;
  var Configuration = map.Configuration;
  var ConfigurationInput = map.ConfigurationInput;

  var storeResolution = map.storeResolution;
  var checkResolution = map.checkResolution;
  var storeResolution2 = storeResolution * storeResolution;
  var solutionDistance2 = map.targetDistance * map.targetDistance; // magic constant

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
      if (Configuration.dist2(dot, p) < storeResolution2) {
        result = true;
      }
    }
    quad.traverse(function(node) {
      if (result || node.nbox.dist2(p) > storeResolution2) {
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


  const lineChecker = new Helper.LineChecker(Configuration.create());
  function verifyDot(item, edot) {
    var p = item.pos;
    return !hasNear(edot)
      && !lineChecker.check(localSampler, p, edot, checkResolution, undefined, Configuration.lerpTo);
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
    var dot = Configuration.copyTo(TEMP, item.pos);
    ConfigurationInput.applyIP(dot, TEMP_INPUT);
    Configuration.copyTo(_this.conf_trial, dot);
    if (verifyDot(item, dot)) {
      var newItem = putNewItemByPos(dot, item);
      _this.samplesSaved++;
      if (Configuration.dist2(dot, target) < solutionDistance2) {
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
    return a.fails + Configuration.dist(a.pos, target) * 0.02;
  }


  function putDotInTree(dot) {
    return quad.tryPutDot(dot, 0);
  }

  function iterate(sampleCnt) {
    if (Math.random() < 0.002) {
      for (let i = 0; i < samples.length; i++) {
        let item = samples[i];
        item.score = itemScore(item);
      }
      samples.sort(itemCmp);
    }
    Helper.iterate(_this, putRandomDot, sampleCnt);
  }

  function getSolution() {
    function parent(item) {
      return item.parent;
    }
    function cost(a, b) {
      return Configuration.dist(a.pos, b.pos);
    }
    function mapToPos(item) {
      return item.pos;
    }
    return Helper.pathToRoot(parent, solutionSample, cost, mapToPos);
  }

  this.conf_trial = Configuration.create();
  this.samplesGenerated = 0;
  this.samplesSaved = 0;
  this.continueForever = false;
  this.hasSolution = false;
  this.wrongSampleCallback = null;
  this.iterate = iterate;
  this.getSolution = getSolution;
}

export default RrtInc;
