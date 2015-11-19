import BABYLON from '/shim/babylon';
import { quaternionSetSim } from '/graphics/Math';

class CompoundMesh extends BABYLON.Mesh {
  constructor(name, scene, children) {
    super(name, scene);
    this.my_children = children;
    children.forEach(c => c.parent = this);
  }
  my_traverse(cb) {
    cb(this, false);
    this.my_children.forEach(m => {
      if (m.my_traverse) {
        m.my_traverse(cb);
      } else {
        cb(m, true);
      }
    });
  }
}



function applyQuaternion(mesh, q) {
  const quat = mesh.rotationQuaternion || (mesh.rotationQuaternion = new BABYLON.Quaternion());
  quat.w = q[0];
  quat.x = q[1];
  quat.y = q[2];
  quat.z = q[3];
  return mesh;
}
function applyTranslation(mesh, v) {
  const pos = mesh.position;
  pos.x = v[0];
  pos.y = v[1];
  pos.z = v[2];
  return mesh;
}

function applyTransform(mesh, sim) {
  const pos = mesh.position;
  pos.x = sim[9];
  pos.y = sim[10];
  pos.z = sim[11];
  const quat = mesh.rotationQuaternion || (mesh.rotationQuaternion = new BABYLON.Quaternion());
  quaternionSetSim(quat, sim);
  return mesh;
}

function meshFromOBoxList(name, scene, oboxes, box_cb = null) {
  return new CompoundMesh(name, scene, oboxes.map((box, i) => {
    const view = BABYLON.Mesh.CreateBox(
      name + "__" + i,
      {
        width: box.hsize[0] * 2,
        height: box.hsize[1] * 2,
        depth: box.hsize[2] * 2
      },
      scene);
    applyTransform(view, box.transform);
    if (box_cb) box_cb(view, box, i);
    return view;
  }));
}

function meshFromOBoxTree(name, scene, treeRoot, renderLeaves = false, node_cb = null) {
  var i = 0;

  var children = [];

  const m_tree_items = [];


  function visit(node) {
    if (node.children) {
      node.children.forEach(visit);
    }

    if (node.children || renderLeaves) {
      const box = node.obox;
      const mesh = BABYLON.Mesh.CreateBox(
        name + "__" + (i++),
        {
          width: box.hsize[0] * 2,
          height: box.hsize[1] * 2,
          depth: box.hsize[2] * 2
        },
        scene);
      applyTransform(mesh, node.obox.transform);
      if (node_cb) node_cb(mesh, node, i);
      children.push(mesh);
      m_tree_items.push({mesh, node});
    }
  }
  visit(treeRoot);

  const pivot = new CompoundMesh(name, scene, children);
  pivot.my_clear = () => {
    m_tree_items.forEach(({node}) => node._hit = false);
  };
  pivot.my_update = () => {
    m_tree_items.forEach(({mesh, node}) => mesh.isVisible = node._hit);
  };
  return pivot;
}

export default {
  CompoundMesh,

  applyQuaternion,
  applyTranslation,
  applyTransform,
  meshFromOBoxList,
  meshFromOBoxTree
};
