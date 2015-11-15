import BABYLON from '/shim/babylon';
import { quaternionSetSim } from '/graphics/Math';


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
  var pivot = new BABYLON.Mesh(name, scene);
  pivot.my_children = oboxes.map((box, i) => {
    const view = BABYLON.Mesh.CreateBox(
      name + "__" + i,
      {
        width: box.hsize[0] * 2,
        height: box.hsize[1] * 2,
        depth: box.hsize[2] * 2
      },
      scene);
    view.parent = pivot;
    applyTransform(view, box.transform);
    if (box_cb) box_cb(view, box, i);
    return view;
  });
  return pivot;
}

function meshFromOBoxTree(name, scene, treeRoot, renderLeaves = false, node_cb = null) {
  var i = 0;

  var pivot = new BABYLON.Mesh(name, scene);
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
      mesh.parent = pivot;
      applyTransform(mesh, node.obox.transform);
      if (node_cb) node_cb(mesh, node, i);
      children.push(mesh);
      m_tree_items.push({mesh, node});
    }
  }
  visit(treeRoot);
  pivot.my_children = children;
  pivot.my_clear = () => {
    m_tree_items.forEach(({node}) => node._hit = false);
  };
  pivot.my_update = () => {
    m_tree_items.forEach(({mesh, node}) => mesh.isVisible = node._hit);
  };
  return pivot;
}

export default {
  applyQuaternion,
  applyTranslation,
  applyTransform,
  meshFromOBoxList,
  meshFromOBoxTree
};
