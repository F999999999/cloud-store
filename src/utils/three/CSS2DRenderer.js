import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
// 相对鼠标的相对偏移
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.left = "0px";
// 设置.pointerEvents=none，以免模型标签HTML元素遮挡鼠标选择场景模型
labelRenderer.domElement.style.pointerEvents = "none";
document.body.appendChild(labelRenderer.domElement);

export default labelRenderer;
