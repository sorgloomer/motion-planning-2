import BABYLON from '/shim/babylon';
import loaded from '/utils/loaded';

document.getElementById("main-area").addEventListener('click', () => {

});

const canvas = document.getElementById("render-canvas");

const engine = new BABYLON.Engine(canvas, true);

function createScene() {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 1, 0);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false);
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = .5;
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    sphere.position.y = 1;
    var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
    return scene;
}

loaded(() => {
    var scene = createScene();
    engine.runRenderLoop(() => { scene.render(); });
});

