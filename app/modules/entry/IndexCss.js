import query from '/utils/query';

import NBox from '/math/NBox';
import CurvedPianoExperiment from '/experiments_old/experiment/curved_piano/CurvedPianoExperiment';
import ArmExperiment4 from '/experiments_old/experiment/arm/ArmExperiment4';
import ArmExperiment6 from '/experiments_old/experiment/arm/ArmExperiment6';
import ArmExperiment12 from '/experiments_old/experiment/arm/ArmExperiment12';
import ParkingExperiment from '/experiments_old/experiment/parking/ParkingExperiment';
import PhParkingExperiment from '/experiments_old/experiment/parking_physics/PhParkingExperiment';
import { default_dict } from '/utils/dicts';
import { ALGORITHMS } from '/entry/Common';

import CssViewModel from '/experiments_old/visual/CssViewModel';
import CssView from '/experiments_old/visual/CssView';

const EXPERIMENTS = default_dict(CurvedPianoExperiment, {
  curved: CurvedPianoExperiment,
  park: ParkingExperiment,
  park2: PhParkingExperiment,
  arm4: ArmExperiment4,
  arm6: ArmExperiment6,
  arm12: ArmExperiment12
});


function main() {
  const params = query.get_params();

  var SelectedAlgorithm = ALGORITHMS.get(params.get('alg'));
  var Experiment = EXPERIMENTS.get(params.get('exp'));

  var totalTime = 0;
  var view, viewport, viewmodel;

  var MyConfigSpace = null;
  var config = null, config2 = null;
  var experiment, solver, solution;


  function setupModel() {
    viewport = document.getElementById('viewport');
    experiment = new Experiment();
    viewmodel = new CssViewModel(experiment.model, experiment.Configuration);
    view = new CssView(viewmodel, viewport, experiment.sampler.model);

    MyConfigSpace = experiment.Configuration;
    config = MyConfigSpace.create();
    config2 = MyConfigSpace.create();
  }


  function restart() {
    totalTime = 0;
    experiment = new Experiment();
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

      /*
      console.log(solver.samplesSaved + '\t-\t' + solver.boxTree._measurementBox);
      solver.boxTree.inspect();
      */

    } else {
      if (solT >= solution.path.length + 5) {
        solT = 0;
      } else {
        var idx = Math.floor(solT);
        if (idx + 1 >= solution.path.length) {
          MyConfigSpace.copyTo(config, last(solution.path));
        } else {
          MyConfigSpace.copyTo(config, solution.path[idx]);
          MyConfigSpace.copyTo(config2, solution.path[idx + 1]);
          MyConfigSpace.lerpTo(config, config, config2, solT - idx);
        }
        solT += solSpeed;
      }
      viewmodel.pullAnim(solver, config, MyConfigSpace);
    }

    view.setHighlighted(experiment.sampler.model.isValid());
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