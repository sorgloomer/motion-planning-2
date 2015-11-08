import BABYLON from '/shim/babylon';
import loaded from '/utils/loaded';
import { DEG_TO_RAD, PI } from '/utils/math';

document.getElementById("main-area").addEventListener('click', () => {

});

const canvas = document.getElementById("render-canvas");

const engine = new BABYLON.Engine(canvas, true);


function buildCopterMaterial(name, scene) {
    var mat = new BABYLON.StandardMaterial(name, scene);
    mat.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    mat.specularColor = new BABYLON.Color3(0, 0, 0);
    return mat;
}

function buildCopter(name, material, scene) {

    var pivot = new BABYLON.Mesh(name, scene);
    var body = BABYLON.Mesh.CreateBox(name + "__body", { width: 1, depth: 1, height: 0.3 }, scene);
    const hbody = 0.15;
    body.parent = pivot;
    body.position.y = hbody;

    var cross1 = BABYLON.Mesh.CreateBox(name + "__cross1", { width: 4, depth: 0.2, height: 0.05 }, scene);
    cross1.parent = body;
    cross1.rotation.y = PI / 4;
    cross1.position.y = hbody;

    var cross2 = BABYLON.Mesh.CreateBox(name + "__cross2", { width: 4, depth: 0.2, height: 0.05 }, scene);
    cross2.parent = body;
    cross2.rotation.y = -PI / 4;
    cross2.position.y = hbody;

    var prop1 = BABYLON.Mesh.CreateBox(name + '__prop1', { width: 1, depth: 1, height: 0.04 }, scene);
    prop1.parent = body;
    prop1.position.x = 1.4;
    prop1.position.z = 1.4;
    prop1.position.y = 0.045 + hbody;

    var prop2 = BABYLON.Mesh.CreateBox(name + '__prop2', { width: 1, depth: 1, height: 0.04 }, scene);
    prop2.parent = body;
    prop2.position.x = -1.4;
    prop2.position.z = 1.4;
    prop2.position.y = 0.045 + hbody;

    var prop3 = BABYLON.Mesh.CreateBox(name + '__prop3', { width: 1, depth: 1, height: 0.04 }, scene);
    prop3.parent = body;
    prop3.position.x = 1.4;
    prop3.position.z = -1.4;
    prop3.position.y = 0.045 + hbody;

    var prop4 = BABYLON.Mesh.CreateBox(name + '__prop4', { width: 1, depth: 1, height: 0.04 }, scene);
    prop4.parent = body;
    prop4.position.x = -1.4;
    prop4.position.z = -1.4;
    prop4.position.y = 0.045 + hbody;

    const children = [body, cross1, cross2, prop1, prop2, prop3, prop4];
    children.forEach(c => { c.material = material; });
    pivot.my_children = children;


    return pivot;
}


function pushAll(arr, items) {
    arr.push(...items);
}
function createScene() {
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
    var copter1 = buildCopter('copter1', mat_copter, scene);
    copter1.position.y = 0.8;

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

    var ring1 = BABYLON.Mesh.CreateTorus('ring1', 7, 1, 32, scene);
    ring1.material = ring_mat;
    ring1.position = new BABYLON.Vector3(9, 5, 1);
    ring1.rotation.x = PI/2;
    var ring2 = BABYLON.Mesh.CreateTorus('ring2', 7, 1, 32, scene);
    ring2.material = ring_mat;
    ring2.position = new BABYLON.Vector3(9, 5, -1);
    ring2.rotation.x = PI/2;


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

    const shadowCasters = shadowGenerator.getShadowMap().renderList;
    const allObjects = [ring1, ring2, platform].concat(copter1.my_children);
    pushAll(shadowCasters, allObjects);

    [ground].concat(allObjects).forEach(m => { m.receiveShadows = true; });



    return { scene, copter1, mat_copter, ring1, ring2 };
}

loaded(() => {
    const scene = createScene();
    const startTime = Date.now();
    engine.runRenderLoop(() => {
        const time = Date.now() - startTime;

        scene.copter1.position.x = 6 + 6 * Math.sin(time * 0.001);
        scene.copter1.position.y = 6 + 4 * Math.cos(time * 0.000177);
        scene.mat_copter.diffuseColor.r = scene.copter1.my_children[1].intersectsMesh(scene.ring1, true) ? 1 : 0;

        scene.scene.render();
    });
});

