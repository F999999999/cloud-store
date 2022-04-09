import { TEngine } from "@/utils/three";
import { lightsList } from "@/utils/three/TLinghts";
import { basicObjectList } from "@/utils/three/TBasicObject";
import cameraControls from "@/utils/three/CameraControls";

let ThreeJS = null;
const useTEngine = (threeRef) => {
  // 实例化 ThreeJs
  const TE = new TEngine(threeRef);
  ThreeJS = TE;

  // 辅助工具
  // TE.addObject(...helperList);
  // 相机辅助
  // TE.addObject(new CameraHelper(TE.camera));
  // 光源
  TE.addObject(...lightsList);
  // 基本网格模型
  TE.addObject(...basicObjectList);

  // 相机控制器
  const TCameraControls = cameraControls(TE.renderer, TE.scene, TE.camera);
  // 添加相机控制器到渲染列表
  TE.addRenderAnim(TCameraControls.renderCamera);

  console.log("TE", TE);
  return TE;
};

export { useTEngine, ThreeJS };
