function ParkingExperiment() {
  var NBox = require('math.NBox');

  var _this = this;
  _this.sampler = sampler;

  _this.start =  [ 0.2, -1.6, 1, 0];
  _this.target = [ 1.0, -0.4, 1, 0];


  if (false) {
    var temp = _this.start;
    _this.start = _this.target;
    _this.target = temp;
  }

  _this.resolution = 0.06;
  _this.targetDistance = 0.08;

  _this.nbox = new NBox(
    [ -0.6, -2.4, -1.1, -1.1 ],
    [  1.2,  2.0,  1.1,  1.1 ]
  );
  _this.configuration = ParkingConfig;
  _this.model = new Model(ParkingWorld);
  _this.samplesTook = 0;

  function sampler(dot) {
    var model = _this.model;
    ++_this.samplesTook;
    ParkingConfig.load(dot, model);
    return model.isValid();
  }
}
