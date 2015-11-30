import Config from '/entry/Config';
import databind from '/utils/databind';
import similar2 from '/math/Sim2';

function CssViewModel(def, Configuration) {
  this.definition = def;
  this.agents = def.agents.map(function() { return similar2.create(); });
  this.agents2 = def.agents.map(function() { return similar2.create(); });
  this.samples = [];
  this.Configuration = Configuration;
}

const SampleBindingDefinition = {
  create: function() {
    return new Float64Array([1, 0, 0, 0]);
  },
  update: function(dst, src, _this) {
    _this.Configuration.loadSample(dst, src.pos);
  },
  remove: function() {}
};

CssViewModel.prototype.pullSolver = function(solver) {

  var agents = this.agents;
  var agents2 = this.agents2;

  databind.updateArray(this.samples, solver.samples.slice(-Config.SHOW2D_SAMPLE_COUNT), SampleBindingDefinition, this);

  if (solver.conf_gen) {
    this.Configuration.loadView(indexer1, solver.conf_gen);
  }
  if (solver.conf_trial) {
    this.Configuration.loadView(indexer2, solver.conf_trial);
  }

  function indexer1(i) { return agents[i]; }
  function indexer2(i) { return agents2[i]; }
};
CssViewModel.prototype.pullAnim = function(solver, interpolated) {
  var agents = this.agents;
  var agents2 = this.agents2;
  this.Configuration.loadView(indexer1, interpolated);

  if (solver.conf_trial) {
    this.Configuration.loadView(indexer2, solver.conf_trial);
  }

  function indexer1(i) { return agents[i]; }
  function indexer2(i) { return agents2[i]; }
};

export default CssViewModel;

