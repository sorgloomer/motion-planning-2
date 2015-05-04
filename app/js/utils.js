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


  function updateArray(dest, source, def, param) {
    var i, source_length = source ? source.length : 0;
    if (dest.length > source_length) {
      for (i = dest.length; i < source_length; i++) {
        def.remove(dest[i], param);
      }
      dest.length = source_length;
    } else if (dest.length < source_length) {
      i = dest.length;
      dest.length = source_length;
      for (; i < dest.length; i++) {
        dest[i] = def.create(source[i], param);
      }
    }
    for (i = 0; i < dest.length; i++) {
      def.update(dest[i], source[i], param);
    }
  }

  return {
    times: times,
    range: range,
    nvl: nvl,
    updateArray: updateArray
  };
})();