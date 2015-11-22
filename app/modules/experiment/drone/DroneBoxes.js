import { OBox_makePlacement as box } from '/experiment/common/DefinitionHelper';
import BoxTreeBuilder from '/collision/obb/ObbTreeBuilder';
import lists from '/utils/lists';

const boxList = [
  box(  1,  0.3,   1, 0, 0, 0, 0, 1, 0, 0),
  box(  4, 0.05, 0.2, 0, 0, 0, 0, 1, 0, 45),
  box(  4, 0.05, 0.2, 0, 0, 0, 0, 1, 0, -45),

  box(  1, 0.04,   1,  1.4, 0.045,  1.4, 0, 1, 0, 0),
  box(  1, 0.04,   1, -1.4, 0.045,  1.4, 0, 1, 0, 0),
  box(  1, 0.04,   1, -1.4, 0.045, -1.4, 0, 1, 0, 0),
  box(  1, 0.04,   1,  1.4, 0.045, -1.4, 0, 1, 0, 0)
];

const boxTree = (new BoxTreeBuilder()).buildBoxTree(boxList);

export default {
  boxTree, boxList
};
