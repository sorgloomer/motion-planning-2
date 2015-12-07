var DT = 0.3;

export default function(SEGMENTS) {

  function rspan(x) {
    return (Math.random() * 2 - 1) * x;
  }


  function randomize(inp) {
    for (var i = 0; i < SEGMENTS; i++) inp[i] = rspan(1.0);
  }

  function applyTo(to, config, inp) {
    for (var i = 0; i < SEGMENTS; i++) to[i] = config[i] + DT * inp[i];
    return to;
  }

  function applyIP(config, inp) {
    return applyTo(config, config, inp);
  }

  function create() {
    return new Float64Array(SEGMENTS);
  }

  function costOf(inp) {
    return DT;
  }
  return {
    create, randomize,
    applyIP, applyTo,
    costOf
  };
}