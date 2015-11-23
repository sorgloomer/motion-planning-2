import Sim2 from '/math/Sim2';
import Obb2TreeBuilder from '/experiments_old/collision/obb2/Obb2TreeBuilder';
import Obb2 from '/experiments_old/collision/obb2/Obb2';


function defToOBox(def) {
  return Obb2.create(def.size[0], def.size[1], def.pos[0], def.pos[1], def.angle);
}

function Agent(def) {
  this.placement = Sim2.create();
  this.tree = Obb2TreeBuilder.fromList(def.map(defToOBox));
}

function newAgent(def) {
  return new Agent(def);
}

function PianoModel(def) {
  this.definition = def;

  this.wallsTree = Obb2TreeBuilder.fromList(def.walls.map(defToOBox));

  this.agents = def.agents.map(newAgent);
  this.reset();
}

PianoModel.prototype.reset = function reset() {
  this.agents.forEach(function(agent) {
    Sim2.setIdentity(agent.placement);
  });
};

PianoModel.prototype.isValid = function isValid() {
  var walls = this.wallsTree;
  return this.agents.some(function(agent) {
    return walls.collides(agent.tree, agent.placement);
  });
};

export default PianoModel;
