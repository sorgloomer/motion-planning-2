import Config from '/entry/Config';
import Sim3 from '/math/Sim3';
import lists from '/utils/lists';
import AnimationHelper from '/entry/AnimationHelper';
import MeasureHelper from '/utils/MeasureHelper';


function last(arr) {
  return arr[arr.length-1];
}
function _solutionLerpTo(toSim, experiment, tempConf, solution, time) {
  var solution_path = solution.path;
  var animationTotal = last(solution_path).cost;
  AnimationHelper.process_animation_at(tempConf, time % (animationTotal + 1), solution, experiment.Configuration);
  experiment.Configuration.to_sim3(toSim, tempConf);
  return toSim;
}

export default class VisualModel3D {
  constructor(experiment, solver, measuring) {
    this.experiment = experiment;
    this.solver = solver;
    this.agent_transform = Sim3.create();
    this.temp_sim = Sim3.create();
    this.temp_configuration = this.experiment.Configuration.create();
    this._iterations = 5;
    this.iterations_time = Config.FRAME_TIME;

    this.solution = null;
    this.solution_keyframes = null;
    this.solution_keyframe_count = Config.SHOW3D_SOLUTION_KEYFRAME_COUNT;
    this.has_solution = false;
    this.solution_length = 0;



    this.onData = null;
    this.measurer = new MeasureHelper(() => this._measure());
    this.current_measure = this.measurer.start();
    this.measuring = measuring;
    this.shown_measurement = {
      time: 0,
      samples: 0,
      storage: 0
    };
  }

  restart() {
    this.solution = null;
    this.solution_length = 0;
    this.solution_keyframes = null;
    this.has_solution = false;
    this.current_measure = this.measurer.start();
    this.experiment.sampler.restart();
  }

  _measure() {
    return {
      samples: this.experiment.sampler.getSampleCount(),
      storage: this.solver.samples.length,
      cost: this.solution ? this.solution.cost : 0
    };
  }

  _iterate() {
    const mark = Date.now() + this.iterations_time;
    while (!this.solver.hasSolution) {
      this.solver.iterate(this._iterations);
      if (Date.now() >= mark) break;
    }
  }
  update() {
    if (!this.has_solution) {

      if (this.current_measure.timespan() > Config.MEASURE_SOLVING_TIMEOUT) {
        this._emit(this.current_measure.endTimeout());
        this.restart();
      } else {
        this._iterate();
        this.current_measure.inspectTo(this.shown_measurement);
        if (this.solver.hasSolution) {
          this._processSolution(this.solver.getSolution());
        } else {
          if (this.solver.conf_trial) {
            this.experiment.Configuration.to_sim3(this.agent_transform, this.solver.conf_trial);
          }
        }
      }
    }
  }

  _emit(data) {
    if (this.onData) this.onData(data);
  }

  _processSolution(solution) {
    this.solution = solution;

    if (this.measuring) {
      this._emit(this.current_measure.end());
      this.restart();
    } else {
      const COUNT = this.solution_keyframe_count;
      const FULL_TIME = solution.path[solution.path.length - 1].cost;

      this.solution_keyframes = lists.generate(
        COUNT, i => _solutionLerpTo(
          Sim3.create(), this.experiment, this.temp_configuration,
          solution, i * FULL_TIME / (COUNT - 1)
        )
      );
      this.has_solution = true;
      this.solution_length = solution.path.length - 1;
    }
  }

  solutionLerpTo(toSim, time) {
    return _solutionLerpTo(
      toSim, this.experiment, this.temp_configuration,
      this.solution, time
    );
  }
};