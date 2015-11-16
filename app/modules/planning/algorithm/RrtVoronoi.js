import VecN from '/math/VecN';
import NBox from '/math/NBox';
import NBoxTree from '/math/NBoxTree';
import Helper from '/planning/utils/Helper';

export default class RrtVoronoi {
  constructor(map) {

    this.myMap = map;
    this.boxTree = new NBoxTree(map.nbox.fatten(2));
    this.greediness = 0.05;
    this.solutionNode = null;
    this.parentMap = new Map();
    this.edges = [];
    this.samples = [];
    this.targetDistance2 = map.targetDistance * map.targetDistance;

    this.resolution = map.resolution;

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

    this.lastPut = null;
    this.lineChecker = Helper.lineChecker(this.Configuration.create());

    this.putConfig(map.start, null);
  }

  putConfig(config, parent) {
    this.lastPut = config = this.Configuration.copy(config);
    this.boxTree.putDot(config);
    var len2 = VecN.dist2(this.myMap.target, config);
    if (len2 < this.targetDistance2) {
      this.solutionNode = config;
      this.hasSolution = true;
    }
    if (parent) {
      this.parentMap.set(config, parent);
      this.edges.push([{ pos: parent }, { pos: config }]);
    }
    this.samples.push({ pos: config, parent: parent });
  }


  putRandomDot() {
    const Configuration = this.Configuration;
    const ConfigurationInput = this.ConfigurationInput;

    var temp, i, saved_dist, current_dist;
    var config_random_target = this.TEMP_CONFIG;
    var config_saved = this.TEMP_CONFIG2;
    var config_current = this.TEMP_CONFIG3;
    var input_saved = this.TEMP_INPUT;
    var input_current = this.TEMP_INPUT2;

    if (Math.random() < this.greediness) {
      VecN.copyTo(config_random_target, this.myMap.target);
    } else {
      Configuration.randomize(config_random_target, this.myMap.nbox);
      this.samplesGenerated++;
    }
    var nearest = this.boxTree.nearest(config_random_target);

    Configuration.copyTo(this.conf_gen, config_random_target);
    //Configuration.copyTo(this.conf_near, boxTree.nearest(map.target));
    Configuration.copyTo(this.conf_near, nearest);

    var goodSample = false;


    ConfigurationInput.randomize(input_saved);
    ConfigurationInput.applyTo(config_saved, nearest, input_saved);
    saved_dist = VecN.dist(config_saved, config_random_target);

    for (i = 0; i < this.NEARING_TRIALS; i++) {
      ConfigurationInput.randomize(input_current);
      ConfigurationInput.applyTo(config_current, nearest, input_current);
      current_dist = VecN.dist(config_current, config_random_target);
      if (current_dist < saved_dist) {
        saved_dist = current_dist;

        temp = config_saved;
        config_saved = config_current;
        config_current = temp;

        temp = input_saved;
        input_saved = input_current;
        input_current = temp;
      }
    }

    Configuration.copyTo(this.conf_trial, config_saved);

    var nextNearest = this.boxTree.nearest(config_saved);
    var nextDist = Configuration.dist(nextNearest, config_saved);

    if (nextDist > this.resolution) {
      var hitsWall = this.lineChecker(this.myMap.sampler, nearest, config_saved, 1, this.resolution, Configuration.lerp);
      if (!hitsWall) {
        goodSample = true;
        this.putConfig(config_saved, nearest);
        this.samplesSaved++;
      }
    }


    if (!goodSample && this.wrongSampleCallback) {
      this.wrongSampleCallback(VecN.copy(config_saved));
    }
  }

  iterate(trialCount) {
    Helper.iterate(this, () => this.putRandomDot(), trialCount);
  }

  getSolution() {
    return Helper.pathToRoot(this.parentMap, this.solutionNode, VecN.dist);
  }
}
