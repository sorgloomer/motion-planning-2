import query from '/utils/query';
import loaded from '/utils/loaded';
import { default_dict } from '/utils/dicts';

import { ALGORITHMS } from '/entry/Common';

import VisualModel from '/experiments_new/visual/VisualModel3D';
import BabylonVisual from '/experiments_new/visual/BabylonVisual';

import Drone1 from '/experiments_new/experiment/drone/DronePiano';
import Drone2 from '/experiments_new/experiment/drone/DronePhysics';

const EXPERIMENTS = default_dict(Drone1, {
  drone1: Drone1,
  drone2: Drone2
});

function main() {
  const params = query.get_params();

  loaded(() => {
    const canvas = document.getElementById("render-canvas");
    const Experiment = EXPERIMENTS.get(params.get('exp'));
    const Algorithm = ALGORITHMS.get(params.get('alg'));
    const experiment = new Experiment();
    const solver = new Algorithm(experiment);

    const visual = new BabylonVisual(canvas, experiment);
    const model = new VisualModel(experiment, solver);

    visual.init(Date.now());
    visual.run(() => {
      model.update();
      visual.render(model, Date.now());
    });
  });
}

export default { main };