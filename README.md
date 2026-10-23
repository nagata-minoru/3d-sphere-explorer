# 3D Sphere Explorer

Three.js で 4 つの球体を表示し、マウスで視点を動かして観察できるデモです。
開発には [Vite](https://vite.dev/) を使います。

**本番環境**: https://nagata-minoru.github.io/3d-sphere-explorer/

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
バージョンを変えるときは、`index.html` の Import Map、`vite.config.js` の `THREE_CDN`、`package.json` の `three`（テスト用）の 3 か所を書き換えてください。

## テスト

[Vitest](https://vitest.dev/) で、`scene.js` が作るシーン（球の位置・色・分割数、光源、カメラ、補助線）をテストします。

```zsh
yarn test        # ファイルを保存するたびに再実行する
yarn test --run  # 1 回だけ実行する
```

テストは Node.js 上で動き CDN から読み込めないので、devDependencies の `three`（CDN と同じ 0.152.2）を使います。

## ビルド

```zsh
yarn build    # dist/ に公開用のファイルを作る
yarn preview  # dist/ の内容をローカルで確認する
```

## CI/CD

GitHub Actions で次のワークフローが自動で動きます。

| ワークフロー | タイミング | 内容 |
|---|---|---|
| CI（`.github/workflows/ci.yml`） | PR の作成・更新 | テストとビルドを実行し、結果を PR に表示する |
| Deploy to GitHub Pages（`.github/workflows/deploy.yml`） | `main` への push | テストとビルドを実行し、本番環境に公開して、公開後の本番を確認する |

### CI：マージ前の確認

`main` にはルールセット（Settings → Rules）を設定しているので、CI の `test` ジョブが成功しないと PR をマージできません。

### CD：本番環境への公開

本番環境は GitHub Pages（https://nagata-minoru.github.io/3d-sphere-explorer/ ）です。
`main` にマージすると、次の順で自動的に公開されます。

1. **build**：テストとビルドを実行する。テストが失敗したら、ここで止まり公開しない
2. **deploy**：`dist/` を本番環境に公開する
3. **verify**：本番の HTML が今回ビルドした JS を読み込んでいるかを確かめる（反映を最大 2 分待つ）。あわせて、JS・favicon・マニフェスト・CDN の Three.js が読み込めるかも確かめる

公開先の環境 `github-pages`（Settings → Environments）は、`main` ブランチからしか公開できないように制限されています。
Actions の画面から「Run workflow」を押すと、`main` の内容で手動で公開し直すこともできます。

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

- **キャンバスのサイズ**：`main.js` の `width` / `height`
- **自動回転を止める**：`main.js` の `controls.autoRotate = false`
- **背景色**：`main.js` の `renderer.setClearColor(0xcfcfcf)`
- **球の位置・色・細かさ**：`scene.js` の `SPHERES`。`segments` は `[横の分割数, 縦の分割数]` で、値を変えるとなめらかさの違いを比べられます

`scene.js` を変えたら、`scene.test.js` の期待値も合わせて直してください。

## ファイル構成

```
.
├── index.html                    # エントリポイント（Import Map で Three.js を読み込む）
├── main.js                       # 描画とマウス操作
├── scene.js                      # 球・光源・カメラ・補助線の構築
├── scene.test.js                 # scene.js のテスト
├── vite.config.js                # Vite の設定（Three.js を CDN から読み込む設定など）
├── package.json
├── yarn.lock                     # 依存パッケージのバージョン固定
├── .yarnrc.yml                   # Yarn の設定
├── public/                       # そのまま公開されるファイル
│   ├── site.webmanifest          # Web アプリのマニフェスト
│   └── icons/                    # ファビコンなど
└── .github/workflows/
    ├── ci.yml                    # PR ごとのテストとビルド
    └── deploy.yml                # GitHub Pages への公開
```
