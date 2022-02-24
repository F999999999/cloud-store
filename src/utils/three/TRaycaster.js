import { Raycaster, Vector2 } from "three";
import Outline from "@/utils/three/TOutline";
import TDragControls from "@/utils/three/TDragControls";

// 捕获的对象信息
let selectedObjects = [];

const TRaycaster = (dom, renderer, scene, camera) => {
  // 创建射线投射器对象
  const raycaster = new Raycaster(camera.position);

  // 描边
  const { outlinePass, outlineRender } = Outline(renderer, scene, camera);
  // 拖放控制器
  const dragControls = TDragControls(camera, renderer, scene);

  // 更新标准设备坐标
  const onPointerMove = (event) => {
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
    // 标准设备坐标
    const standardVector = new Vector2(pointer.x, pointer.y);
    // 设置标准设备坐标和相机
    raycaster.setFromCamera(standardVector, camera);

    // 检测鼠标点击位置
    checkIntersection();
  };

  // 监听鼠标指针移动事件
  renderer.domElement.addEventListener("pointermove", onPointerMove);

  // 监听鼠标点击事件
  renderer.domElement.addEventListener("click", () => {
    // 判断是否选中的实体
    // if (selectedObjects[0]) {
    //   console.log("click", selectedObjects[0]);
    //   // 判断选中的是否是货物
    //   if (selectedObjects[0].name === "goods") {
    //     if (selectedObjects[0].scale.x === 80) {
    //       selectedObjects[0].scale.set(90, 90, 90);
    //     } else if (selectedObjects[0].scale.x === 90) {
    //       selectedObjects[0].scale.set(80, 80, 80);
    //     }
    //   }
    // }
  });

  // 添加到选择列表
  const addSelectedObject = (object) => {
    selectedObjects = [];
    selectedObjects.push(object);
  };

  // 检测射线
  const checkIntersection = () => {
    // 返回射线选中的对象(检测的目标对象,是否返回目标对象的子元素)
    let intersects = raycaster.intersectObjects(scene.children, true);
    // 传递射线选中的对象给拖放控制器
    dragControls.updateIntersectObjects(intersects);
    if (intersects.length > 0) {
      // console.log(scene, "scene", intersects);
    }
    // 筛选被选中的对象
    intersects = intersects.filter(
      (intersect) => intersect?.object?.name === "goods"
      //   ||
      // intersect?.object?.name.slice(0, 11) === "shelf_base_"
    );

    // 判断是否捕获到对象
    if (intersects.length > 0) {
      // 捕获到对象
      // 添加描边效果
      const selectedObject = intersects[0].object;
      addSelectedObject(selectedObject);
      outlinePass.selectedObjects = selectedObjects;

      // 添加被拖放的物体
      dragControls.addDragControlsObject(selectedObject);
      // dragControls.addDragControlsObject(
      //   scene
      //     .getObjectByName("shelf")
      //     .children.filter((item) => item.name.slice(0, 11) === "shelf_base_")
      // );
    } else {
      // 未捕获到对象
      // 清除描边效果
      outlinePass.selectedObjects = [];
      // 还原物体大小
      if (selectedObjects[0]?.name === "goods") {
        // 还原大小
        selectedObjects[0].scale.set(80, 80, 80);
        // 清空选中列表
        selectedObjects = [];
      }

      // 清空被拖放的物体
      dragControls.clearDragControlsObject();
    }
  };

  const raycasterRender = () => {
    outlineRender();
    requestAnimationFrame(raycasterRender);
  };
  raycasterRender();
};

export default TRaycaster;
