import utils from '/utils/utils';
import databind from '/utils/databind';


var SCALE = 100;
var VEC2_ZERO = [0, 0];


function CssView(viewmodel, viewportElement) {
  this.viewmodel = viewmodel;
  this.viewport = viewportElement;

  this.walls = createView(viewmodel.definition.walls, viewportElement, "walls");

  this.agents = viewmodel.definition.agents.map(function(agentDef) {
    return createView(agentDef, viewportElement, "agent");
  });
  this.agents2 = viewmodel.definition.agents.map(function(agentDef) {
    return createView(agentDef, viewportElement, "agent2");
  });

  this.samples = [];

  // this.walls.appendChild(createTree(this.model.wallsTree, "rect"));

  this.update();
}

function createView(def, viewportElement, style) {
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
  viewportElement.appendChild(view);
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



var SampleDefinition = {
  create: function(src, view) {
    var elem = document.createElement('div');
    elem.classList.add('sample');
    view.viewport.appendChild(elem);
    return elem;
  },
  update: function(dst, src, view) {
    positionElement(dst, src[2], src[3], 0);
  },
  remove: function(dst, view) {
    dst.remove();
  }
};

CssView.prototype.update = function update() {
  var i, arr1, arr2;
  arr1 = this.agents;
  arr2 = this.viewmodel.agents;
  for (i = 0; i < arr1.length; i++) {
    positionElementSim(arr1[i], arr2[i]);
  }
  arr1 = this.agents2;
  arr2 = this.viewmodel.agents2;
  for (i = 0; i < arr1.length; i++) {
    positionElementSim(arr1[i], arr2[i]);
  }

  databind.updateArray(this.samples, this.viewmodel.samples, SampleDefinition, this);
};

CssView.prototype.setHighlighted = function setHighlighted(flag){
  this.agents.forEach(function(agent) {
    if (flag) {
      agent.classList.add('highlight');
    } else {
      agent.classList.remove('highlight');
    }
  });
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

CssView.positionElement = positionElement;

export default CssView;
