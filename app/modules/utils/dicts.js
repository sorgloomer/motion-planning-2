
export class DefaultDict {
  constructor(values, def) {
    this.values = values;
    this.def = def;
  }
  get(key) {
    return this.values.has(key) ? this.values.get(key) : this.def;
  }
  set(key, val) {
    return this.values.set(key, val);
  }
  has(key) {
    return this.values.has(key);
  }
  delete(key) {
    return this.values.delete(key);
  }
};

function dict(obj) {
  const result = new Map();
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result.set(key, obj[key]);
    }
  }
  return result;
}

export function default_dict(def, obj) {
  return new DefaultDict(dict(obj), def);
}

