function ArmExperiment() {
  var Config = ArmConfig;
  var World = ArmWorld;

  var NBox = require('math.NBox');

  var _this = this;
  _this.sampler = sampler;


  _this.start =  [ -1, -1, -1, -1 ];
  _this.target = [  1,  1,  1,  1 ];
  
  _this.resolution = 0.08;
  _this.targetDistance = 0.12;

  _this.nbox = new NBox(
    [ -1, -1, -1, -1 ],
    [  1,  1,  1,  1 ]
  );
  _this.configuration = Config;
  _this.model = new Model(World);
  _this.samplesTook = 0;

  function sampler(dot) {
    var model = _this.model;
    ++_this.samplesTook;
    Config.loadModel(dot, model);
    return model.isValid();
  }
}
