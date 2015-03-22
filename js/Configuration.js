var Configuration = (function(Float32Array, Box2D) {

  var TEMP = new Box2D.b2Vec2();

  function Configuration_create() {
    return new Float32Array(3);
  }

  function Configuration_save(config, model) {
    var agent = model.names.get("agent");
    var vec = agent.GetPosition();
    var x = vec.get_x();
    var y = vec.get_y();
    var angle = agent.GetAngle();

    config[0] = x;
    config[1] = y;
    config[2] = angle;
    return config;
  }

  function Configuration_load(config, model) {
    var agent = model.names.get("agent");
    TEMP.Set(config[0], config[1]);
    agent.SetTransform(TEMP, config[2]);
    agent.SetAwake(true);
    agent.SetActive(true);
    return config;
  }

  return {
    create: Configuration_create,
    save: Configuration_save,
    load: Configuration_load
  };
})(Float32Array, Box2D);

