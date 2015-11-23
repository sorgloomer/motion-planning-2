define('planning.RrtVoronoi', [
    'utils.utils',
    'math.vec', 'math.NBoxTree', 'math.NBox',
    'planning.helper'
], function(
    utils,
    vec, NBoxTree, NBox,
    helper
) {

  function RrtVoronoi(map) {
    var _this = this;

    var NEARING_TRIALS = 1;

    var dims = map.sampleBounds.dims();
    var boxTree = new NBoxTree(map.sampleBounds.fatten(2));
    var resolution = map.resolution;
    var targetDistance2 = map.targetDistance * map.targetDistance;
    var greediness = 0.05;

    var Configuration = map.configuration;
    var ConfigurationInput = Configuration.input;


    var solutionNode = null;
    var parentMap = new Map();
    var edges = [];
    var samples = [];

    var TEMP_INPUT = ConfigurationInput.create();
    var TEMP_INPUT2 = ConfigurationInput.create();
    var TEMP_CONFIG = Configuration.create();
    var TEMP_CONFIG2 = Configuration.create();
    var TEMP_CONFIG3 = Configuration.create();

    putConfig(map.start, null);

    function putConfig(config, parent) {
      config = Configuration.copy(config);
      boxTree.putDot(config);
      var len2 = vec.dist2(map.target, config);
      if (len2 < targetDistance2) {
        solutionNode = config;
        _this.hasSolution = true;
      }
      if (parent) {
        parentMap.set(config, parent);
        edges.push([{ pos: parent }, { pos: config }]);
      }
      samples.push({ pos: config, parent: parent });
    }



    function putRandomDot() {

      var temp, i, saved_dist, current_dist;
      var config_random_target = TEMP_CONFIG;
      var config_saved = TEMP_CONFIG2;
      var config_current = TEMP_CONFIG3;
      var input_saved = TEMP_INPUT;
      var input_current = TEMP_INPUT2;

      if (Math.random() < greediness) {
        vec.copyTo(config_random_target, map.target);
      } else {
        Configuration.randomize(config_random_target, map.sampleBounds);
        _this.samplesGenerated++;
      }
      var nearest = boxTree.nearest(config_random_target);

      Configuration.set(_this.conf_gen, config_random_target);
      //Configuration.set(_this.conf_near, boxTree.nearest(map.target));
      Configuration.set(_this.conf_near, nearest);

      var goodSample = false;


      ConfigurationInput.randomize(input_saved);
      Configuration.set(config_saved, nearest);
      ConfigurationInput.apply(config_saved, input_saved);
      saved_dist = vecn.dist(config_saved, config_random_target);

      for (i = 0; i < NEARING_TRIALS; i++) {
        ConfigurationInput.randomize(input_current);
        Configuration.set(config_current, nearest);
        ConfigurationInput.apply(config_current, input_current);
        current_dist = vecn.dist(config_current, config_random_target);
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

      Configuration.set(_this.conf_trial, config_saved);

      var nextNearest = boxTree.nearest(config_saved);
      var nextDist = Configuration.dist(nextNearest, config_saved);


      if (nextDist > resolution) {
        var hitsWall = helper.checkLine(map.sampler, nearest, config_saved, 1, resolution, Configuration.lerp);
        if (!hitsWall) {
          goodSample = true;
          putConfig(config_saved, nearest);
          _this.samplesSaved++;
        }
      }


      if (!goodSample && _this.wrongSampleCallback) {
        _this.wrongSampleCallback(vec.copy(config_saved));
      }
    }

    function iterate(trialCount) {
      helper.iterate(_this, putRandomDot, trialCount);
    }

    function getSolution() {
      return helper.pathToRoot(parentMap, solutionNode, vec.dist);
    }

    this.samplesGenerated = 0;
    this.continueForever = false;
    this.edges = edges;
    this.samples = samples;
    this.samplesSaved = 0;
    this.wrongSampleCallback = null;
    this.iterate = iterate;
    this.hasSolution = false;
    this.getSolution = getSolution;
    this.conf_trial = Configuration.create();
    this.conf_near = Configuration.create();
    this.conf_gen = Configuration.create();
    this.trialDist = 1e50;
    this.boxTree = boxTree;
  }


  return RrtVoronoi;
});