import { DragControls } from "three/examples/jsm/controls/DragControls";
import { shelfLocation } from "@/utils/modelLocation/shelfModelLocation";

const TDragControls = (camera, renderer, scene) => {
  const dragControlsObject = [];
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

  // 添加被用于拖放的对象
  const addDragControlsObject = (object) => {
    Array.isArray(object)
      ? dragControlsObject.push(...object)
      : dragControlsObject.push(object);
  };
  // 清空被用于拖放的对象
  const clearDragControlsObject = () => {
    dragControlsObject.length = 0;
  };

  // 添加事件监听器
  // 开始拖拽时执行
  dragControls.addEventListener("dragstart", (event) => {
    // console.log("dragstart", event);
    // event.object.material.emissive.set(0xaaaaaa);

    const shelfBase = scene
      .getObjectByName("shelf")
      .children.filter((item) => item.name.slice(0, 11) === "shelf_base_");

    console.log("dragstartFn", event, "===", shelfBase);

    shelfBase.forEach((item) => {
      item.material.emissive.set(0xaaaaaa);
    });
  });

  // 正在拖拽时执行
  dragControls.addEventListener("drag", (event) => {
    // const p = event.object.position;
    // event.object.position.set(p.x + 100, p.y + 100, p.z + 100);
    if (event.object.position.y < 0) {
      // event.object.position.y = 0;
    }

    console.log("intersectObjects", intersectObjects);
    const shelfBaseMesh = intersectObjects.find((item) => {
      console.log(item.object.name, item.object.name.slice(0, 11));
      return item.object.name.slice(0, 11) === "shelf_base_";
    });
    if (shelfBaseMesh) {
      //   console.log(
      //     "===shelfBaseMesh===",
      //     // shelfBaseMesh,
      //     shelfBaseMesh.object.name,
      //     shelfBaseMesh.object.position,
      //     shelfBaseMesh.object.parent.data.id
      //   );
      shelfBaseMesh.object.material.emissive.set(0x118ee9);
    }
  });

  // 完成拖拽时执行
  dragControls.addEventListener("dragend", (event) => {
    console.log("dragend", event);
    // event.object.material.emissive.set(0x000000);

    const shelfBase = scene
      .getObjectByName("shelf")
      .children.filter((item) => item.name.slice(0, 11) === "shelf_base_");

    shelfBase.forEach((item) => {
      item.material.emissive.set(0x000000);
    });

    console.log("intersectObjects", intersectObjects);
    const shelfBaseMesh = intersectObjects.find((item) => {
      console.log(item.object.name, item.object.name.slice(0, 11));
      return item.object.name.slice(0, 11) === "shelf_base_";
    });
    if (shelfBaseMesh) {
      console.log(
        "===shelfBaseMesh===",
        shelfBaseMesh,
        shelfBaseMesh.object.position,
        event.object,
        shelfBaseMesh.object.parent.data.id,
        shelfBaseMesh.object.parent.position.z +
          shelfLocation[event.object.data.shelf_base_id - 1].z
      );

      shelfBaseMesh.object.material.emissive.set(0x000000);
      event.object.position.set(
        shelfBaseMesh.object.parent.position.x +
          shelfLocation[shelfBaseMesh.object.data.id - 1].x,
        shelfBaseMesh.object.parent.position.y +
          shelfLocation[shelfBaseMesh.object.data.id - 1].y,
        shelfBaseMesh.object.parent.position.z +
          shelfLocation[shelfBaseMesh.object.data.id - 1].z
      );
    }
  });

  // 鼠标移入时执行
  dragControls.addEventListener("hoveron", (event) => {
    console.log("hoveron", event);
    event.object.material.emissive.set(0x666666);
  });

  // 鼠标移出时执行
  dragControls.addEventListener("hoveroff", (event) => {
    console.log("hoveroff", event);
    event.object.material.emissive.set(0x000000);
  });

  return {
    addDragControlsObject,
    clearDragControlsObject,
    dragControlsObject,
    updateIntersectObjects,
  };
};

export default TDragControls;
