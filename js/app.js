(function(Box2D, utils, WORLD, Configuration) {
  "use strict";

  var totalTime = 0;
  var model, view, viewport;
  var config = Configuration.create();


  function setupModel() {
    viewport = document.getElementById('viewport');
    model = new Model(WORLD);
    view = new View(model, viewport);
  }



  function simulate(dt) {
    model.world.Step(dt, 2, 2);
  }


  function restart() {
    totalTime = 0;
    model.reset();
  }


  function cycle() {
    simulate(0.06);
    config[2] += 0.01;
    Configuration.load(config, model);
    view.setHighlighted('agent', agentHasCollision(model));
    view.update();
  }

  function notNull(ptr) {
    return !Box2D.compare(ptr, Box2D.NULL);
  }

  function startUp() {
    setupModel();

    Configuration.save(config, model);


    scheduleCycle();

    setTimeout(function() {
      console.log(agentHasCollision(model));
    }, 100);
  }


  function agentHasCollision(model) {
    var contactPtr = model.names.get("agent").GetContactList(), cnt = 0;
    // console.log(contactPtr.get_contact());
    while (notNull(contactPtr)) {
      var contact = contactPtr.get_contact();
      var manifold = contact.GetManifold();
      cnt += manifold.get_pointCount();
      // var localPoint = manifold.get_localPoint();
      // var worldPoint = contact.GetFixtureA().GetBody().GetWorldPoint(localPoint);
      // addHighlightedPoint(worldPoint.get_x(), worldPoint.get_y());
      contactPtr = contactPtr.get_next();
    }
    // console.log(cnt);
    return cnt > 0;
  }

  function addHighlightedPoint(x, y) {
    var circ = document.createElement('div');
    circ.className = 'circle';
    View.positionElement(circ, x, y);
    viewport.appendChild(circ);
  }





  function cycleIteration() {
    scheduleCycle();
    cycle();
  }
  function scheduleCycle() {
    self.requestAnimationFrame(cycleIteration);
  }

  startUp();

  self.restart = restart;
})(Box2D, utils, WORLD, Configuration);