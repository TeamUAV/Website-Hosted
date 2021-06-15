import * as THREE from "./dependencies/build/three.module.js";

import { OrbitControls } from "./dependencies/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "./dependencies/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "./dependencies/examples/jsm/loaders/GLTFLoader.js";

let camera, scene, renderer;

const clock = new THREE.Clock();

let mixer;
let obj;

init("UAV2.fbx");
animate();

function init(args) {
  const container = document.querySelector("#threejs-container");
  camera = new THREE.PerspectiveCamera(
    60,
    700/650,// aspect ratio, that matches the size of renderer
    1,
    3000
  );
  camera.position.set(400, 200, 200);



  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xff707070);
  scene.fog = new THREE.Fog(0x808080, 500, 3500);

  const hemiLight = new THREE.HemisphereLight(0xffffffff, 5);
  hemiLight.position.set(0, 3000, 0);
  scene.add(hemiLight);


  const dir_1 = new THREE.DirectionalLight(0xffffff, 3);
  dir_1.position.set(3.4, 1.4, 7);

  const dir_2 = new THREE.DirectionalLight(0xffffff, 1);
  dir_2.position.set(1.7 , -2.5, 4.3);

  const dir_3 = new THREE.DirectionalLight(0xffffff, 2);
  dir_3.position.set(-3.9 , 1.4, 6.8);

  const dir_4 = new THREE.HemisphereLight(0xffffff, 2);
  dir_4.position.set(0 , -1.4, 0);

  scene.add(dir_1);
  scene.add(dir_2);
  scene.add(dir_3);
  scene.add(dir_4);

  const axishelper = new THREE.AxesHelper(500);
  scene.add(axishelper);

  const geometry = new THREE.PlaneGeometry( 10000, 10000 );
  const material = new THREE.MeshBasicMaterial( {color: 0x999999, side: THREE.DoubleSide} );
  const plane = new THREE.Mesh( geometry, material );
  plane.rotation.x = Math.PI/2;
  scene.add( plane );

  const grid = new THREE.GridHelper(5000, 20, 0x000000, 0x000000);
  grid.material.opacity = 0.2;
  grid.material.transparent = true;
  scene.add(grid);

  // model
  const loader = new FBXLoader();
  loader.load(args, function (object) {
    obj = object;
    object.rotateY( - Math.PI / 2 );
    object.rotateX( - Math.PI / 2 );
    object.position.set(0, 25, 0);
    mixer = new THREE.AnimationMixer(object);

    const action = mixer.clipAction(object.animations[0]);
    action.play();

    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(object);
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(700, 650);
  renderer.shadowMap.enabled = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 100, 0);
  controls.update();

}



function animate() {
  requestAnimationFrame(animate);
  obj.rotation.z += 0.005;

  const delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);
}
