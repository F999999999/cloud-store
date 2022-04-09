import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

// 货架标签
function shelfTag(domElement, position) {
  // div元素包装成为css2模型对象CSS2DObject
  const label = new CSS2DObject(domElement);
  label.name = "shelfTag";
  //避免HTML标签遮挡三维场景的鼠标事件
  // domElement.style.pointerEvents = "none";
  if (position) {
    // 设置HTML元素标签在three.js世界坐标中位置
    label.position.set(position.x, position.y, position.z);
  }
  return label;
}

// 商品标签
function goodsTag(domElement, position) {
  // div元素包装成为css2模型对象CSS2DObject
  const label = new CSS2DObject(domElement);
  label.name = "goodsTag";
  //避免HTML标签遮挡三维场景的鼠标事件
  // domElement.style.pointerEvents = "none";
  if (position) {
    // 设置HTML元素标签在three.js世界坐标中位置
    label.position.set(position.x, position.y, position.z);
  }
  return label;
}

export { shelfTag, goodsTag };
