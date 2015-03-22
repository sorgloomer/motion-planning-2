var View = (function(Map, utils) {

  var SCALE = 100;
  var VEC2_ZERO = [0, 0];


  function View(model, viewport) {
    var _this = this;
    var definition = model.definition;
    this.model = model;
    this.viewport = viewport;

    this.names = new Map();
    this.bodies = definition.bodies.map(function(body) {

      var view = document.createElement('div');
      view.className = "bodyview";

      body.shape.forEach(function(d) {
        var element = document.createElement('div');
        element.className = "box box-" + body.type;
        element.style.width = (2 * SCALE * d.size[0]) + "px";
        element.style.height = (2 * SCALE * d.size[1]) + "px";
        var pos = utils.nvl(d.pos, VEC2_ZERO);
        positionElement(element, pos[0], pos[1], utils.nvl(d.angle, 0));
        view.appendChild(element);
      });
      if (body.name) _this.names.set(body.name, view);
      viewport.appendChild(view);
      return view;
    });
  }


  View.prototype.update = function() {
    var _this = this;
    this.bodies.forEach(function(b, i) {
      positionElementToBody(b, _this.model.bodies[i]);
    });
  };

  View.prototype.setHighlighted = function(name, flag){
      var view = this.names.get(name);
    if (view) {
      if (flag) {
        view.classList.add('highlight');
      } else {
        view.classList.remove('highlight');
      }
    }

  };

  function positionElementToBody(el, body, force) {
    if (force || body.IsAwake()) {
      var bpos = body.GetPosition();
      var angle = body.GetAngle();
      var x = bpos.get_x(), y = bpos.get_y();
      positionElement(el, x, y, angle);
    }
  }




  function cssMatrix(x, y, angle) {
    var ca = Math.cos(angle), sa = Math.sin(angle);
    return "matrix("
      + ca + "," + sa + ","
      + (-sa) + "," + ca + ","
      + x + "," + y
      + ")";
  }

  function positionElement(e, x, y, a) {
    e.style.transform = "translate(-50%, -50%) " + cssMatrix(x * SCALE, y * SCALE, utils.nvl(a, 0));
  }


  View.positionElement = positionElement;
  return View;
})(Map, utils);
