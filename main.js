import * as THREE from 'three'; // Three.jsライブラリをインポートします。
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Creating cubes with Three.js
(() => {
  let scene;
  let solidGreenSphere;
  let wireframeGreenSphere;
  let solidRedSphere;
  let wireframeRedSphere;
  let light;
  let ambient;
  let camera;
  let gridHelper;
  let lightHelper;
  let axesHelper;
  let renderer;
  const width = 500;
  const height = 500;
  let controls;

  scene = new THREE.Scene()

  solidGreenSphere = new THREE.Mesh(
    new THREE.SphereGeometry(50),
    new THREE.MeshLambertMaterial({ color: 0x4caf50 })
  );
  solidGreenSphere.position.set(60, 0, 60);
  scene.add(solidGreenSphere);

  wireframeGreenSphere = new THREE.Mesh(
    new THREE.SphereGeometry(50),
    new THREE.MeshLambertMaterial({ color: 0x4caf50, wireframe: true })
  );
  wireframeGreenSphere.position.set(60, 0, -60);
  scene.add(wireframeGreenSphere);

  solidRedSphere = new THREE.Mesh(
    new THREE.SphereGeometry(50, 8, 8),
    new THREE.MeshLambertMaterial({ color: 'red' })
  );
  solidRedSphere.position.set(-60, 0, -60);
  scene.add(solidRedSphere);

  wireframeRedSphere = new THREE.Mesh(
    new THREE.SphereGeometry(50, 8, 8),
    new THREE.MeshLambertMaterial({ color: 'red', wireframe: true })
  );
  wireframeRedSphere.position.set(-60, 0, 60);
  scene.add(wireframeRedSphere);

  light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 100, 30);
  scene.add(light);

  ambient = new THREE.AmbientLight(0x303030, 0.9);
  scene.add(ambient);

  camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  camera.position.set(200, 100, 300);
  camera.lookAt(scene.position);

  gridHelper = new THREE.GridHelper(350, 20);
  scene.add(gridHelper);
  axesHelper = new THREE.AxesHelper(1000);
  scene.add(axesHelper);
  lightHelper = new THREE.DirectionalLightHelper(light, 20);
  scene.add(lightHelper);

  controls = new OrbitControls(camera, stage);
  controls.autoRotate = true;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0xcfcfcf);
  renderer.setPixelRatio(window.devicePixelRatio);
  stage.appendChild(renderer.domElement);

  const render = () => {
    requestAnimationFrame(render);

    controls.update();
    renderer.render(scene, camera);
  };
  render();
})();
