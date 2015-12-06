import NBox from '/math/NBox';
import CurvedPianoConfig from '/experiments_old/experiment/curved_piano/CurvedPianoConfig';
import CurvedPianoInput from '/experiments_old/experiment/curved_piano/CurvedPianoInput';
import CurvedWorld from '/experiments_old/experiment/curved_piano/CurvedWorld';
import PianoSampler from '/experiments_old/experiment/common/PianoSampler';

function CurvedPianoExperiment() {
  this.model = CurvedWorld;

  this.sampler = new PianoSampler(CurvedWorld, CurvedPianoConfig);

  this.storeResolution = 0.15;
  this.storeResolutionGradient = 0.2;
  this.checkResolution = 0.05;

  this.connectDistance = 0.50;
  this.targetDistance = 0.30;

  this.sampleBounds = new NBox([-5, -4, -1.1, -1.1], [5, 4, 1.1, 1.1]);
  this.start = CurvedPianoConfig.make(-2.6, -2.0, 1, 0);
  this.target = CurvedPianoConfig.make(2.6, -2.0, 1, 0);
  this.Configuration = CurvedPianoConfig;
  this.ConfigurationInput = CurvedPianoInput;
}

export default CurvedPianoExperiment;