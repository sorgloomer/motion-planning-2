class Measurement {
  constructor(time = 0, samples = 0, storage = 0, cost = 0, timeout = false) {
    this.time = time;
    this.samples = samples;
    this.storage = storage;
    this.cost = cost;
    this.timeout = timeout;
  }
}

class MeasuringProcess {
  constructor(parent) {
    this.parent = parent;
    this.started = 0;
    this.finished = 0;
    this.total_time = 0;
    this.state = 0;
    this.measurement = null;
  }

  start() {
    if (this.state === 0) {
      this.started = performance.now();
      this.state = 1;
    } else {
      console.warn('MeasuringProcess.start: invalid state');
    }
  }

  _end(msg, newstate, timeout) {
    if (this.state === 1) {
      this.finished = performance.now();
      this.state = newstate;
      const returnedCbInfo = this.parent.cbInfo();
      this.total_time = this._finish_timespan();
      this.measurement = new Measurement(
        this.total_time,
        returnedCbInfo.samples,
        returnedCbInfo.storage,
        returnedCbInfo.cost,
        timeout
      );
      this.parent.data.push(this.measurement);
      return this.measurement;
    } else {
      console.warn('MeasuringProcess.' + msg + ': invalid state');
    }
  }
  end() {
    return this._end('end', 2, false);
  }

  timespan() {
    return (performance.now() - this.started) * 0.001;
  }
  _finish_timespan() {
    return (this.finished - this.started) * 0.001;
  }
  inspectTo(data) {
    if (this.measurement) {
      data.time = this.total_time;
      data.samples = this.measurement.samples;
      data.storage = this.measurement.storage;
    } else {
      const returnedCbInfo = this.parent.cbInfo();
      data.time = this.timespan();
      data.samples = returnedCbInfo.samples;
      data.storage = returnedCbInfo.storage;
    }
  }

  endTimeout() {
    return this._end('endTimeout', 3, true);
  }
}

export default class MeasureHelper {
  constructor(cbInfo) {
    this.data = [];
    this.cbInfo = cbInfo;
  }
  start() {
    var result = new MeasuringProcess(this);
    result.start();
    return result;
  }
}