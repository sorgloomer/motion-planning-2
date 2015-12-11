import ObbTreeBuilder from '/experiments_new/collision/obb3/Obb3TreeBuilder';
import ObbTreeCollider from '/experiments_new/collision/obb3/Obb3TreeCollider';
import Configuration from '/experiments_new/experiment/piano3d/Piano3DConfig';
import Sim3 from '/math/Sim3';

export default class Sampler3D {
  constructor(model, builder = new ObbTreeBuilder()) {
    this.worldTree = builder.buildBoxTree(model.worldBoxes);
    this.agentTree = builder.buildBoxTree(model.agentBoxes);
    this.sim = Sim3.create();
    this.collider = new ObbTreeCollider();

    this.sampleCount = 0;
  }

  sample(config) {
    this.sampleCount++;
    Configuration.to_sim3(this.sim, config);
    return this.collider.collide(this.worldTree, this.agentTree, this.sim);
  }

  restart() {
    this.sampleCount = 0;
  }

  getSampleCount() {
    return this.sampleCount;
  }
}