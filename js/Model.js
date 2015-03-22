var Model = (function(Map, Box2D, utils) {
  var ZERO = new Box2D.b2Vec2(0.0, 0.0);
  var VEC2_ZERO = [0, 0];
  var DEF_TYPES = {
    static: Box2D.b2_staticBody,
    dynamic: Box2D.b2_dynamicBody
  };

  function Model(def) {
    var temp = new Box2D.b2Vec2();
    var _this = this;
    var gravity = def.gravity ? new Box2D.b2Vec2(def.gravity[0], def.gravity[1]) : undefined;
    this.definition = def;
    this.world = new Box2D.b2World(gravity);
    this.names = new Map();
    this.bodies = def.bodies.map(function (b) {
      var bodyDef = new Box2D.b2BodyDef();
      bodyDef.set_type(DEF_TYPES[b.type]);
      var pos = utils.nvl(b.pos, VEC2_ZERO);
      temp.set_x(pos[0]);
      temp.set_y(pos[1]);
      bodyDef.set_position(temp);
      bodyDef.set_angle(utils.nvl(b.angle, 0));

      var body = _this.world.CreateBody(bodyDef);

      b.shape.forEach(function(s) {
        var shape = new Box2D.b2PolygonShape();
        var pos = utils.nvl(s.pos, VEC2_ZERO);
        shape.SetAsBox(s.size[0], s.size[1], new Box2D.b2Vec2(pos[0], pos[1]), utils.nvl(s.angle, 0));
        body.CreateFixture(shape, 5.0);
      });

      if (b.name) _this.names.set(b.name, body);
      return body;
    });

    this.reset();
  }

  Model.prototype.reset = function() {
    var _this = this;
    var temp = new Box2D.b2Vec2();
    this.definition.bodies.forEach(function(def, i) {
      var body = _this.bodies[i];
      var pos = utils.nvl(def.pos, VEC2_ZERO);
      temp.Set(pos[0], pos[1]);
      body.SetTransform(temp, utils.nvl(def.angle, 0));
      body.SetLinearVelocity(ZERO);
      body.SetAwake(1);
      body.SetActive(1);
    });

  };
  return Model;
})(Map, Box2D, utils);
