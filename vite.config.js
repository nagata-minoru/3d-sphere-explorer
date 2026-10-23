import { defineConfig } from 'vite';

// index.html の Import Map と同じ URL にすること
const THREE_CDN = 'https://unpkg.com/three@0.186.1';

// three をバンドルせず、CDN の URL に置き換えて読み込む
const threeFromCdn = () => ({
  name: 'three-from-cdn',
  enforce: 'pre',
  resolveId: (id) => {
    if (id === 'three') return { id: `${THREE_CDN}/build/three.module.js`, external: true };
    if (id.startsWith('three/addons/')) {
      return { id: id.replace('three/addons/', `${THREE_CDN}/examples/jsm/`), external: true };
    }
    return null;
  },
});

export default defineConfig({
  base: '/3d-sphere-explorer/',
  // テストは Node.js で動き CDN から読み込めないので、npm の three を使う
  plugins: process.env.VITEST ? [] : [threeFromCdn()],
});
