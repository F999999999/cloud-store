import { DragControls } from "three/examples/jsm/controls/DragControls";

const TDragControls = (camera, renderer) => {
  // 可被拖放的物体
  const dragControlsObject = [];
  // 当前被拖放的物体
  let currentDragControlsObject = null;
  const getCurrentDragControls = () => {
    return currentDragControlsObject;
  };
  const setCurrentDragControls = (obj) => {
    currentDragControlsObject = obj;
  };
  // 拖放状态
  let isDrag = false;
  // 获取拖放状态
  const getDragState = () => isDrag;
  // 设置拖放状态
  const setDragState = (state) => (isDrag = state);

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

  // 注册事件监听器
  const addEventListener = (type, listener) => {
    dragControls.addEventListener(type, listener);
  };

  return {
    addDragControlsObject,
    clearDragControlsObject,
    dragControlsObject,
    getDragState,
    setDragState,
    addEventListener,
    getCurrentDragControls,
    setCurrentDragControls,
  };
};

export default TDragControls;
