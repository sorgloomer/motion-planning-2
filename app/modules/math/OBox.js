import Sim3 from '/mat/Sim3';
import Vec3 from '/mat/Vec3';

export default class OBox {
  constructor() {
    this._buffer = new Float32Array(16);
    this.hsize = this._buffer.subarray(0, 3);
    this.transform = this._buffer.subarray(3, 16);
    this.radius = 0;
  }
  set(other) {
    this._buffer.set(other._buffer, 0);
    this.radius = other.radius;
  }
  updateRadius() {
    return this.radius = Vec3.len(this.hsize);
  }
}
