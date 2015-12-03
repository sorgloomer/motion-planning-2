import DroneBoxes from '/experiments_new/experiment/drone/DroneBoxes';
import Sampler3D from '/experiments_new/experiment/piano3d/Sampler3D';
import Piano3DConfig from '/experiments_new/experiment/piano3d/Piano3DConfig';
import Piano3DInput from '/experiments_new/experiment/piano3d/Piano3DInput';
import DefinitionHelper from '/experiments_new/experiment/common/DefinitionHelper';
import {PI} from '/utils/math';
import Vec3 from '/math/Vec3';
import Sim3 from '/math/Sim3';
import Quat from '/math/Quat';
import QuatEtc from '/math/QuatEtc';
import Sim3Etc from '/math/Sim3Etc';
import Obb3 from '/experiments_new/collision/obb3/Obb3';
import NBox from '/math/NBox';
import lists from '/utils/lists';

const Configuration = Piano3DConfig;
const ConfigurationInput = Piano3DInput;

function TestModel1() {
  const temp_quat = Quat.identity();
  this.agentBoxes = [];
  this.worldBoxes = lists.generate(5, i => {
    const result = new Obb3();
    Vec3.setXYZ(result.hsize,
      0.2 + Math.random() * 0.3,
      0.2 + Math.random() * 0.3,
      0.2 + Math.random() * 0.3
    );
    QuatEtc.setRandomUnit(temp_quat);
    QuatEtc.transformQXYZ(result.transform, temp_quat,
      Math.random() * 6 - 3, Math.random() * 6 - 3, Math.random() * 6 - 3);
    return result;
  });
}


export default function TestExperiment1() {
  this.model = new TestModel1();

  this.sampler = new Sampler3D(this.model);
  this.storeResolution = 0.05;
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