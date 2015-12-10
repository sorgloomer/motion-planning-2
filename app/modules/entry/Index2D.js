import query from '/utils/query';

import NBox from '/math/NBox';
import CurvedPianoExperiment from '/experiments_old/experiment/curved_piano/CurvedPianoExperiment';
import ArmExperiment4 from '/experiments_old/experiment/arm/ArmExperiment4';
import ArmExperiment6 from '/experiments_old/experiment/arm/ArmExperiment6';
import ArmExperiment12 from '/experiments_old/experiment/arm/ArmExperiment12';
import ParkingExperiment from '/experiments_old/experiment/parking/ParkingExperiment';
import PhParkingExperiment from '/experiments_old/experiment/parking_physics/PhParkingExperiment';
import { default_dict } from '/utils/dicts';
import MeasureHelper from '/utils/MeasureHelper';
import { ALGORITHMS } from '/entry/Common';
import Config from '/entry/Config';
import DataContainer from '/view/DataContainer';

import CssViewModel from '/experiments_old/visual/CssViewModel';
import CssView from '/experiments_old/visual/CssView';
import AnimationHelper from '/entry/AnimationHelper';

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
  var config = null;
  var experiment, solver, solution;
  var animationTotal = 0;

  var measurer = null;
  var current_measure = null;

  var measure_restart = !!params.get('measure');

  function measureSample() {
    return {
      samples: experiment.sampler.samplesTook,
      storage: solver.samples.length,
      cost: solution ? solution.cost : 0
    };
  }

  function setupMeasure() {
    measurer = new MeasureHelper(measureSample);
    current_measure = measurer.start();
  }



  function setupModel() {
    viewport = document.getElementById('viewport');
    experiment = new Experiment();
    MyConfigSpace = experiment.Configuration;

    setupView();

    config = MyConfigSpace.create();
  }

  function setupView() {
    viewmodel = new CssViewModel(experiment.model, experiment.Configuration);
    view = new CssView(viewmodel, viewport, experiment.sampler.model);
  }
  function teardownView() {
    view.dispose();
  }


  function restart() {
    totalTime = 0;
    solution = null;
    experiment.sampler.restart();
    solver = new SelectedAlgorithm(experiment);
    teardownView();
    setupView();
    startMeasureSafe();
  }


  function last(a, def) {
    return (a && a.length > 0) ? a[a.length - 1] : def;
  }

  function restartLater() {
    setTimeout(restart, 10);
  }


  function _timedCycle() {
    var mark = Date.now() + Config.FRAME_TIME;
    do {
      solver.iterate();
    } while(!solver.hasSolution && Date.now() < mark);
  }

  function onSolution() {
    solution = solver.getSolution();
    animationTotal = last(solution.path).cost;
    console.log('solved');
    console.log(solution);

    update_measure_viewmodel();

    const measurement = current_measure.end();

    DataContainer.appendDataToTable(measurement);
    if (measure_restart) {
      restartLater();
    }
  }

  var shown_measurement = {
    time: 0,
    samples: 0,
    storage: 0
  };

  function update_measure_viewmodel() {
    current_measure.inspectTo(shown_measurement);
  }

  function cycle() {

    var elapsedTimespan = current_measure.timespan();

    update_measure_viewmodel();
    DataContainer.setCurrentData(shown_measurement);

    if (measure_restart && elapsedTimespan > Config.MEASURE_SOLVING_TIMEOUT) {
      const measurement = current_measure.endTimeout();
      DataContainer.appendDataToTable(measurement);
      console.log('timeout');
      current_measure = null;
      restartLater();
    }

    if (!solution) {
      _timedCycle();
      if (solver.hasSolution) {
        onSolution();
      }

      viewmodel.pullSolver(solver, MyConfigSpace);

      /*
      console.log(solver.samplesSaved + '\t-\t' + solver.boxTree._measurementBox);
      solver.boxTree.inspect();
      */

    } else {
      AnimationHelper.process_animation(config, animationTotal, solution, MyConfigSpace);
      viewmodel.pullAnim(solver, config, MyConfigSpace);
    }

    view.setHighlighted(experiment.sampler.model.isValid());
    view.update();
  }

  function startUp() {
    setupModel();
    setupMeasure();
    scheduleCycle();

    solver = new SelectedAlgorithm(experiment);
    startMeasureSafe();
  }


  function cycleIteration() {
    scheduleCycle();
    cycle();
  }
  function scheduleCycle() {
    setTimeout(cycleIteration, 50);
  }

  function startMeasureSafe() {
    current_measure = measurer.start();
  }

  startUp();

  self.restart = restart;
}


export default { main };