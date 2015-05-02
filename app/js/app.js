(function() {
  "use strict";

  var NBox = require('math.NBox');
  var SelectedAlgorithm = require('planning.RrtInc');
  var totalTime = 0;
  var view, viewport;
  var config = Configuration.create(), config2 = Configuration.create();
  var experiment, solver, solution;


  function setupModel() {
    viewport = document.getElementById('viewport');
    experiment = new ParkingExperiment();
    view = new View(experiment.model, viewport);
  }


  function restart() {
    totalTime = 0;
    experiment.model.reset();
  }


  function last(a, def) {
    return (a && a.length > 0) ? a[a.length - 1] : def;
  }


  var solT = 0, solSpeed = 0.05;
  function cycle() {

    if (!solution) {
      for (var i = 0; i < 100; i++) {
        solver.iterate();
      }
      if (solver.hasSolution) {
        solution = solver.getSolution();
        console.log('solved');
        console.log(solution);
      }
      Configuration.set(config, solver.trial);
      console.log(solver.samplesSaved);
    } else {
      if (solT >= solution.path.length + 5) {
        solT = 0;
      } else {
        var idx = Math.floor(solT);
        if (idx + 1 >= solution.path.length) {
          Configuration.set(config, last(solution.path));
        } else {
          Configuration.set(config, solution.path[idx]);
          Configuration.set(config2, solution.path[idx + 1]);
          Configuration.lerp(config, config, config2, solT - idx);
        }
        solT += solSpeed;
      }
    }

    Configuration.load(config, experiment.model);
    view.setHighlighted(experiment.model.isValid());
    view.update();
  }

  function CurvedPianoExperiment() {
    var _this = this;
    _this.sampler = sampler;
    _this.start =  [-2.6, -2.0, 1, 0];
    _this.target = [ 2.6, -2.0, 1, 0];
    _this.resolution = 0.3;
    _this.nbox = new NBox([-60, -40, -1.1, -1.1], [60, 40, 1.1, 1.1]);
    _this.configuration = Configuration;
    _this.model = new Model(CurvedWorld);
    _this.samplesTook = 0;

    function sampler(dot) {
      var model = _this.model;
      ++_this.samplesTook;
      Configuration.load(dot, model);
      return model.isValid();
    }
  }
  function ParkingExperiment() {
    var _this = this;
    _this.sampler = sampler;
    _this.start =  [ 0.2, -2.4, 1, 0, 0, 0];
    _this.target = [ 1.0, -0.4, 1, 0, 0, 0];
    _this.resolution = 0.50;
    _this.nbox = new NBox(
      [-60, -40, -1.1, -1.1, -10, -10],
      [60, 40, 1.1, 1.1, 10, 10]
    );
    _this.configuration = ParkingConfig;
    _this.model = new Model(ParkingWorld);
    _this.samplesTook = 0;

    function sampler(dot) {
      var model = _this.model;
      ++_this.samplesTook;
      ParkingConfig.load(dot, model);
      return model.isValid();
    }
  }

  function startUp() {
    setupModel();
    scheduleCycle();


    solver = new SelectedAlgorithm(experiment);
  }


  function cycleIteration() {
    scheduleCycle();
    cycle();
  }
  function scheduleCycle() {
    self.requestAnimationFrame(cycleIteration);
  }

  startUp();

  self.restart = restart;
})();