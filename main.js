import * as THREE from 'three'; // Three.jsライブラリをインポートします。
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createScene } from './scene.js';

(() => {
  const width = 500;
  const height = 500;

  const { scene, camera } = createScene({ width, height });

  const controls = new OrbitControls(camera, stage);
  controls.autoRotate = true;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
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
