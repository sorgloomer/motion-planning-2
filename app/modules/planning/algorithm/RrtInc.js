import Heap from '/algorithm/Heap';
import NBox from '/math/NBox';
import NBoxTree from '/math/NBoxTree';
import Helper from '/planning/utils/Helper';
import ConfigCost from '/planning/utils/ConfigCost';
import { comparerByField } from '/utils/order';

var itemCmp = comparerByField("score");

function SampleItem(pos, parent) {
  this.pos = pos;
  this.fails = 0;
  this.parent = parent;
  this.cost = 0;
  this.score = 0;
  this.fails = 0;
  this.path_length = parent ? parent.path_length + 1 : 0;
  this.init_score = 0;
}

function choose_random(items) {
  const index = Math.floor((items.length - 0.0001) * Math.random());
  return items[index];
}

function RrtInc(myMap) {
  var _this = this;
  var samples = this.samples = [];
  var edges = this.edges = [];

  const sampleHeap = new Heap();
  this.map = myMap;

  var rejected_by_crowd_count = 0;
  var quad = new NBoxTree(myMap.sampleBounds);
  var trialCount = 0;
  var target = myMap.target;
  var Configuration = myMap.Configuration;
  var ConfigurationInput = myMap.ConfigurationInput;

  var storeResolutionMin = myMap.storeResolutionMin;
  var storeResolutionMax = myMap.storeResolutionMax;
  var storeResolutionGradient = myMap.storeResolutionGradient;

  var checkResolution = myMap.checkResolution;
  var targetDistance = myMap.targetDistance;
  var targetDistance2 = targetDistance * targetDistance;

  var localSampler = myMap.sampler;

  var solutionSample = null;
  var TEMP_INPUT = ConfigurationInput.create();
  var TEMP_CONF = Configuration.create();
  var TEMP_CONF2 = Configuration.create();

  var NEARING_TRIALS = 2;

  putNewItemByPosAndDCost(myMap.start, null, 0);

  function setItemInitialScore(item) {
    item.init_score =
      Math.pow(Configuration.dist(item.pos, target), 1.2) * 2
      + Math.pow(item.path_length, 1.1) * 0.05;
    item.score = item.init_score * 5;
  }


  function putNewItemByPosAndDCost(dot, parent, dcost) {
    dot = Configuration.copy(dot);
    if (putDotInTree(dot)) {
    // if (myMap.sampleBounds.contains(dot)) {
      var item = new SampleItem(dot, parent);
      item.cost = (parent ? parent.cost : 0) + dcost;

      setItemInitialScore(item);
      samples.push(item);
      putItemToHeap(item);
      if (parent) {
        edges.push([parent, item]);
      }
      return item;
    } else {
      return null;
    }
  }

  const lineChecker = new Helper.LineChecker(Configuration.create());
  function verifyDot(item, edot, max_dist) {
    var p = item.pos;
    if (quad.hasInRange(edot, max_dist)) {
      rejected_by_crowd_count++;
      return false;
    } else {
      return !lineChecker.check(localSampler, p, edot, checkResolution, undefined, Configuration.lerpTo);
    }
  }

  function chooseByScore() {
    return sampleHeap.popValue();
  }

  function putItemToHeap(item) {
    sampleHeap.push(item.score, item);
  }

  function clamp(val, mn, mx) {
    return Math.max(Math.min(val, mx), mn);
  }
  function processRandomItem(item) {
    var best_conf = null, best_dist = 0, best_dt = 0;
    var current_conf = null, current_dist = 0;

    for (var i = 0; i < NEARING_TRIALS; i++) {
      ConfigurationInput.randomize(TEMP_INPUT);
      current_conf = Configuration.copyTo(TEMP_CONF, item.pos);
      ConfigurationInput.applyIP(current_conf, TEMP_INPUT);

      current_dist = Configuration.dist(current_conf, target);
      var store_res = clamp(current_dist * storeResolutionGradient, storeResolutionMin, storeResolutionMax);

      if (verifyDot(item, current_conf, store_res)) {
        if (!best_conf || current_dist < best_dist) {
          best_conf = Configuration.copyTo(TEMP_CONF2, current_conf);
          best_dist = current_dist;
          best_dt = ConfigurationInput.costOf(TEMP_INPUT);
        }
      }
    }

    Configuration.copyTo(_this.conf_trial, best_conf || current_conf);
    if (best_conf) {
      var newItem = putNewItemByPosAndDCost(best_conf, item, best_dt);
      _this.samplesSaved++;
      if (newItem && best_dist < targetDistance) {
        _this.hasSolution = true;
        solutionSample = newItem;
      }
      item.score += item.init_score * 0.5;
    } else {
      if (_this.wrongSampleCallback) {
        _this.wrongSampleCallback(current_conf);
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
    return Helper.pathToRoot(
      { get: item => item.parent },
      solutionSample,
      i => i.cost,
      item => new ConfigCost(item.pos, item.cost)
    );
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
