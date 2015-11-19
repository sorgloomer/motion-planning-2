import BABYLON from '/shim/babylon';
import loaded from '/utils/loaded';
import lists from '/utils/lists';
import { DEG_TO_RAD, PI } from '/utils/math';
import Vec3 from '/math/Vec3';
import Sim3 from '/math/Sim3';
import Quat from '/math/Quat';
import QuatEtc from '/math/QuatEtc';
import MeshHelper from '/graphics/MeshHelper';
import DefinitionHelper from '/experiment/common/DefinitionHelper';

import DroneModel from '/experiment/drone/drone_boxes';
import BoxTreeCollider from '/collision/obb/ObbTreeCollider';
import BoxTreeBuilder from '/collision/obb/ObbTreeBuilder';

import Piano3DConfig from '/experiment/piano3d/configuration';
import Piano3DAction from '/experiment/piano3d/action';

import RrtVoronoi from '/planning/algorithm/RrtVoronoi';
import RrtInc from '/planning/algorithm/RrtInc';
import Prm from '/planning/algorithm/Prm';
import Drone1 from '/experiment/drone/drone1';

document.getElementById("main-area").addEventListener('click', () => {

});

const canvas = document.getElementById("render-canvas");

const engine = new BABYLON.Engine(canvas, true);

const ring2_boxes = DefinitionHelper.makeRing(
  3.5, 1, 16, Sim3.translateXYZ(Sim3.rotationX(PI / 2), 9, 5, 3)
);
const ring2_tree = (new BoxTreeBuilder()).buildBoxTree(ring2_boxes);


function flatten(arrs, result = []) {
    arrs.forEach(a => result.push(...a));
    return result;
}

function createScene(worldBoxes, agentBoxes) {
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

    var mesh_agent = MeshHelper.meshFromOBoxList('agent', scene, agentBoxes, m => m.material = mat_agent);

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

    const mesh_world = MeshHelper.meshFromOBoxList('world', scene, worldBoxes, b => b.material = mat_world);

    const shadowCasters = shadowGenerator.getShadowMap().renderList;
    allObjects.push(...mesh_agent.my_children);
    allObjects.push(...mesh_world.my_children);
    // allObjects.push(...flatten(mesh_key_items.map(m => m.my_children)));

    shadowCasters.push(...allObjects);


    /*
     const tree_agent = MeshHelper.meshFromOBoxTree('tree_agent', scene, ring2_tree, true, (mesh, node) => mesh.material = mat_wireframe);
     const tree_world = MeshHelper.meshFromOBoxTree('tree_world', scene, tree1, true, (mesh, node) => mesh.material = mat_wireframe);
     */

    [ground].concat(allObjects).forEach(m => { m.receiveShadows = true; });

    return { scene, mat_agent, mesh_world, mesh_agent, mat_wireframe };
}

var OPTIONS = self.OPTIONS = {
    solution_track: true,
    solution_keys: 10,
    time_keyframe: 400
};


function solutionLerpTo(toSim, tempConf, solution, time) {
    const integ = Math.floor(time);
    const frac = time - integ;
    const index = integ % (solution.path.length - 1);
    Piano3DConfig.lerpTo(tempConf, solution.path[index], solution.path[index + 1], frac);
    Piano3DConfig.to_sim(toSim, tempConf);
}

loaded(() => {
    const experiment = new Drone1();
    const scene = createScene(experiment.worldBoxes, experiment.agentBoxes);
    const solver = new RrtInc(experiment);

    const sim = Sim3.create();
    const conf = Piano3DConfig.create();

    const startTime = Date.now();
    var last_time = 0;
    var solution = null;

    function onSolution(sol) {
        solution = sol;

        const COUNT = 4;
        const FULL_TIME = solution.path.length - 1.0001;


        var mesh_key_root = new MeshHelper.CompoundMesh("mesh_key_root", scene.scene, lists.generate(COUNT, i => {
            const m = MeshHelper.meshFromOBoxList(
              'mesh_key_items_' + i, scene.scene, experiment.agentBoxes,
                m => {
                    m.material = scene.mat_wireframe;
                }
            );
            solutionLerpTo(sim, conf, solution, i * FULL_TIME / (COUNT - 1));
            MeshHelper.applyTransform(m, sim);
            return m;
        }));
    }

    engine.runRenderLoop(() => {
        const time = Date.now() - startTime;

        if (solver.hasSolution && !solution) onSolution(solver.getSolution());

        if (solution) {
            solutionLerpTo(sim, conf, solution, time / OPTIONS.time_keyframe);
            MeshHelper.applyTransform(scene.mesh_agent, sim);
        } else {
            solver.iterate(20);

            if (solver.lastPut) {
                Piano3DConfig.to_sim(sim, solver.lastPut);
                MeshHelper.applyTransform(scene.mesh_agent, sim);
            }
        }
        scene.scene.render();
    });
});
