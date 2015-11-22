import loaded from '/utils/loaded';

import VisualModel from '/visual/VisualModel3D';
import BabylonVisual from '/visual/BabylonVisual';

import RrtVoronoi from '/planning/algorithm/RrtVoronoi';
import RrtInc from '/planning/algorithm/RrtInc';
import Prm from '/planning/algorithm/Prm';

import Drone1 from '/experiment/drone/DronePiano';
import Drone2 from '/experiment/drone/DronePhysics';


loaded(() => {
    const canvas = document.getElementById("render-canvas");
    const experiment = new Drone1();
    const solver = new RrtVoronoi(experiment);

    const visual = new BabylonVisual(canvas, experiment);
    const model = new VisualModel(experiment, solver);
    visual.init(Date.now());
    visual.run(() => {
        model.update();
        visual.render(model, Date.now());
    });
});
