import NBox from '/math/NBox';
import PhParkingConfig from '/experiments_old/experiment/parking_physics/PhParkingConfig';
import ParkingWorld from '/experiments_old/experiment/parking/ParkingWorld';
import PhParkingInput from '/experiments_old/experiment/parking_physics/PhParkingInput';

import PianoSampler from '/experiments_old/experiment/common/PianoSampler';
import vecn from '/math/VecN';

const World = ParkingWorld;
const Config = PhParkingConfig;
const Input = PhParkingInput;

export default function PhParkingExperiment() {
  this.model = World;
  this.sampler = new PianoSampler(World, Config);

  this.checkResolution = 0.10;
  this.storeResolutionMin = 0.06;
  this.storeResolutionMax = 0.50;
  this.storeResolutionGradient = 0.2;
  this.connectDistance = 0.10; // prm has no meaning here
  this.targetDistance = 0.22;

  this.sampleBounds = new NBox(
    [-0.6, -2, -1.1, -1.1, -10, -10],
    [ 1.0,  2,  1.1,  1.1,  10,  10]
  );
  this.start =  Config.make(0.2, -1.6, 0);
  this.target = Config.make(1.1, -0.4, 0);

  this.Configuration = Config;
  this.ConfigurationInput = Input;
}
