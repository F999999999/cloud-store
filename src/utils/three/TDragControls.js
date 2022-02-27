import { DragControls } from "three/examples/jsm/controls/DragControls";
import { shelfLocation } from "@/utils/modelLocation/shelfModelLocation";

const TDragControls = (camera, renderer) => {
  // 可被拖放的物体
  const dragControlsObject = [];
  // 当前被拖放的物体
  let currentDragControlsObject = null;
  // 拖放状态
  let isDrag = false;
  // 获取拖放状态
  const getDragState = () => isDrag;
  // 相交的物体
  let intersectObjects = [];
  // 更新相交的物体
  const updateIntersectObjects = (intersects) => {
    intersectObjects = intersects;
  };

  // 实例化拖放控制器组件
  const dragControls = new DragControls(
    dragControlsObject,
    camera,
    renderer.domElement
  );

  // 添加被可用于拖放的对象
  const addDragControlsObject = (object) => {
    Array.isArray(object)
      ? dragControlsObject.push(...object)
      : dragControlsObject.push(object);
  };
  // 清空可被用于拖放的对象
  const clearDragControlsObject = () => {
    dragControlsObject.length = 0;
  };

  // 添加事件监听器
  // 开始拖拽时执行
  dragControls.addEventListener("dragstart", () => {
    // 切换拖放状态
    isDrag = true;
  });

  // 正在拖拽时执行
  // dragControls.addEventListener("drag", (event) => {
  //   if (event.object.position.y < 0) {
  //     // event.object.position.y = 0;
  //   }
  //
  //   console.log("intersectObjects", intersectObjects);
  //   const shelfBaseMesh = intersectObjects.find((item) => {
  //     console.log(item.object.name, item.object.name.slice(0, 11));
  //     return item.object.name.slice(0, 11) === "shelf_base_";
  //   });
  //   if (shelfBaseMesh) {
  //     //   console.log(
  //     //     "===shelfBaseMesh===",
  //     //     // shelfBaseMesh,
  //     //     shelfBaseMesh.object.name,
  //     //     shelfBaseMesh.object.position,
  //     //     shelfBaseMesh.object.parent.data.id
  //     //   );
  //     // shelfBaseMesh.object.material.emissive.set(0x118ee9);
  //   }
  // });

  // 完成拖拽时执行
  dragControls.addEventListener("dragend", (event) => {
    // 切换拖放状态
    isDrag = false;

    // 过滤鼠标指向的货架格子
    const shelfBaseMesh = intersectObjects.find(
      (item) => item.object.name.slice(0, 11) === "shelf_base_"
    );

    // 判断是否拖拽到货架格子
    if (shelfBaseMesh) {
      // 判断货架格子是否更改
      if (
        shelfBaseMesh.object.data.id ===
          currentDragControlsObject.data.shelf_base_id &&
        shelfBaseMesh.object.data.shelf_id ===
          currentDragControlsObject.data.shelf_id
      ) {
        // 货架格子未进行更改
        console.log("货架格子未进行更改");
        // 把货物放入货架格子
        event.object.position.set(
          shelfBaseMesh.object.parent.position.x +
            shelfLocation[shelfBaseMesh.object.data.id - 1].x,
          shelfBaseMesh.object.parent.position.y +
            shelfLocation[shelfBaseMesh.object.data.id - 1].y,
          shelfBaseMesh.object.parent.position.z +
            shelfLocation[shelfBaseMesh.object.data.id - 1].z
        );
        return;
      }

      // 把货物放入货架格子
      event.object.position.set(
        shelfBaseMesh.object.parent.position.x +
          shelfLocation[shelfBaseMesh.object.data.id - 1].x,
        shelfBaseMesh.object.parent.position.y +
          shelfLocation[shelfBaseMesh.object.data.id - 1].y,
        shelfBaseMesh.object.parent.position.z +
          shelfLocation[shelfBaseMesh.object.data.id - 1].z
      );
    } else {
      event.object.position.set(
        currentDragControlsObject.position.x,
        currentDragControlsObject.position.y,
        currentDragControlsObject.position.z
      );
    }
  });

  // 鼠标移入时执行
  dragControls.addEventListener("hoveron", (event) => {
    // 保存当前被拖放的物体
    currentDragControlsObject = event.object.clone();
    // 保存当前被拖放物体的自定义数据
    currentDragControlsObject.data = event.object.data;
  });

  // 鼠标移出时执行
  // dragControls.addEventListener("hoveroff", (event) => {
  //   console.log("hoveroff", event);
  //   event.object.material.emissive.set(0x000000);
  // });

  return {
    addDragControlsObject,
    clearDragControlsObject,
    dragControlsObject,
    updateIntersectObjects,
    getDragState,
  };
};

export default TDragControls;
