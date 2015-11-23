/**
 * Created by Hege on 2015.11.23..
 */

import PianoModel from '/experiment/piano2d/PianoModel';

export default class PianoSampler {
  constructor(model, config) {
    this.config = config;
    this.model = new PianoModel(model);
    this.samplesTook = 0;
  }
  sample(dot) {
    const model = this.model;
    this.samplesTook++;
    this.config.loadModel(dot, model);
    return model.isValid();
  }
  getSampleCount() {
    return this.samplesTook;
  }
}

