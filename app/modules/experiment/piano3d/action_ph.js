const { random } = Math;

function create() {
  return new Float64Array(3);
}

function randomize(c = create()) {
  c[0] = random() + random();
  c[1] = random() + random();
  c[2] = random() + random();
  return c;
}

export default {
  create, randomize
};
