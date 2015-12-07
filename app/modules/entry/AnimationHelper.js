/**
 * Created by Hege on 2015.12.07..
 */
function _bin_search(items, selector, value, left, right) {
  for (;;) {
    if (left > right) return right;
    const midi = Math.floor((left + right) / 2);
    const midval = selector(items[midi]);
    if (value >= midval) {
      left = midi + 1;
    } else {
      right = midi - 1;
    }
  }
}
function time_bin_search(items, time) {
  return _bin_search(items, x => x.cost, time, 0, items.length - 1);
}


function clamp_to_index(i, arr) {
  return Math.max(0, Math.min(i, arr.length - 1));
}
function process_animation_at(to_config, animT, solution, MyConfigSpace) {
  var solution_path = solution.path;
  var anim_index = time_bin_search(solution_path, animT);
  var anim_index0 = clamp_to_index(anim_index, solution_path);
  var anim_index1 = clamp_to_index(anim_index + 1, solution_path);
  var p0 = solution_path[anim_index0];
  var p1 = solution_path[anim_index1];

  if (p1.cost > p0.cost) {
    MyConfigSpace.lerpTo(to_config, p0.config, p1.config, (animT - p0.cost) / (p1.cost - p0.cost));
  } else {
    MyConfigSpace.copyTo(to_config, p0.config);
  }
}

function process_animation(to_config, animationTotal, solution, MyConfigSpace) {
  var animT = Math.min((Date.now() * 0.002) % (animationTotal + 2), animationTotal);
  return process_animation_at(to_config, animT, solution, MyConfigSpace);
}

export default {
  time_bin_search, process_animation, process_animation_at
};