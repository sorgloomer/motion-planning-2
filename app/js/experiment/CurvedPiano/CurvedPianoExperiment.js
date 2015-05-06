function CurvedPianoExperiment() {
  var NBox = require('math.NBox');
  var _this = this;
  _this.sampler = sampler;
  _this.start =  [-2.6, -2.0, 1, 0];
  _this.target = [ 2.6, -2.0, 1, 0];

  _this.resolution = 0.05;
  _this.targetDistance = 0.10;

  _this.nbox = new NBox([-5, -4, -1.1, -1.1], [5, 4, 1.1, 1.1]);
  _this.configuration = CurvedPianoConfig;
  _this.model = new Model(CurvedWorld);
  _this.samplesTook = 0;

  function sampler(dot) {
    var model = _this.model;
    ++_this.samplesTook;
    CurvedPianoConfig.loadModel(dot, model);
    return model.isValid();
  }
}

