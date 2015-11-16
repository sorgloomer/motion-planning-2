import OBox from '/collision/obb/Obb';
import BoxTreeBuilder from '/collision/obb/ObbTreeBuilder';
import lists from '/utils/lists';


/*
const boxList = lists.generate(8, i => Obb.makePlacement(
  0.5, 0.5, 0.5, 0, 3 * i, 0, 0, 0, 0, 0
));
*/


const boxList = lists.generate(15, i => OBox.makePlacement(
  0.4 + Math.random() * 0.4,
  0.4 + Math.random() * 0.4,
  0.4 + Math.random() * 0.4,

  (Math.random() - 0.5) * 12,
  (Math.random() - 0.5) * 12,
  (Math.random() - 0.5) * 12,

  (Math.random() - 0.5) * 2,
  (Math.random() - 0.5) * 2,
  (Math.random() - 0.5) * 2,
  360
));

const boxTree = (new BoxTreeBuilder()).buildBoxTree(boxList);

export default {
  boxTree, boxList
};
