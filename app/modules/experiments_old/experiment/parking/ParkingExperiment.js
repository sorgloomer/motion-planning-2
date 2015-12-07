import NBox from '/math/NBox';
import Sampler2D from '/experiments_old/experiment/common/PianoSampler';
import ParkingConfig from '/experiments_old/experiment/parking/ParkingConfig';
import ParkingInput from '/experiments_old/experiment/parking/ParkingInput';
import ParkingWorld from '/experiments_old/experiment/parking/ParkingWorld';

const World = ParkingWorld;
const Config = ParkingConfig;
const Input = ParkingInput;

const PARK_OUT = false;
export default function ParkingExperiment() {

  this.model = World;
  this.sampler = new Sampler2D(World, Config);

  this.storeResolutionMin = 0.01;
  this.storeResolutionMax = 0.06;
  this.storeResolutionGradient = 0.2;
  this.checkResolution = 0.01;
  this.connectDistance = 0.12;
  this.targetDistance = 0.05;


  this.start = Config.make( 0.2, -1.6, 0);
  this.target = Config.make(1.0, -0.4, 0);

  this.sampleBounds = new NBox(
    [ -0.6, -2.4, -1.1, -1.1 ],
    [  1.2,  2.0,  1.1,  1.1 ]
  );

  if (PARK_OUT) {
    var temp = this.start;
    this.start = this.target;
    this.target = temp;
  }


  this.Configuration = Config;
  this.ConfigurationInput = Input;
}
