import { Raycaster, Vector2, Vector3 } from "three";

const TRaycaster = (
  dom,
  renderer,
  scene,
  camera,
  intersectObjectsRecursive = true
) => {
  // 创建射线投射器对象
  const raycaster = new Raycaster(new Vector3(0, 10000, 0));

  // 更新标准设备坐标并获取相交对象
  const updateIntersects = (event) => {
    // 获取鼠标在屏幕中的横坐标
    const mouseX = event.clientX;
    // 获取鼠标在屏幕中的纵坐标
    const mouseY = event.clientY;
    // 标准设备坐标
    const pointer = new Vector2();

    if (event.isPrimary === false) return;
    // 屏幕坐标转换为标准设备坐标
    pointer.x = ((mouseX - dom.offsetLeft) / dom.clientWidth) * 2 - 1;
    pointer.y = -((mouseY - dom.offsetTop) / dom.clientHeight) * 2 + 1;
    // 设置标准设备坐标和相机
    raycaster.setFromCamera(pointer, camera);

    // 返回与射线相交的对象(检测的目标对象,是否返回目标对象的子元素)
    return raycaster.intersectObjects(
      scene.children,
      intersectObjectsRecursive
    );
  };

  return { updateIntersects };
};

export default TRaycaster;
