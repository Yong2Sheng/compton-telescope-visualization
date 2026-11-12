# Compton Telescope Visualization

用于科研演讲的两个离线三维演示：从真实 event cone 的几何关系，到光子事件重建与 Compton Data Space（CDS）。直接双击 HTML 即可使用，需要支持 WebGL 的浏览器，不需要启动服务器。

## 页面入口

| 页面 | 内容 |
| --- | --- |
| [reconstruction.html](reconstruction.html) | **完整演示。** 光子入射 → 第一次 Compton 散射 → 第二处完全吸收 → event cone → 参数卡片 → CDS 点累积。支持 Klein–Nishina 抽样、能量与源方向设置、批量增加 1000 个事件、两种投影、历史事件、中英文和自由观察。 |
| [event-cone-rotation.html](event-cone-rotation.html) | **几何探索。** 手动控制散射角与绕源轴旋转，观察真实 event cone 以及反投影轴端点在方向球上的轨迹，保留不同散射角的历史轨迹。 |

`event-cone-rotation.html` 是最初旋转动画的新文件名。过渡用的投影预览页面已删除，两种投影继续保留在完整演示中。

## 说明与后续计划

- [完整重建演示说明](RECONSTRUCTION.md)：操作、物理模型、投影、限制及验证方法。
- [绕源旋转演示说明](EVENT_CONE_ROTATION.md)：原始几何推导、轨迹规则与验证记录。

当前不实现“任意源位置下标准圆锥刚性平移”。相关物理约定与以后可以采用的显示方式已记录在项目后续计划中。

## 构建

HTML 已内嵌所需脚本。完整演示的 KaTeX 数学字体也内嵌在文件中，离线可用。只有需要修改源码并重新生成页面时，才需要安装构建依赖。

```bash
npm install
npm run build:all
```

单独构建：

```bash
npm run build                  # event-cone-rotation.html
npm run build:reconstruction   # reconstruction.html
```

## 检查

```bash
npm test
npm run test:psi
npm run test:reconstruction
npm run test:browser
npm run test:reconstruction-browser
npm run test:notation
npm run test:origin
npm run test:projection-seams
npm run test:audit-fixes
```

浏览器检查需要 Google Chrome。构建脚本只生成上面两个正式页面，不会重新生成已删除的预览页。

## 项目结构

- `src/physics.js`、`src/geometry.js`：共享角度约定、向量、能量和 event cone 几何。
- `src/app.js`、`src/scene.js`、`src/history.js`：绕源旋转演示。
- `src/event-simulation.js`：理想事件生成、Klein–Nishina 抽样与重建。
- `src/reconstruction*.js`：完整流程、场景、界面与语言。
- `src/cds-projections.js`：方向到平面显示的投影。
- `src/math-typesetting.js`：统一数学排版。
- `src/healpix-reference-data.json`：正式页面使用的 HEALPix 像素边界，以及数学测试使用的参考事件。
- `tests/`：当前可运行的验证入口。
- `artifacts/`、`output/`：历史参考资料、过程截图与测试记录，其中的旧页面名仅代表当时版本，不是当前入口。

## 不同投影介绍页面
https://doc.esri.com/en/arcgis-pro/latest/help/mapping/properties/azimuthal-equidistant.html

许可见 [LICENSE](LICENSE)。
