import * as THREE from 'three';

// 球の位置・色・分割数・ワイヤーフレームの組み合わせ
export const SPHERES = [{
  name: 'solidGreenSphere', color: 0x4caf50, wireframe: false, segments: [32, 16], position: [60, 0, 60],
}, {
  name: 'wireframeGreenSphere', color: 0x4caf50, wireframe: true, segments: [32, 16], position: [60, 0, -60],
}, {
  name: 'solidRedSphere', color: 'red', wireframe: false, segments: [8, 8], position: [-60, 0, -60],
}, {
  name: 'wireframeRedSphere', color: 'red', wireframe: true, segments: [8, 8], position: [-60, 0, 60],
}];

const SPHERE_RADIUS = 50;

const createSphere = ({ name, color, wireframe, segments, position }) => {
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(SPHERE_RADIUS, ...segments),
    new THREE.MeshLambertMaterial({ color, wireframe })
  );
  sphere.name = name;
  sphere.position.set(...position);
  return sphere;
};

// 球・光源・補助線を配置したシーンと、それを映すカメラを作る
export const createScene = ({ width, height }) => {
  const scene = new THREE.Scene();

  const spheres = SPHERES.map(createSphere);
  spheres.forEach((sphere) => scene.add(sphere));

  // r155 から光の強さの単位が変わったので、以前と同じ明るさにするため π 倍にする
  const light = new THREE.DirectionalLight(0xffffff, Math.PI);
  light.position.set(0, 100, 30);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0x303030, 0.9 * Math.PI);
  scene.add(ambient);

  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  camera.position.set(200, 100, 300);
  camera.lookAt(scene.position);

  const gridHelper = new THREE.GridHelper(350, 20);
  scene.add(gridHelper);
  const axesHelper = new THREE.AxesHelper(1000);
  scene.add(axesHelper);
  const lightHelper = new THREE.DirectionalLightHelper(light, 20);
  scene.add(lightHelper);

  return { scene, camera, spheres, light, ambient, gridHelper, axesHelper, lightHelper };
};
