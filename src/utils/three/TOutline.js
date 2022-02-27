import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { Vector2 } from "three";

let composer;
// 轮廓线参数
let outlinePass = {
  edgeStrength: 3.0,
  edgeGlow: 0.0,
  edgeThickness: 1.0,
  pulsePeriod: 0,
  rotate: false,
  usePatternTexture: false,
  visibleEdgeColor: 0xffffff,
  hiddenEdgeColor: 0x190909,
  selectedObjects: [],
};

// Outline 轮廓线
const TOutline = (renderer, scene, camera) => {
  composer = new EffectComposer(renderer);

  // 创建渲染通道
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  outlinePass = new OutlinePass(
    new Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
  );

  composer.addPass(outlinePass);

  // 渲染轮廓线
  const renderOutline = () => {
    composer.render();
  };

  return { outlinePass, renderOutline };
};

export default TOutline;
