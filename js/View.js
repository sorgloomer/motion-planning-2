var View = (function(Map, utils) {

  var SCALE = 100;
  var VEC2_ZERO = [0, 0];


  function View(model, viewport) {
    this.model = model;
    this.viewport = viewport;

    var definition = model.definition;
    this.walls = createView(definition.walls, viewport, "walls");
    this.agent = createView(definition.agent, viewport, "agent");

    this.update();
  }

  function createView(def, viewport, style) {
    var view = document.createElement('span');
    view.className = style;
    def.forEach(function(d) {
      var element = document.createElement('span');
      element.className = "box";
      element.style.width = (2 * SCALE * d.size[0]) + "px";
      element.style.height = (2 * SCALE * d.size[1]) + "px";
      var pos = utils.nvl(d.pos, VEC2_ZERO);
      positionElement(element, pos[0], pos[1], utils.nvl(d.angle, 0));
      view.appendChild(element);
    });
    viewport.appendChild(view);
    return view;
  }

  function forEach(arr, fn) {
    if (arr) arr.forEach(fn);
  }

  function createTree(tree, style) {
    var root = document.createElement('span');
    drawTree(tree, root, style);
    return root;
  }
  function drawTree(tree, parent, style) {
    var elements = [];
    function bound(tree) {
      var element = document.createElement('span');
      element.className = style;
      element.style.width = (2 * SCALE * tree.box.hsize[0]) + "px";
      element.style.height = (2 * SCALE * tree.box.hsize[1]) + "px";
      positionElementSim(element, tree.box.placement);
      parent.appendChild(element);
      elements.push(element);
      forEach(tree.children, bound);
    }
    bound(tree);
    return elements;
  }


  View.prototype.update = function update() {
    positionElementSim(this.agent, this.model.agentPlacement);
  };

  View.prototype.setHighlighted = function setHighlighted(flag){
    if (flag) {
      this.agent.classList.add('highlight');
    } else {
      this.agent.classList.remove('highlight');
    }
  };

  function cssMatrix(x, y, angle) {
    var ca = Math.cos(angle), sa = Math.sin(angle);
    return "matrix("
      + ca + "," + sa + ","
      + (-sa) + "," + ca + ","
      + x + "," + y
      + ")";
  }

  function cssMatrixSim(sim, scale) {
    if (scale === undefined) scale = 1;
    return "matrix("
      + sim[0] + "," + sim[1] + ","
      + (-sim[1]) + "," + sim[0] + ","
      + (sim[2] * scale) + "," + (sim[3] * scale)
      + ")";
  }
  function positionElementSim(e, sim) {
    e.style.transform = "translate(-50%, -50%) " + cssMatrixSim(sim, SCALE);
  }
  function positionContainerSim(e, sim) {
    e.style.transform = cssMatrixSim(sim, SCALE);
  }

  function positionElement(e, x, y, a) {
    e.style.transform = "translate(-50%, -50%) " + cssMatrix(x * SCALE, y * SCALE, utils.nvl(a, 0));
  }

  View.positionElement = positionElement;
  return View;
})(Map, utils);
