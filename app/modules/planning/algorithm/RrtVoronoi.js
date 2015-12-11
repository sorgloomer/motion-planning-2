import Config from '/entry/Config';
import VecN from '/math/VecN';
import NBox from '/math/NBox';
import NBoxTree from '/math/NBoxTree';
import Helper from '/planning/utils/Helper';
import ConfigCost from '/planning/utils/ConfigCost';


class SampleItem {
  constructor(parent, config, cost) {
    this.parent = parent;
    this.pos = config;
    this.cost = cost;
  }
}

function clamp(val, mn, mx) {
  return Math.max(Math.min(val, mx), mn);
}


export default class RrtVoronoi {
  constructor(map) {

    this.myMap = map;
    this.boxTree = new NBoxTree(map.sampleBounds.fatten(2));
    this.greediness = 0.05;
    this.solutionNode = null;
    this.itemMap = new Map();
    this.samples = [];
    this.targetDistance2 = map.targetDistance * map.targetDistance;

    this.Configuration = map.Configuration;
    this.ConfigurationInput = map.ConfigurationInput;

    this.TEMP_INPUT = this.ConfigurationInput.create();
    this.TEMP_INPUT2 = this.ConfigurationInput.create();
    this.TEMP_CONFIG = this.Configuration.create();
    this.TEMP_CONFIG2 = this.Configuration.create();
    this.TEMP_CONFIG3 = this.Configuration.create();
    this.NEARING_TRIALS = 3;

    this.samplesGenerated = 0;
    this.continueForever = false;
    this.samplesSaved = 0;
    this.wrongSampleCallback = null;
    this.hasSolution = false;
    this.conf_trial = this.Configuration.create();
    this.conf_near = this.Configuration.create();
    this.conf_gen = this.Configuration.create();
    this.trialDist = 1e50;

    this.lineChecker = new Helper.LineChecker(this.Configuration.create());

    this.putConfig(map.start, null, 0);
  }

  putConfig(config, parent_dot, cost) {
    const Configuration = this.Configuration;
    config = Configuration.copy(config);
    this.boxTree.putDot(config);
    var len2 = Configuration.dist2(this.myMap.target, config);
    if (len2 < this.targetDistance2) {
      this.solutionNode = config;
      this.hasSolution = true;
    }
    var parent = this.itemMap.get(parent_dot) || null;
    var sampleitem = new SampleItem(parent, config, (parent ? parent.cost : 0) + cost);
    this.itemMap.set(config, sampleitem);
    this.samples.push(sampleitem);
  }


  putRandomDot() {
    const myMap = this.myMap;
    const Configuration = this.Configuration;
    const ConfigurationInput = this.ConfigurationInput;

    var temp, i, saved_dist, current_dist, saved_cost = 0;
    var config_random_target = this.TEMP_CONFIG;
    var config_saved = this.TEMP_CONFIG2;
    var config_current = this.TEMP_CONFIG3;
    var input_saved = this.TEMP_INPUT;
    var input_current = this.TEMP_INPUT2;

    var isGreedyIteration = Math.random() < this.greediness;
    if (isGreedyIteration) {
      Configuration.copyTo(config_random_target, myMap.target);
    } else {
      Configuration.randomize(config_random_target, myMap.sampleBounds);
      this.samplesGenerated++;
    }
    var nearest = this.boxTree.nearest(config_random_target);

    Configuration.copyTo(this.conf_gen, config_random_target);
    //Configuration.copyTo(this.conf_near, boxTree.nearest(map.target));
    Configuration.copyTo(this.conf_near, nearest);

    var goodSample = false;

    if (Config.DEBUG_GREEDY && isGreedyIteration) {
      Configuration.copyTo(config_saved, nearest);
      var prev_best_dist = Configuration.dist(config_saved, config_random_target);
      console.log('greedy: ' + prev_best_dist + ' ' + this.boxTree.check());
    }


    ConfigurationInput.randomize(input_saved);
    ConfigurationInput.applyTo(config_saved, nearest, input_saved);
    saved_dist = Configuration.dist(config_saved, config_random_target);
    saved_cost = ConfigurationInput.costOf(input_saved);

    for (i = 0; i < this.NEARING_TRIALS; i++) {
      ConfigurationInput.randomize(input_current);
      ConfigurationInput.applyTo(config_current, nearest, input_current);
      current_dist = Configuration.dist(config_current, config_random_target);
      if (current_dist < saved_dist) {
        saved_cost = ConfigurationInput.costOf(input_current);
        saved_dist = current_dist;


        VecN.copyTo(config_saved, config_current);
        VecN.copyTo(input_saved, input_current);
      }
    }

    Configuration.copyTo(this.conf_trial, config_saved);

    var nextNearest = this.boxTree.nearest(config_saved);
    var nextDist = Configuration.dist(nextNearest, config_saved);


    var store_res = clamp(saved_dist * myMap.storeResolutionGradient, myMap.storeResolutionMin, myMap.storeResolutionMax);
    if (nextDist > store_res) {
      var hitsWall = this.lineChecker.check(myMap.sampler, nearest, config_saved, myMap.checkResolution, undefined, Configuration.lerpTo);
      if (!hitsWall) {
        goodSample = true;
        this.putConfig(config_saved, nearest, saved_cost);
        this.samplesSaved++;
      }
    }


    if (!goodSample && this.wrongSampleCallback) {
      this.wrongSampleCallback(Configuration.copy(config_saved));
    }
  }

  iterate(trialCount) {
    Helper.iterate(this, () => this.putRandomDot(), trialCount);
  }

  getSolution() {
    return Helper.pathToRoot(
      {get: item => item.parent},
      this.itemMap.get(this.solutionNode),
        item => item.cost,
        item => new ConfigCost(item.pos, item.cost));
  }
}
