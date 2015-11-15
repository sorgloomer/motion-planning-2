import BABYLON from '/shim/babylon';
import loaded from '/utils/loaded';
import { DEG_TO_RAD, PI } from '/utils/math';
import Sim3 from '/math/Sim3';
import Quat from '/math/Quat';
import QuatEtc from '/math/QuatEtc';
import MeshHelper from '/graphics/MeshHelper';
import DefinitionHelper from '/experiment/common/DefinitionHelper';

import DroneModel from '/experiment/drone/common/drone_boxes';
import BoxTreeCollider from '/collision/BoxTreeCollider';
import BoxTreeBuilder from '/collision/BoxTreeBuilder';

document.getElementById("main-area").addEventListener('click', () => {

});

const canvas = document.getElementById("render-canvas");

const engine = new BABYLON.Engine(canvas, true);

const ring2_boxes = DefinitionHelper.makeRing(
  3.5, 1, 16, Sim3.translateXYZ(Sim3.rotationX(PI / 2), 9, 5, 3)
);
const ring2_tree = (new BoxTreeBuilder()).buildBoxTree(ring2_boxes);



function buildCopterMaterial(name, scene) {
    var mat = new BABYLON.StandardMaterial(name, scene);
    mat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    mat.specularColor = new BABYLON.Color3(0, 0, 0);
    return mat;
}

function pushAll(arr, items) {
    arr.push(...items);
}
function createScene(oboxes, tree1) {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.7, 0.9, 1);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 2, -4), scene);
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

    var mat_copter = buildCopterMaterial('mat_copter', scene);

    var boxes1 = MeshHelper.meshFromOBoxList('boxes1', scene, oboxes, m => m.material = mat_copter);

    /*
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
    */

    var ring_mat = new BABYLON.StandardMaterial("walls", scene);
    ring_mat.diffuseColor = new BABYLON.Color3(1, 0.2, 0.2);
    ring_mat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);

    var mat_wireframe = new BABYLON.StandardMaterial("mat_wireframe", scene);
    mat_wireframe.diffuseColor = new BABYLON.Color3(1, 0.2, 0.2);
    mat_wireframe.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    mat_wireframe.wireframe = true;



    var ring1 = BABYLON.Mesh.CreateTorus('ring1', 7, 1, 32, scene);
    ring1.material = ring_mat;
    ring1.position = new BABYLON.Vector3(19, 5, 1);
    ring1.rotation.x = PI/2;


    var platform_mat = new BABYLON.StandardMaterial("platform", scene);
    platform_mat.diffuseColor = new BABYLON.Color3(0.5, 1, 0.5);
    platform_mat.specularColor = new BABYLON.Color3(0, 0, 0);
    var platform = BABYLON.Mesh.CreateBox("platform", { width: 4, depth: 4, height: 1 }, scene);
    platform.material = platform_mat;

    var walls_mat = new BABYLON.StandardMaterial("walls", scene);
    walls_mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
    walls_mat.specularColor = new BABYLON.Color3(0, 0, 0);


    var ground = BABYLON.Mesh.CreateGround("ground1", 30, 30, 2, scene);
    ground.material = walls_mat;

    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light_dir);
    shadowGenerator.usePoissonSampling = true;

    const allObjects = [];


    const ring2 = MeshHelper.meshFromOBoxList('ring2', scene, ring2_boxes, b => b.material = ring_mat && null);

    const shadowCasters = shadowGenerator.getShadowMap().renderList;
    allObjects.push(ring1, platform);
    allObjects.push(...boxes1.my_children);
    allObjects.push(...ring2.my_children);

    pushAll(shadowCasters, allObjects);


    const m_tree1 = MeshHelper.meshFromOBoxTree('m_tree1', scene, ring2_tree, true, (mesh, node) => mesh.material = mat_wireframe);
    const m_tree2 = MeshHelper.meshFromOBoxTree('m_tree2', scene, tree1, true, (mesh, node) => mesh.material = mat_wireframe);


    /*
    boxes1.position.y = 4;
    m_tree1.position.y = 4;
    */
    [ground].concat(allObjects).forEach(m => { m.receiveShadows = true; });

    return { scene, mat_copter, ring1, ring2_boxes, boxes1, m_tree1, m_tree2 };
}

loaded(() => {


    const scene = createScene(DroneModel.boxList, DroneModel.boxTree);
    const sim = Sim3.create();
    const quat = Quat.create();
    const quat2 = Quat.create();
    const collider = new BoxTreeCollider();

    const startTime = Date.now();
    engine.runRenderLoop(() => {
        const time = Date.now() - startTime;


        Quat.setEulerXYZ(quat2, 0.3, 0, 0);
        Quat.setEulerXYZ(quat, 0, 3.9 + 0.0007*time, 0);
        Quat.mulTo(quat, quat, quat2);
        QuatEtc.transformQXYZ(sim, quat, 6, 5, 0.9);

        MeshHelper.applyTransform(scene.boxes1, sim);
        MeshHelper.applyTransform(scene.m_tree2, sim);

        scene.m_tree1.my_clear();
        scene.m_tree2.my_clear();
        collider._hit_coins = -1;//Math.floor(time * 0.001) % 12;
        scene.mat_copter.diffuseColor.r = collider.collide(ring2_tree, DroneModel.boxTree, sim) ? 1 : 0;

        scene.m_tree1.my_update();
        scene.m_tree2.my_update();


        scene.scene.render();
    });
});

