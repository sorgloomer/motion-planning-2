import DroneBoxes from '/experiment/drone/drone_boxes';
import Sampler from '/experiment/piano3d/sampler';
import Configuration from '/experiment/piano3d/configuration';
import ConfigurationInput from '/experiment/piano3d/action';
import DefinitionHelper from '/experiment/common/DefinitionHelper';
import {PI} from '/utils/math';
import Sim3 from '/math/Sim3';
import NBox from '/math/NBox';

export default function DroneRingMap() {
  this.agentBoxes = DroneBoxes.boxList;
  this.worldBoxes =
    []
      .concat(DefinitionHelper.makeRing(3.5, 0.7, 16, Sim3.translateXYZ(Sim3.rotationX(PI / 2), 0, 0, +2)))
      .concat(DefinitionHelper.makeRing(3.0, 0.7, 12, Sim3.translateXYZ(Sim3.rotationX(PI / 2), 0, 0,  0)))
      .concat(DefinitionHelper.makeRing(3.5, 0.7, 16, Sim3.translateXYZ(Sim3.rotationX(PI / 2), 0, 0, -2)))
  ;

  this.sampler = Sampler(this.agentBoxes, this.worldBoxes);
  this.resolution = 0.05;
  this.targetDistance = 0.15;
  this.nbox = NBox.make([-7, -7, -7, -1, -1, -1, -1], [7, 7, 7, 1, 1, 1, 1]);

  this.start  = Configuration.make(-2.5, -1, -5, 1, 0, 0, 0);
  this.target = Configuration.make(-2.5, +1, +5, 1, 0, 0, 0);
  this.Configuration = Configuration;
  this.ConfigurationInput = ConfigurationInput;
};