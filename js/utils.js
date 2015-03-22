var utils = (function() {
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

  return {
    times: times,
    range: range,
    nvl: nvl
  };
})();