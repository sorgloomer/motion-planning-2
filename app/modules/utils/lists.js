
const {min, max} = Math;

function generate(n, cb) {
  for (var i = 0, r = []; i < n; i++) r.push(cb(i));
  return r;
}

function selectAggregate(list, selector, aggregate, def = 0) {
  if (list.length < 1) return def;
  var r = selector(list[0]);
  for (var i = 1; i < list.length; i++) {
    r = aggregate(r, selector(list[i]));
  }
  return r;
}

function selectMin(list, selector, def = 0) {
  return selectAggregate(list, selector, min, def);
}

function selectMax(list, selector, def = 0) {
  return selectAggregate(list, selector, max, def);
}

function aggregateBy(list, selector, aggregatePred, def) {
  if (list.length < 1) return def;
  var best_value = list[0];
  var best_score = selector(best_value);
  for (var i = 1; i < list.length; i++) {
    var c_value = list[i];
    var c_score = selector(c_value);
    if (aggregatePred(c_score, best_score)) {
      best_score = c_score;
      best_value = c_value;
    }
  }
  return best_value;
}

function firstLarger(a, b) {
  return a > b;
}
function firstSmaller(a, b) {
  return a < b;
}

function minBy(list, selector, def = 0) {
  return aggregateBy(list, selector, firstSmaller, def);
}
function maxBy(list, selector, def = 0) {
  return aggregateBy(list, selector, firstLarger, def);
}

function KeyValue(key, value) {
  this.key = key;
  this.value = value;
}

function sortedBy(list, selector) {
  return list.map(i => new KeyValue(selector(i), i)).sort((a, b) => a.key - b.key).map(i => i.value);
}

export default {
  generate,

  selectAggregate,
  selectMin,
  selectMax,
  sortedBy,

  firstLarger,
  firstSmaller,
  minBy,
  maxBy
};
