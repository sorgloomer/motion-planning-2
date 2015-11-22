import DroneBoxes from '/experiment/drone/drone_boxes';
import Sampler from '/experiment/piano3d/Sampler';
import Configuration from '/experiment/drone/PhysicsConfig';
import ConfigurationInput from '/experiment/drone/PhysicsInput';
import DefinitionHelper from '/experiment/common/DefinitionHelper';
import {PI} from '/utils/math';
import Sim3 from '/math/Sim3';
import NBox from '/math/NBox';


export default function DroneRingMapPhysics() {
  this.agentBoxes = DroneBoxes.boxList;
  this.worldBoxes =
    []
      .concat(DefinitionHelper.makeRing(3.5, 0.5, 12, Sim3.translateXYZ(Sim3.rotationX(PI / 2), 0, 0,  0)))
  ;


  this.sampler = Sampler(this.agentBoxes, this.worldBoxes);
  this.storeResolution = 0.05;
  this.checkResolution = 0.02;

  this.connectDistance = 0.1;
  this.targetDistance = 0.30;
  this.nbox = NBox.make([
    -7, -5, -10,
    -1, -1, -1,
    -1, -1, -1, -1,
    -1, -1, -1
  ], [
    7, 5, 10,
    1, 1, 1,
    1, 1, 1, 1,
    1, 1, 1
  ]);

  this.start  = Configuration.make(-2.5, -1, -7, 1, 0, 0, 0);
  this.target = Configuration.make(-2.5, +1, +7, 1, 0, 0, 0);
  this.Configuration = Configuration;
  this.ConfigurationInput = ConfigurationInput;
};