import loaded from '/utils/loaded';
import query from '/utils/query';
import { default_dict } from '/utils/dicts';

import VisualModel from '/visual/VisualModel3D';
import BabylonVisual from '/visual/BabylonVisual';

import RrtVoronoi from '/planning/algorithm/RrtVoronoi';
import RrtInc from '/planning/algorithm/RrtInc';
import Prm from '/planning/algorithm/Prm';

import Drone1 from '/experiment/drone/DronePiano';
import Drone2 from '/experiment/drone/DronePhysics';

const EXPERIMENTS = default_dict(Drone1, {
  drone1: Drone1,
  drone2: Drone2
});
const ALGORITHMS = default_dict(RrtVoronoi, {
  prm: Prm,
  rrtVoronoi: RrtVoronoi,
  rrtInc: RrtInc
});

loaded(() => {
  const queryMap = query.get_params();

  const canvas = document.getElementById("render-canvas");
  const Experiment = EXPERIMENTS.get(queryMap.get('exp'));
  const Algorithm = ALGORITHMS.get(queryMap.get('alg'));
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

