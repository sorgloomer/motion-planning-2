/**
 * Created by Hege on 2015.11.23..
 */
function range(cnt, fn) {
  var a = new Array(cnt);
  for (var i = 0; i < cnt; i++) a[i] = fn(i);
  return a;
}
function times(cnt, x) {
  var a = new Array(cnt);
  for (var i = 0; i < cnt; i++) a[i] = x;
  return a;
}

function nvl(x, y) {
  return (x !== undefined) ? x : y;
}
export default { range, times, nvl };