/**
 * Created by Hege on 2015.11.23..
 */
import { default_dict } from '/utils/dicts';

import RrtVoronoi from '/planning/algorithm/RrtVoronoi';
import RrtInc from '/planning/algorithm/RrtInc';
import Prm from '/planning/algorithm/Prm';

export const ALGORITHMS = default_dict(RrtVoronoi, {
  prm: Prm,
  rrt_voronoi: RrtVoronoi,
  rrt_inc: RrtInc
});