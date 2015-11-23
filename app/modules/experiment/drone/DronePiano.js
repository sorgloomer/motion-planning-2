import DroneBoxes from '/experiment/drone/DroneBoxes';
import Sampler3D from '/experiment/piano3d/Sampler3D';
import Configuration from '/experiment/piano3d/Piano3DConfig';
import ConfigurationInput from '/experiment/piano3d/Piano3DInput';
import DefinitionHelper from '/experiment/common/DefinitionHelper';
import {PI} from '/utils/math';
import Sim3 from '/math/Sim3';
import NBox from '/math/NBox';

function DroneRingModel() {
  this.agentBoxes = DroneBoxes.boxList;
  this.worldBoxes = []
    .concat(DefinitionHelper.makeRing(3.5, 0.5, 16, Sim3.translateXYZ(Sim3.rotationX(PI / 2), 0, 0, +2)))
    .concat(DefinitionHelper.makeRing(3.0, 0.5, 12, Sim3.translateXYZ(Sim3.rotationX(PI / 2), 0, 0,  0)))
    .concat(DefinitionHelper.makeRing(3.5, 0.5, 16, Sim3.translateXYZ(Sim3.rotationX(PI / 2), 0, 0, -2)))
  ;
}

export default function DroneRingMap() {
  this.model = new DroneRingModel();

  this.sampler = new Sampler3D(this.model);
  this.storeResolution = 0.05; // for all strategies
  this.checkResolution = 0.04; // for all strategies

  this.connectDistance = 1.50; // for Prm
  this.targetDistance = 0.15;  // for Rrt

  this.sampleBounds = NBox.make([-7, -7, -7, -1, -1, -1, -1], [7, 7, 7, 1, 1, 1, 1]);

  this.start  = Configuration.make(-2.5, -1, -5, 1, 0, 0, 0);
  this.target = Configuration.make(-2.5, +1, +5, 1, 0, 0, 0);
  this.Configuration = Configuration;
  this.ConfigurationInput = ConfigurationInput;
};