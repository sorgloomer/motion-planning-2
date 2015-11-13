export default class OBox {
  constructor() {
    this._buffer = new Float32Array(15);
    this.hsize = this._buffer.subarray(0, 3);
    this.transform = this._buffer.subarray(3, 15);
  }
  volume() {
    return 8 * this.hsize[0] * this.hsize[1] * this.hsize[2];
  }
  set(other) {
    this._buffer.set(other._buffer, 0);
  }
  clone() {
    const r = new OBox();
    r.set(this);
    return r;
  }
}
