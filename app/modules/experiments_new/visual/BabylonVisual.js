import Config from '/entry/Config';
import BABYLON from '/shim/babylon';
import { DEG_TO_RAD, PI } from '/utils/math';
import MeshHelper from '/graphics/MeshHelper';
import Sim3 from '/math/Sim3';

class ExperimentScene {
  constructor(scene, mat_agent, mesh_world, mesh_agent, mat_wireframe) {
    this.scene = scene;
    this.mat_agent = mat_agent;
    this.mesh_world = mesh_world;
    this.mesh_agent = mesh_agent;
    this.mat_wireframe = mat_wireframe;
    this.agent_keyframes = null;
  }

  addKeyAgents(sims, model) {
    this.agent_keyframes = new MeshHelper.CompoundMesh("agent_keyframes", this.scene, sims.map((sim, index) => {
      const m = MeshHelper.meshFromOBoxList(
        'agent_keyframes_items_' + index,
        this.scene,
        model.agentBoxes, m => {
          m.material = this.mat_wireframe;
        }
      );
      MeshHelper.applyTransform(m, sim);
      return m;
    }));
  }

  dispose() {
    this.scene.dispose();
  }
}


function createScene(canvas, engine, model, experiment) {
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.7, 0.9, 1);
  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 4, -8), scene);
  camera.speed = 0.4;
  camera.minZ = 1;
  camera.maxZ = 1000;
  camera.fov = 100 * DEG_TO_RAD;
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, false);

  var light_dir = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
  light_dir.position = new BABYLON.Vector3(20, 40, 20);
  light_dir.intensity = .5;
  var light_sphere = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
  light_sphere.intensity = .3;
  light_sphere.diffuse = new BABYLON.Color3(0.95, 0.95, 0.95);
  light_sphere.specular = new BABYLON.Color3(0, 0, 0);
  light_sphere.groundColor = new BABYLON.Color3(0.5, 0.5, 0.5);


  var mat_agent = new BABYLON.StandardMaterial('mat_agent', scene);
  mat_agent.diffuseColor = new BABYLON.Color3(0.6, 0.9, 0.6);
  mat_agent.specularColor = new BABYLON.Color3(0, 0, 0);

  var mat_wireframe = new BABYLON.StandardMaterial("mat_wireframe", scene);
  mat_wireframe.diffuseColor = new BABYLON.Color3(1, 0.2, 0.2);
  mat_wireframe.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  mat_wireframe.wireframe = true;


  var mat_world = new BABYLON.StandardMaterial("mat_world", scene);
  mat_world.diffuseColor = new BABYLON.Color3(0.8, 0.6, 0.6);
  mat_world.specularColor = new BABYLON.Color3(0, 0, 0);
  var mat_ground = new BABYLON.StandardMaterial("mat_ground", scene);
  mat_ground.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
  mat_ground.specularColor = new BABYLON.Color3(0, 0, 0);

  var mesh_agent = MeshHelper.meshFromOBoxList('agent', scene, model.agentBoxes, m => m.material = mat_agent);

  // Skybox
  var skybox = BABYLON.Mesh.CreateBox("skyBox", 500.0, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("tex/skybox/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.disableLighting = true;
  skybox.infiniteDistance = true;
  skybox.material = skyboxMaterial;

  var ground = BABYLON.Mesh.CreateGround("ground", 30, 30, 2, scene);
  ground.position.y = -5;
  ground.material = mat_ground;

  var shadowGenerator = new BABYLON.ShadowGenerator(1024, light_dir);
  shadowGenerator.usePoissonSampling = true;

  const allObjects = [];

  const mesh_world = MeshHelper.meshFromOBoxList('world', scene, model.worldBoxes, b => b.material = mat_world);

  const shadowCasters = shadowGenerator.getShadowMap().renderList;
  allObjects.push(...mesh_agent.my_children);
  allObjects.push(...mesh_world.my_children);
  // allObjects.push(...flatten(mesh_key_items.map(m => m.my_children)));

  shadowCasters.push(...allObjects);


  var tree_world = null;
  if (Config.SHOW3D_TREE_PART) {
    tree_world = MeshHelper.meshFromOBoxTreePart(
      'tree_world', scene,
      experiment.sampler.worldTree,
      true,
      (mesh, node) => mesh.material = mat_wireframe);
  }
  /*
   const tree_agent = MeshHelper.meshFromOBoxTree('tree_agent', scene, ring2_tree, true, (mesh, node) => mesh.material = mat_wireframe);
   */

  [ground].concat(allObjects).forEach(m => { m.receiveShadows = true; });

  return new ExperimentScene(scene, mat_agent, mesh_world, mesh_agent, mat_wireframe);
}
export default class BabylonVisual {
  constructor(canvas, experiment) {
    this.canvas = canvas;
    this.experiment = experiment;
    this.scene = null;
    this.engine = null;
    this.startTime = 0;
    this.temp_sim = Sim3.create();
    this.solution_loop_time = 7500;
  }

  init(timestamp) {
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = createScene(
      this.canvas, this.engine,
      this.experiment.model,
      this.experiment);
    this.startTime = timestamp;
  }
  run(fn) {
    this.engine.runRenderLoop(fn);
  }

  dispose() {
    this.scene.dispose();
    this.engine.dispose();
    this.scene = null;
    this.engine = null;
  }

  _preprocess_render(model, time) {
    if (model.has_solution) {
      if (!this.scene.agent_keyframes) {
        this.scene.addKeyAgents(model.solution_keyframes, this.experiment.model);
      }
      model.solutionLerpTo(this.temp_sim, time * 0.001);
      MeshHelper.applyTransform(this.scene.mesh_agent, this.temp_sim);
    } else {
      MeshHelper.applyTransform(this.scene.mesh_agent, model.agent_transform);
    }
  }
  _do_render(model, time) {
    this.scene.scene.render();
  }
  render(model, timestamp) {
    const time = timestamp - this.startTime;
    this._preprocess_render(model, time);
    this._do_render(model, time);
  }
}