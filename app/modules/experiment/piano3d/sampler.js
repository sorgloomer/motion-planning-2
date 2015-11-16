import ObbTreeBuilder from '/collision/obb/ObbTreeBuilder';
import ObbTreeCollider from '/collision/obb/ObbTreeCollider';
import Configuration from '/experiment/piano3d/configuration';
import Sim3 from '/math/Sim3';

export default function make_sampler(agentBoxes, worldBoxes) {
  var builder = new ObbTreeBuilder();
  var worldTree = builder.buildBoxTree(worldBoxes);
  var agentTree = builder.buildBoxTree(agentBoxes);
  var sim = Sim3.create();
  var collider = new ObbTreeCollider();

  return function sampler(config) {
    Configuration.to_sim(sim, config);
    return collider.collide(worldTree, agentTree, sim);
  };
};