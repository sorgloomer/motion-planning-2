import query from '/utils/query';
import NBox from '/math/NBox';
import VecN from '/math/VecN';
import NBoxTree from '/math/NBoxTree';
import { default_dict } from '/utils/dicts';


function randomDotInNBox(nbox) {
  var vec = VecN.copy(nbox.min);
  for (var i = 0; i < vec.length; i++) {
    vec[i] = nbox.min[i] + Math.random() * (nbox.max[i] - nbox.min[i]);
  }
  return vec;
}

function test_nbox() {
  var bounds = NBox.make([-1, -1, -1, -1],[1, 1, 1, 1]);
  var nboxtree = new NBoxTree(bounds);


  var target = VecN.create(4);
  var bestdist = 2000;
  for (var i = 0; i < 2000; i++) {
    var newvec = randomDotInNBox(bounds);
    nboxtree.putDot(newvec);

    var nearest = nboxtree.nearest(target);
    var dist = VecN.dist(nearest, target);

    if (dist > bestdist) {
      return false;
    }
  }
  return nboxtree.check();
}

function main() {
  for (var i = 1; i < 11;  i++) {
    var res = test_nbox();
    console.log('test_nbox #' + i + ': '
      + (res ? 'SUCC' : 'FAIL'));
  }

}

export default { main };