(function(utils, WORLD, Configuration) {
  "use strict";

  var totalTime = 0;
  var model, view, viewport;
  var config = Configuration.create();


  function setupModel() {
    viewport = document.getElementById('viewport');
    model = new Model(WORLD);
    view = new View(model, viewport);
  }


  function restart() {
    totalTime = 0;
    model.reset();
  }


  function cycle() {
    config[2] += 0.01;
    config[1] -= 0.03;
    Configuration.load(config, model);
    view.setHighlighted(model.isValid());
    view.update();
  }

  function startUp() {
    setupModel();
    config[1] = 20;
    scheduleCycle();
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