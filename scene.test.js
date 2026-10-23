import * as THREE from 'three';
import { describe, expect, test } from 'vitest';
import { createScene } from './scene.js';

const setup = () => createScene({ width: 500, height: 500 });

describe('球', () => {
  test('4 つの球がシーンにある', () => {
    const { scene, spheres } = setup();
    expect(spheres).toHaveLength(4);
    spheres.forEach((sphere) => expect(sphere.parent).toBe(scene));
  });

  test.each([{
    name: 'solidGreenSphere', position: [60, 0, 60], color: 0x4caf50, wireframe: false, segments: [32, 16],
  }, {
    name: 'wireframeGreenSphere', position: [60, 0, -60], color: 0x4caf50, wireframe: true, segments: [32, 16],
  }, {
    name: 'solidRedSphere', position: [-60, 0, -60], color: 0xff0000, wireframe: false, segments: [8, 8],
  }, {
    name: 'wireframeRedSphere', position: [-60, 0, 60], color: 0xff0000, wireframe: true, segments: [8, 8],
  }])('$name の位置・色・ワイヤーフレーム・分割数', ({ name, position, color, wireframe, segments }) => {
    const { scene } = setup();
    const sphere = scene.getObjectByName(name);

    expect(sphere).toBeInstanceOf(THREE.Mesh);
    expect(sphere.position.toArray()).toEqual(position);
    expect(sphere.material).toBeInstanceOf(THREE.MeshLambertMaterial);
    expect(sphere.material.color.getHex()).toBe(color);
    expect(sphere.material.wireframe).toBe(wireframe);

    const { radius, widthSegments, heightSegments } = sphere.geometry.parameters;
    expect(radius).toBe(50);
    expect([widthSegments, heightSegments]).toEqual(segments);
  });
});

describe('光源', () => {
  test('平行光源が上から照らす', () => {
    const { scene, light } = setup();
    expect(light).toBeInstanceOf(THREE.DirectionalLight);
    expect(light.parent).toBe(scene);
    expect(light.position.toArray()).toEqual([0, 100, 30]);
    expect(light.intensity).toBe(1);
  });

  test('環境光がある', () => {
    const { scene, ambient } = setup();
    expect(ambient).toBeInstanceOf(THREE.AmbientLight);
    expect(ambient.parent).toBe(scene);
    expect(ambient.color.getHex()).toBe(0x303030);
  });
});

describe('カメラ', () => {
  test('画面の縦横比に合わせた透視投影カメラ', () => {
    const { camera } = createScene({ width: 800, height: 400 });
    expect(camera).toBeInstanceOf(THREE.PerspectiveCamera);
    expect(camera.fov).toBe(45);
    expect(camera.aspect).toBe(2);
  });

  test('斜め上からシーンの中心を向いている', () => {
    const { camera } = setup();
    expect(camera.position.toArray()).toEqual([200, 100, 300]);

    const direction = camera.getWorldDirection(new THREE.Vector3());
    const toCenter = camera.position.clone().negate().normalize();
    expect(direction.distanceTo(toCenter)).toBeCloseTo(0);
  });
});

describe('補助線', () => {
  test('グリッド・軸・ライトの補助線がシーンにある', () => {
    const { scene, gridHelper, axesHelper, lightHelper, light } = setup();
    expect(gridHelper).toBeInstanceOf(THREE.GridHelper);
    expect(axesHelper).toBeInstanceOf(THREE.AxesHelper);
    expect(lightHelper).toBeInstanceOf(THREE.DirectionalLightHelper);
    expect(lightHelper.light).toBe(light);
    [gridHelper, axesHelper, lightHelper].forEach((helper) => expect(helper.parent).toBe(scene));
  });
});
