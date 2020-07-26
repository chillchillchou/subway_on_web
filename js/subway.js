let light;
let fillLight;
let backLight;
let dirLight;


function getScene() {
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);
  return scene;
}

/**
 * Generate the camera to be used in the scene. Camera args:
 *   [0] field of view: identifies the portion of the scene
 *     visible at any time (in degrees)
 *   [1] aspect ratio: identifies the aspect ratio of the
 *     scene in width/height
 *   [2] near clipping plane: objects closer than the near
 *     clipping plane are culled from the scene
 *   [3] far clipping plane: objects farther than the far
 *     clipping plane are culled from the scene
 **/

function getCamera() {
  var aspectRatio = window.innerWidth / window.innerHeight;
  var camera = new THREE.PerspectiveCamera(50, 1.481073, 0.01, 10000);
  camera.position.set(-662, 212, -3);

  // console.log(camera.rotation)
  return camera;

}

/**
 * Generate the light to be used in the scene. Light args:
 *   [0]: Hexadecimal color of the light
 *   [1]: Numeric value of the light's strength/intensity
 *   [2]: The distance from the light where the intensity is 0
 * @param {obj} scene: the current scene object
 **/

function getLight() {
  light = new THREE.PointLight(0xffffff, 1, 0);
  light.position.set(1, 1, 1);
  scene.add(light);

  dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(848, -3955, -1749);
  dirLight.position.multiplyScalar(50);
  scene.add(dirLight);
  dirLight.castShadow = true;
  dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024 * 2;

  dirLight.shadowCameraFar = 3500;
  dirLight.shadowBias = -0.000001;
  dirLight.shadowDarkness = 0.35;
  scene.add(dirLight);

  //tyis is the amibient light
  let ambientLight = new THREE.AmbientLight(0x111111, 5.5);
  // ambientLight.position.set(2100, 20000, 6000);
  scene.add(ambientLight);

  //this is the fill light
  fillLight = new THREE.DirectionalLight(0x111111, 1.2);
  fillLight.position.set(100, 0, -9900);
  scene.add(fillLight);

  //this is the back light
  backLight = new THREE.DirectionalLight(0xffffff, 1.5);
  backLight.position.set(-3072, 4868, 2000).normalize();
  scene.add(backLight);

  // light.castShadow = true;
  // light.shadow.camera.near = 0.1;
  // light.shadow.camera.far = 500;



  //this is the fog
  // scene.fog = new THREE.Fog(0xdedede, 100, 80000);
  // renderer.setClearColor(scene.fog.color, 1);
}

/**
 * Generate the renderer to be used in the scene
 **/

function getRenderer() {
  // Create the canvas with a renderer
  var renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  // Add support for retina displays
  renderer.setPixelRatio(window.devicePixelRatio);
  // Specify the size of the canvas
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Add the canvas to the DOM
  document.body.appendChild(renderer.domElement);
  return renderer;
}

/**
 * Generate the controls to be used in the scene
 * @param {obj} camera: the three.js camera for the scene
 * @param {obj} renderer: the three.js renderer for the scene
 **/
//
// function getControls(camera, renderer) {
//   var controls = new THREE.TrackballControls(camera, renderer.domElement);
//   controls.zoomSpeed = 0.4;
//   controls.panSpeed = 0.4;
//   return controls;
// }



/**
 * Load Nimrud model
 **/

function loadModel() {
  var loader = new THREE.GLTFLoader();
  loader.load('/models/train.glb', function(gltf) {
    // object.rotation.z = Math.PI;
    scene.add(gltf.scene);
    document.querySelector('h1').style.display = 'none';
  }, undefined, function(error) {
    console.error(error);
  });
}

function addControl() {

  let gui = new dat.GUI();
  let mainLightPosition = gui.addFolder('Lights');
  mainLightPosition
    .add(light.position, 'x', -1000, 1000)
    .name('PositionX')
    .listen();
  mainLightPosition
    .add(light.position, 'y', -1000, 1000)
    .name('PositionY')
    .listen();
  mainLightPosition
    .add(light.position, 'z', -1000, 1000)
    .name('PositionZ')
    .listen();
  let fillLightControl = gui.addFolder('Fill light');
  fillLightControl
    .add(fillLight.position, 'x', -1000, 1000)
    .name('PositionX')
    .listen();
  fillLightControl
    .add(fillLight.position, 'y', -1000, 1000)
    .name('PositionY')
    .listen();
  fillLightControl
    .add(fillLight.position, 'z', -1000, 1000)
    .name('PositionZ')
    .listen();

  mainLightPosition.open();
  fillLightControl.open();

}
/**
 * Render!
 **/

function render() {

  requestAnimationFrame(render);
  renderer.render(scene, camera);
  console.log(camera.position);

  controls.update();
};

var scene = getScene();
var camera = getCamera();

var renderer = getRenderer();
var controls = new THREE.OrbitControls(camera);
controls.rotateSpeed = 0.1;
controls.zoomSpeed = 0.4;

controls.minDistance = 3;
controls.maxDistance = Infinity;

controls.minPolarAngle = 0; // radians
controls.maxPolarAngle = Math.PI / 2; // radians

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.target.set(0, 120, 0);

loadModel()
getLight();
addControl()
render();
