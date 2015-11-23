import NBox from '/math/NBox';
import CurvedPianoConfig from '/experiment/curved_piano/CurvedPianoConfig';
import CurvedPianoInput from '/experiment/curved_piano/CurvedPianoInput';
import PianoSampler from '/experiment/piano2d/PianoSampler';

function CurvedPianoExperiment() {
  this.model = CurvedWorld;

  this.sampler = new PianoSampler(CurvedWorld, CurvedPianoConfig);

  this.storeResolution = 0.05;
  this.checkResolution = 0.02;

  this.connectDistance = 0.10;
  this.targetDistance = 0.10;

  this.sampleBounds = new NBox([-5, -4, -1.1, -1.1], [5, 4, 1.1, 1.1]);
  this.start = CurvedPianoConfig.make(-2.6, -2.0, 1, 0);
  this.target = CurvedPianoConfig.make(2.6, -2.0, 1, 0);
  this.Configuration = CurvedPianoConfig;
  this.ConfigurationInput = CurvedPianoInput;
}
