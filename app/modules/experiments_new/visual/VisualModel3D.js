import Config from '/entry/Config';
import Sim3 from '/math/Sim3';
import lists from '/utils/lists';

function _solutionLerpTo(toSim, experiment, tempConf, solution, time) {
  const integ = Math.floor(time);
  const frac = time - integ;
  const index = integ % (solution.path.length - 1);
  experiment.Configuration.lerpTo(tempConf, solution.path[index], solution.path[index + 1], frac);
  experiment.Configuration.to_sim3(toSim, tempConf);
  return toSim;
}

export default class VisualModel3D {
  constructor(experiment, solver) {
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
      this._iterate();
      if (this.solver.hasSolution) {
        this._processSolution(this.solver.getSolution());
      } else {
        if (this.solver.conf_trial) {
          this.experiment.Configuration.to_sim3(this.agent_transform, this.solver.conf_trial);
        }
      }
    }
  }

  _processSolution(solution) {
    this.solution = solution;

    const COUNT = this.solution_keyframe_count;
    const FULL_TIME = solution.path.length - 1.0001;

    this.solution_keyframes = lists.generate(
      COUNT, i => _solutionLerpTo(
        Sim3.create(), this.experiment, this.temp_configuration,
        solution, i * FULL_TIME / (COUNT - 1)
      )
    );
    this.has_solution = true;
    this.solution_length = solution.path.length - 1;
  }

  solutionLerpTo(toSim, time) {
    return _solutionLerpTo(
      toSim, this.experiment, this.temp_configuration,
      this.solution, time
    );
  }
};