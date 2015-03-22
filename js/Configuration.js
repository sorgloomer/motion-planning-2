var Configuration = (function(Float32Array, similar2) {

  function Configuration_create() {
    return new Float32Array(3);
  }

  function Configuration_save(config, model) {
  }

  function Configuration_load(config, model) {
    similar2.setXYA(model.agentPlacement, config[0], config[1], config[2]);
    return config;
  }

  return {
    create: Configuration_create,
    save: Configuration_save,
    load: Configuration_load
  };
})(Float32Array, similar2);

