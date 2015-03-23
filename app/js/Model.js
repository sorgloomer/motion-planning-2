var Model = (function(utils, similar2, BoxTreeBuilder) {

  function defToOBox(def) {
    return OBox.create(def.size[0], def.size[1], def.pos[0], def.pos[1], def.angle);
  }

  function Model(def) {
    this.definition = def;

    this.wallsTree = BoxTreeBuilder.fromList(def.walls.map(defToOBox));
    this.agentTree = BoxTreeBuilder.fromList(def.agent.map(defToOBox));
    this.agentPlacement = similar2.create();
    this.reset();
  }

  Model.prototype.reset = function reset() {
    var def = this.definition;
    similar2.setXYA(this.agentPlacement, def.start.pos[0], def.start.pos[1], def.start.angle);
  };

  Model.prototype.isValid = function isValid() {
    return this.wallsTree.collides(this.agentTree, this.agentPlacement);
  };

  return Model;
})(utils, similar2, BoxTreeBuilder);
