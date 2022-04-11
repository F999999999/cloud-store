import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { Vector2 } from "three";

let composer;
// 轮廓线参数
let outlinePass = {};

// Outline 轮廓线
const TOutlinePass = (renderer, scene, camera) => {
  composer = new EffectComposer(renderer);

  // 创建渲染通道
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  outlinePass = new OutlinePass(
    new Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
  );
  outlinePass.edgeStrength = 10; // 边框的亮度
  outlinePass.edgeGlow = 0.5; // 光晕[0,1]
  outlinePass.edgeThickness = 2; // 边框宽度
  outlinePass.pulsePeriod = 3; // 呼吸闪烁的速度
  outlinePass.visibleEdgeColor.set("#ffffff"); // 边框宽度
  outlinePass.hiddenEdgeColor.set("#000000"); // 呼吸消失的颜色
  outlinePass.rotate = false; // 是否旋转
  outlinePass.usePatternTexture = false; // 是否使用父级的材质
  outlinePass.selectedObjects = []; // 选中的模型对象
  outlinePass.renderOutline = () => composer.render(); // 渲染函数
  composer.addPass(outlinePass);

  return outlinePass;
};

export { TOutlinePass, outlinePass };
