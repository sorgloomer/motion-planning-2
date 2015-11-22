import ObbTreeBuilder from '/collision/obb/ObbTreeBuilder';
import ObbTreeCollider from '/collision/obb/ObbTreeCollider';
import Configuration from '/experiment/piano3d/Piano3DConfig';
import Sim3 from '/math/Sim3';

export default function make_sampler(model) {
  var builder = new ObbTreeBuilder();
  var worldTree = builder.buildBoxTree(model.worldBoxes);
  var agentTree = builder.buildBoxTree(model.agentBoxes);
  var sim = Sim3.create();
  var collider = new ObbTreeCollider();

  return function sampler(config) {
    Configuration.to_sim3(sim, config);
    return collider.collide(worldTree, agentTree, sim);
  };
};