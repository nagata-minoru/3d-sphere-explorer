# 3D Sphere Explorer

Three.js で 4 つの球体を表示し、マウスで視点を動かして観察できるデモです。
開発には [Vite](https://vite.dev/) を使います。

**公開ページ**: https://nagata-minoru.github.io/3d-sphere-explorer/

## 起動方法

Node.js（20.19 以上）と、パッケージ管理に [Yarn](https://yarnpkg.com/) 4 を使います。
Yarn のバージョンは `package.json` の `packageManager` で固定しているので、Corepack を有効にしておけば自動でそのバージョンが使われます。

```zsh
corepack enable  # 初回だけ
yarn install     # 依存パッケージをインストール
```

開発サーバーを起動し、表示された URL（http://localhost:5173/3d-sphere-explorer/ ）をブラウザで開きます。
ファイルを保存すると、ブラウザが自動で更新されます。

```zsh
yarn dev
```

Three.js（0.152.2）はバンドルせず unpkg から読み込むので、インターネット接続が必要です。
バージョンを変えるときは、`index.html` の Import Map と `vite.config.js` の `THREE_CDN` の両方を書き換えてください。

## ビルドと公開

```zsh
yarn build    # dist/ に公開用のファイルを作る
yarn preview  # dist/ の内容をローカルで確認する
```

`main` ブランチに push すると、GitHub Actions（`.github/workflows/deploy.yml`）がビルドして GitHub Pages に公開します。

## 画面に表示されるもの

500×500 の灰色のキャンバスに、次のものが表示されます。

| 位置 (x, z) | 内容 |
|---|---|
| (60, 60) | 緑の球（なめらか・塗りつぶし） |
| (60, -60) | 緑の球（なめらか・ワイヤーフレーム） |
| (-60, -60) | 赤の球（ポリゴンが粗い 8×8・塗りつぶし） |
| (-60, 60) | 赤の球（ポリゴンが粗い 8×8・ワイヤーフレーム） |

ほかに、床のグリッド、XYZ 軸（赤=X、緑=Y、青=Z）、平行光源の位置を示すヘルパーも表示されます。

## 操作方法

[OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls) で視点を操作します。

- **左ドラッグ**：視点を回転
- **ホイール / ピンチ**：ズーム
- **右ドラッグ**（または Shift＋ドラッグ）：視点を平行移動

最初から自動回転（`autoRotate`）が有効なので、操作しなくてもシーンがゆっくり回ります。

## 改造するときの場所

どれも `main.js` の中にあります。

- **キャンバスのサイズ**：`width` / `height`
- **自動回転を止める**：`controls.autoRotate = false`
- **球の細かさ**：`SphereGeometry(半径, 横の分割数, 縦の分割数)` の値を変えると、なめらかさの違いを比べられます
- **背景色**：`renderer.setClearColor(0xcfcfcf)`

## ファイル構成

```
.
├── index.html                    # エントリポイント（Import Map で Three.js を読み込む）
├── main.js                       # シーンの構築と描画
├── vite.config.js                # Vite の設定（Three.js を CDN から読み込む設定など）
├── package.json
├── yarn.lock                     # 依存パッケージのバージョン固定
├── .yarnrc.yml                   # Yarn の設定
├── public/                       # そのまま公開されるファイル
│   ├── site.webmanifest          # Web アプリのマニフェスト
│   └── icons/                    # ファビコンなど
└── .github/workflows/deploy.yml  # GitHub Pages への公開
```
