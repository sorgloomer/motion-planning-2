var ViewModel = (function() {

  function ViewModel(def) {
    this.definition = def;
    this.agentPlacement = similar2.create();
    this.agentPlacement2 = similar2.create();
    this.samples = [];
    this._configSpace = null;
  }

  var SampleDefinition = {
    create: function() {
      return [1, 0, 0, 0];
    },
    update: function(dst, src, _this) {
      _this._configSpace.loadSample(dst, src.pos);
    },
    remove: function() {}
  };

  ViewModel.prototype.pullSolver = function(solver, configuration) {
    this._configSpace = configuration;
    utils.updateArray(this.samples, solver.samples, SampleDefinition, this);

    if (solver.conf_gen) {
      configuration.loadSample(this.agentPlacement, solver.conf_gen);
    }
    if (solver.conf_trial) {
      configuration.loadSample(this.agentPlacement2, solver.conf_trial);
    }
  };
  ViewModel.prototype.pullAnim = function(placement) {
    similar2.set(this.agentPlacement, placement);
  };

  return ViewModel;
})();
