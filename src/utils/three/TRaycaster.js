import { Raycaster, Vector2 } from "three";
import Outline from "@/utils/three/TOutline";

// 捕获的对象信息
let selectedObjects = [];
// 标准设备坐标
const pointer = { x: null, y: null };
// 创建射线投射器对象
const raycaster = new Raycaster();

const TRaycaster = (dom, renderer, scene, camera) => {
  // 描边
  const { outlinePass, outlineRender } = Outline(renderer, scene, camera);

  // 更新标准设备坐标
  const onPointerMove = (event) => {
    // 获取鼠标在屏幕中的横坐标
    const mouseX = event.clientX;
    // 获取鼠标在屏幕中的纵坐标
    const mouseY = event.clientY;
    // 获取渲染场景相对屏幕坐标的偏移量
    const rect = dom.getBoundingClientRect();

    if (event.isPrimary === false) return;
    // 屏幕坐标转换为标准设备坐标
    pointer.x = ((mouseX - rect.left) / dom.offsetWidth) * 2 - 1;
    pointer.y = -((mouseY - rect.top) / dom.offsetHeight) * 2 + 1;

    //
    checkRaycaster();
    checkIntersection();
  };

  function checkIntersection() {
    // 标准设备坐标
    const standardVector = new Vector2(pointer.x, pointer.y);
    raycaster.setFromCamera(standardVector, camera);

    const intersects = raycaster.intersectObject(scene, true);

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      addSelectedObject(selectedObject);
      outlinePass.selectedObjects = selectedObjects;
    } else {
      outlinePass.selectedObjects = [];
    }
  }

  // 监听鼠标指针移动事件
  renderer.domElement.addEventListener("pointermove", onPointerMove);

  // 监听鼠标点击事件
  renderer.domElement.addEventListener("click", () => {
    // 判断是否选中的实体
    if (selectedObjects[0]) {
      console.log("click", selectedObjects[0]);
      if (selectedObjects[0].scale.x === 100) {
        selectedObjects[0].scale.set(120, 120, 120);
      } else if (selectedObjects[0].scale.x === 120) {
        selectedObjects[0].scale.set(100, 100, 100);
      }
    }
  });

  // 添加到选择列表
  const addSelectedObject = (object) => {
    selectedObjects = [];
    selectedObjects.push(object);
  };

  // 检测射线
  const checkRaycaster = () => {
    // 判断屏幕坐标是否有值
    if (!pointer.x || !pointer.y) return;
    // 标准设备坐标
    const standardVector = new Vector2(pointer.x, pointer.y);
    // 设置标准设备坐标和相机
    raycaster.setFromCamera(standardVector, camera);

    // 返回射线选中的对象(检测的目标对象,是否返回目标对象的子元素)
    let intersects = raycaster.intersectObjects(scene.children, true);

    // 排除不需要被选中的对象
    intersects = intersects.filter(
      (intersect) => intersect.object.name !== "stage"
    );

    // 判断是否捕获到对象
    if (intersects.length > 0) {
      // 捕获到对象
      // 添加描边效果
      const selectedObject = intersects[0].object;
      addSelectedObject(selectedObject);
      outlinePass.selectedObjects = selectedObjects;
      // console.log("outlinePass=", outlinePass);
    } else {
      // 未捕获到对象
      // 清除描边效果
      outlinePass.selectedObjects = [];
    }
  };

  const raycasterRender = () => {
    outlineRender();
    requestAnimationFrame(raycasterRender);
  };
  raycasterRender();
};

export default TRaycaster;
