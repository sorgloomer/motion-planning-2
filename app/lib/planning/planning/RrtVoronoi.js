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

    var dims = map.nbox.dims();
    var boxTree = new NBoxTree(map.nbox.fatten(2));
    var resolution = map.resolution;
    var targetDistance2 = map.targetDistance * map.targetDistance;
    var greediness = 0.05;

    var Configuration = map.configuration;
    var ConfigurationInput = Configuration.input;

    var TEMP_CONFIG = vec.alloc(dims);

    var solutionNode = null;
    var parentMap = new Map();
    var edges = [];
    var samples = [];
    var TEMP_INPUT = ConfigurationInput.create();

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
      if (Math.random() < greediness) {
        vec.copyTo(TEMP_CONFIG, map.target);
      } else {
        Configuration.randomize(TEMP_CONFIG, map.nbox);
        _this.samplesGenerated++;
      }
      var nearest = boxTree.nearest(TEMP_CONFIG);

      Configuration.set(_this.conf_gen, TEMP_CONFIG);

      var goodSample = false;



      ConfigurationInput.randomize(TEMP_INPUT);
      Configuration.set(TEMP_CONFIG, nearest);
      ConfigurationInput.apply(TEMP_CONFIG, TEMP_INPUT);

      var nextNearest = boxTree.nearest(TEMP_CONFIG);
      var nextDist = Configuration.dist(nextNearest, TEMP_CONFIG);


      if (nextDist > resolution) {
        var hitsWall = helper.checkLine(map.sampler, nearest, TEMP_CONFIG, 1, resolution, Configuration.lerp);
        if (!hitsWall) {
          goodSample = true;
          Configuration.set(_this.conf_trial, TEMP_CONFIG);
          putConfig(TEMP_CONFIG, nearest);
          _this.samplesSaved++;

        }
      }
      Configuration.set(_this.conf_near, boxTree.nearest(map.target));


      if (!goodSample && _this.wrongSampleCallback) {
        _this.wrongSampleCallback(vec.copy(TEMP_CONFIG));
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