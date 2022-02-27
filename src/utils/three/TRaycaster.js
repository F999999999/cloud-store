import { Raycaster, Vector2, Vector3 } from "three";
import Outline from "@/utils/three/TOutline";
import TDragControls from "@/utils/three/TDragControls";

const TRaycaster = (dom, renderer, scene, camera) => {
  // 创建射线投射器对象
  const raycaster = new Raycaster(new Vector3(0, 10000, 0));

  // 描边
  const { outlinePass, outlineRender } = Outline(renderer, scene, camera);
  // 拖放控制器
  const dragControls = TDragControls(camera, renderer);

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
    // 设置标准设备坐标和相机
    raycaster.setFromCamera(pointer, camera);

    // 检测射线更新后执行
    checkIntersection();
  };

  // 鼠标点击事件
  const onClick = () => {
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
  };

  // 监听鼠标指针移动事件
  renderer.domElement.addEventListener("pointermove", onPointerMove);

  // 监听鼠标点击事件
  renderer.domElement.addEventListener("click", onClick);

  // 货架格子
  let shelfBaseObjects = [];
  let berfectShelfBaseObjects = [];
  // 货物
  let goodsObjects = [];

  // 检测射线
  const checkIntersection = () => {
    // 返回射线选中的对象(检测的目标对象,是否返回目标对象的子元素)
    let intersects = raycaster.intersectObjects(scene.children, true);
    // 传递射线选中的对象给拖放控制器
    dragControls.updateIntersectObjects(intersects);

    // 判断是否捕获到对象
    if (intersects.length > 0) {
      intersects.forEach((intersect) => {
        // 判断是否是货架格子
        if (intersect?.object?.name.slice(0, 11) === "shelf_base_") {
          shelfBaseObjects.push(intersect);
        }
        // 判断是否是货物
        if (intersect.object.name === "goods") {
          goodsObjects.push(intersect);
        }
      });

      // 判断是否捕获到货架格子
      if (shelfBaseObjects.length > 0 && dragControls.getDragState()) {
        // 清除之前被选中的货架格子的颜色
        berfectShelfBaseObjects.forEach((item) => {
          // 清除颜色
          item.object.material.emissive.set(0x000000);
        });
        // 清空之前被选中的货架格子
        berfectShelfBaseObjects = [];

        // 货架格子添加颜色
        shelfBaseObjects.forEach((item) => {
          item.object.material.emissive.set(0x118ee9);
          // 保存被选中的货架格子
          berfectShelfBaseObjects.push(item);
        });
      } else {
        // 清除之前被选中的货架格子的颜色
        berfectShelfBaseObjects.forEach((item) => {
          // 清除颜色
          item.object.material.emissive.set(0x000000);
        });
      }
      // 清空货架格子列表
      shelfBaseObjects = [];

      // 判断是否捕获到货物
      if (goodsObjects.length > 0) {
        // 当前货物
        const selectedObject = goodsObjects[0].object;
        // 添加到描边列表
        outlinePass.selectedObjects = [selectedObject];
        // 添加被拖放的物体
        dragControls.addDragControlsObject(selectedObject);
      } else {
        // 清除描边效果
        outlinePass.selectedObjects = [];
        // 清空被拖放的物体
        dragControls.clearDragControlsObject();
      }
      // 清空货物列表
      goodsObjects = [];
    } else {
      // 清除描边效果
      outlinePass.selectedObjects = [];

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
