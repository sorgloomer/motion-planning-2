(function(utils, WORLD, Configuration) {
  "use strict";

  var NBox = require('math.NBox');
  var SelectedAlgorithm = require('planning.RrtInc');
  var totalTime = 0;
  var model, view, viewport;
  var config = Configuration.create(), config2 = Configuration.create();
  var samplesTook = 0, solver, solution;


  function setupModel() {
    viewport = document.getElementById('viewport');
    model = new Model(WORLD);
    view = new View(model, viewport);
  }


  function restart() {
    totalTime = 0;
    model.reset();
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
      transformConfig(config, last(solver.samples).pos);
    } else {
      var idx = Math.floor(solT);
      if (idx + 1 >= solution.path.length) {
        solT = 0;
        transformConfig(config, last(solution.path));
      } else {
        transformConfig(config, solution.path[ idx ]);
        transformConfig(config2, solution.path[ idx + 1 ]);
        Configuration.lerp(config, config, config2, solT - idx);
        solT += solSpeed;
      }
    }

    Configuration.load(config, model);
    view.setHighlighted(model.isValid());
    view.update();
  }

  function transformConfig(config, dot) {
    config[0] = dot[0] * 10;
    config[1] = dot[1] * 10;
    config[2] = dot[2];
  }
  function startUp() {
    setupModel();
    Configuration.start(config, model.definition);
    scheduleCycle();

    function sampler(dot) {
      ++samplesTook;
      transformConfig(config, dot);
      Configuration.load(config, model);
      return model.isValid();
    }

    solver = new SelectedAlgorithm({
      sampler: sampler,
      start: [-2.6, -2, 0],
      target: [2.6, -2, 0],
      resolution: 0.3,
      nbox: new NBox([-60, -40, 0], [60, 40, 2 * Math.PI])
    });
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
})(utils, WORLD, Configuration);