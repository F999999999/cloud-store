import * as THREE from "three";

// 使用 CameraControls 实现鼠标控制三维场景
import CameraControls from "camera-controls";
// 在创建新的 CameraControls 实例之前需要先调用此方法
CameraControls.install({ THREE });

// 相机控制器
const cameraControls = (renderer, scene, camera) => {
  const clock = new THREE.Clock();
  const cameraControls = new CameraControls(camera, renderer.domElement);

  // 用户输入配置
  // 左键
  cameraControls.mouseButtons.left = CameraControls.ACTION.NONE;
  // 右键
  cameraControls.mouseButtons.right = CameraControls.ACTION.TRUCK;
  // 中键
  cameraControls.mouseButtons.middle = CameraControls.ACTION.ROTATE;

  const renderCamera = () => {
    // 判断相机控制器是否有更新
    if (cameraControls.update(clock.getDelta())) {
      renderer.render(scene, camera);
    }
  };

  return { cameraControls, renderCamera };
};

export default cameraControls;
