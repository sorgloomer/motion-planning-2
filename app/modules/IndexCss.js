import NBox from '/math/NBox';
import RrtVoronoi from '/planning/algorithm/RrtVoronoi';
import CurvedPianoExperiment from '/experiment/curved_piano/CurvedPianoExperiment';

function main(params) {
  var SelectedAlgorithm = RrtVoronoi;
  var Experiment = CurvedPianoExperiment;

  var totalTime = 0;
  var view, viewport, viewmodel;

  var MyConfigSpace = null;
  var config = null, config2 = null;
  var experiment, solver, solution;


  function setupModel() {
    viewport = document.getElementById('viewport');
    experiment = new Experiment();
    viewmodel = new ViewModel(experiment.model.definition);
    view = new View(viewmodel, viewport);

    MyConfigSpace = experiment.Configuration;
    config = MyConfigSpace.create();
    config2 = MyConfigSpace.create();
  }


  function restart() {
    totalTime = 0;
    experiment.model.reset();
  }


  function last(a, def) {
    return (a && a.length > 0) ? a[a.length - 1] : def;
  }


  var solT = 0, solSpeed = 0.5;
  function cycle() {

    if (!solution) {
      for (var i = 0; i < 50; i++) {
        solver.iterate();
      }
      if (solver.hasSolution) {
        solution = solver.getSolution();
        console.log('solved');
        console.log(solution);
      }

      viewmodel.pullSolver(solver, MyConfigSpace);
      console.log(solver.samplesSaved + '\t-\t' + solver.boxTree._measurementBox);
      solver.boxTree.inspect();
    } else {
      if (solT >= solution.path.length + 5) {
        solT = 0;
      } else {
        var idx = Math.floor(solT);
        if (idx + 1 >= solution.path.length) {
          MyConfigSpace.set(config, last(solution.path));
        } else {
          MyConfigSpace.set(config, solution.path[idx]);
          MyConfigSpace.set(config2, solution.path[idx + 1]);
          MyConfigSpace.lerp(config, config, config2, solT - idx);
        }
        solT += solSpeed;
      }
      viewmodel.pullAnim(solver, config, MyConfigSpace);
    }

    view.setHighlighted(experiment.model.isValid());
    view.update();
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
    setTimeout(cycleIteration, 50);
  }

  startUp();

  self.restart = restart;
}


export default { main };