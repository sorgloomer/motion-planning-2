import ArmConfig from '/experiments_old/experiment/arm/ArmConfig';
import ArmInput from '/experiments_old/experiment/arm/ArmInput';
import ArmWorld from '/experiments_old/experiment/arm/ArmWorld';

import NBox from '/math/NBox';

import Sampler2D from '/experiments_old/experiment/common/PianoSampler';
import utils from '/utils/utils';


function ArmExperiment(SEGMENTS, SEGMENT_SIZE) {
  const World = ArmWorld(SEGMENTS, SEGMENT_SIZE);
  const Config = ArmConfig(SEGMENTS, SEGMENT_SIZE);
  const Input = ArmInput(SEGMENTS, SEGMENT_SIZE);

  this.model = World;

  this.sampler = new Sampler2D(World, Config);


  this.storeResolutionMin = 0.10;
  this.storeResolutionMax = 0.20;
  this.storeResolutionGradient = 0.2;
  this.checkResolution = 0.05;

  this.connectDistance = 0.40;
  this.targetDistance = 0.20;

  this.sampleBounds = new NBox(
    utils.times(SEGMENTS, -1),
    utils.times(SEGMENTS, 1)
  );
  this.start =  Config.make(-1);
  this.target = Config.make(1);

  this.Configuration = Config;
  this.ConfigurationInput = Input;
  this.World = World;
}

export default ArmExperiment;
