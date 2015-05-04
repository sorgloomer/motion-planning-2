function CurvedPianoExperiment() {
  var NBox = require('math.NBox');
  var _this = this;
  _this.sampler = sampler;
  _this.start =  [-2.6, -2.0, 1, 0];
  _this.target = [ 2.6, -2.0, 1, 0];
  _this.resolution = 0.3;
  _this.nbox = new NBox([-60, -40, -1.1, -1.1], [60, 40, 1.1, 1.1]);
  _this.configuration = Configuration;
  _this.model = new Model(CurvedWorld);
  _this.samplesTook = 0;

  function sampler(dot) {
    var model = _this.model;
    ++_this.samplesTook;
    Configuration.load(dot, model);
    return model.isValid();
  }
}

