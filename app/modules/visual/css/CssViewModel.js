import databind from '/utils/databind';

function CssViewModel(def) {
  this.definition = def;
  this.agents = def.agents.map(function() { return similar2.create(); });
  this.agents2 = def.agents.map(function() { return similar2.create(); });
  this.samples = [];
  this._configSpace = null;
}

const SampleBindingDefinition = {
  create: function() {
    return new Float64Array([1, 0, 0, 0]);
  },
  update: function(dst, src, _this) {
    _this._configSpace.loadSample(dst, src.pos);
  },
  remove: function() {}
};

CssViewModel.prototype.pullSolver = function(solver, configuration) {

  var agents = this.agents;
  var agents2 = this.agents2;

  this._configSpace = configuration;
  databind.updateArray(this.samples, solver.samples.slice(-1000), SampleBindingDefinition, this);

  if (solver.conf_gen) {
    configuration.loadView(indexer1, solver.conf_near);
  }
  if (solver.conf_trial) {
    configuration.loadView(indexer2, solver.conf_trial);
  }

  function indexer1(i) { return agents[i]; }
  function indexer2(i) { return agents2[i]; }
};
CssViewModel.prototype.pullAnim = function(solver, interpolated, configuration) {
  var agents = this.agents;
  var agents2 = this.agents2;
  configuration.loadView(indexer1, interpolated);
  configuration.loadView(indexer2, solver.conf_trial);
  function indexer1(i) { return agents[i]; }
  function indexer2(i) { return agents2[i]; }
};

export default CssViewModel;

