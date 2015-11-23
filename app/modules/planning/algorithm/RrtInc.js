import Heap from '/algorithm/Heap';
import NBox from '/math/NBox';
import NBoxTree from '/math/NBoxTree';
import Helper from '/planning/utils/Helper';
import { comparerByField } from '/utils/order';

var itemCmp = comparerByField("score");

function SampleItem(pos, parent) {
  this.pos = pos;
  this.fails = 0;
  this.parent = parent;
  this.score = 0;
  this.fails = 0;
  this.path_length = parent ? parent.path_length + 1 : 0;
  this.init_score = 0;
}

function choose_random(items) {
  const index = Math.floor((items.length - 0.0001) * Math.random());
  return items[index];
}

function RrtInc(map) {
  var _this = this;
  var samples = this.samples = [];
  var edges = this.edges = [];

  const sampleHeap = new Heap();
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

  function setItemInitialScore(item) {
    item.init_score =
      Math.pow(Configuration.dist(item.pos, target), 1.2) * 2
      + Math.pow(item.path_length, 1.1) * 0.05;
    item.score = item.init_score * 5;
  }


  function putNewItemByPos(dot, parent) {
    dot = Configuration.copy(dot);
    var item = new SampleItem(dot, parent);
    if (putDotInTree(dot)) {

      setItemInitialScore(item);
      samples.push(item);
      putItemToHeap(item);
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
      if (result || node.sampleBounds.dist2(p) > storeResolution2) {
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

  function chooseByScore() {
    return sampleHeap.popValue();
  }

  function putItemToHeap(item) {
    sampleHeap.push(item.score, item);
  }

  function processRandomItem(item) {
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
      item.score += item.init_score * 0.5;
    } else {
      if (_this.wrongSampleCallback) {
        _this.wrongSampleCallback(dot);
      }
      item.fails++;
      item.score += item.fails * item.init_score;
    }
  }

  function putRandomDot() {
    trialCount++;
    if (Math.random() < 0.5) {
      var item = chooseByScore();
      processRandomItem(item);
      putItemToHeap(item);
    } else {
      processRandomItem(choose_random(samples));
    }

  }

  function putDotInTree(dot) {
    return quad.tryPutDot(dot, 0);
  }

  function iterate(sampleCnt) {
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
