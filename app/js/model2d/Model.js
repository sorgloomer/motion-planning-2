var Model = (function(utils, similar2, BoxTreeBuilder) {

  function defToOBox(def) {
    return Obb.create(def.size[0], def.size[1], def.pos[0], def.pos[1], def.angle);
  }

  function Agent(def) {
    this.placement = similar2.create();
    this.tree = BoxTreeBuilder.fromList(def.map(defToOBox));
  }

  function newAgent(def) {
    return new Agent(def);
  }

  function Model(def) {
    this.definition = def;

    this.wallsTree = BoxTreeBuilder.fromList(def.walls.map(defToOBox));

    this.agents = def.agents.map(newAgent);
    this.reset();
  }

  Model.prototype.reset = function reset() {
    this.agents.forEach(function(agent) {
      similar2.setIdentity(agent.placement);
    });
  };

  Model.prototype.isValid = function isValid() {
    var walls = this.wallsTree;
    return this.agents.some(function(agent) {
      return walls.collides(agent.tree, agent.placement);
    });
  };

  return Model;
})(utils, similar2, BoxTreeBuilder);
