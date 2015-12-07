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
import Config from '/entry/Config';

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
  var animationTotal = 0;


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


  function _bin_search(items, selector, value, left, right) {
    for (;;) {
      if (left > right) return right;
      const midi = Math.floor((left + right) / 2);
      const midval = selector(items[midi]);
      if (value >= midval) {
        left = midi + 1;
      } else {
        right = midi - 1;
      }
    }
  }
  function time_bin_search(items, time) {
    return _bin_search(items, x => x.cost, time, 0, items.length - 1);
  }

  function clamp_to_index(i, arr) {
    return Math.max(0, Math.min(i, arr.length - 1));
  }
  function process_animation() {
    var animT = Math.min((Date.now() * 0.002) % (animationTotal + 2), animationTotal);
    var solution_path = solution.path;
    var anim_index = time_bin_search(solution_path, animT);
    var anim_index0 = clamp_to_index(anim_index, solution_path);
    var anim_index1 = clamp_to_index(anim_index + 1, solution_path);
    var p0 = solution_path[anim_index0];
    var p1 = solution_path[anim_index1];

    if (p1.cost > p0.cost) {
      MyConfigSpace.copyTo(config, p0.config);
      MyConfigSpace.copyTo(config2, p1.config);
      MyConfigSpace.lerpTo(config, config, config2, (animT - p0.cost) / (p1.cost - p0.cost));
    } else {
      MyConfigSpace.copyTo(config, p0.config);
    }
  }
  function _timedCycle() {
    var mark = Date.now() + Config.FRAME_TIME;
    do {
      solver.iterate();
    } while(!solver.hasSolution && Date.now() < mark);
  }
  function cycle() {

    if (!solution) {
      _timedCycle();
      if (solver.hasSolution) {
        solution = solver.getSolution();
        animationTotal = last(solution.path).cost;
        console.log('solved');
        console.log(solution);
      }

      viewmodel.pullSolver(solver, MyConfigSpace);

      /*
      console.log(solver.samplesSaved + '\t-\t' + solver.boxTree._measurementBox);
      solver.boxTree.inspect();
      */

    } else {
      process_animation();
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