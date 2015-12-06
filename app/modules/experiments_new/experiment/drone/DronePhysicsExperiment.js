import DroneBoxes from '/experiments_new/experiment/drone/DroneBoxes';
import Sampler3D from '/experiments_new/experiment/piano3d/Sampler3D';
import Configuration from '/experiments_new/experiment/drone/PhysicsConfig';
import ConfigurationInput from '/experiments_new/experiment/drone/PhysicsInput';
import DefinitionHelper from '/experiments_new/experiment/common/DefinitionHelper';
import {PI} from '/utils/math';
import Sim3 from '/math/Sim3';
import NBox from '/math/NBox';

function Drone2Model() {
  this.agentBoxes = DroneBoxes.boxList;
  this.worldBoxes =
    []
      .concat(DefinitionHelper.makeRing(3.5, 0.5, 12, Sim3.translateXYZ(Sim3.rotationX(PI / 2), 0, 0,  0)))
  ;
}


export default function DroneRingMapPhysics() {
  this.model = new Drone2Model();

  this.sampler = new Sampler3D(this.model);
  this.storeResolution = 0.05;
  this.storeResolutionGradient = 0.2;
  this.checkResolution = 0.02;

  this.connectDistance = 0.1;
  this.targetDistance = 0.30;
  this.sampleBounds = NBox.make([
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