import {
  OrthographicCamera,
  PCFSoftShadowMap,
  Scene,
  WebGLRenderer,
} from "three";

export class TEngine {
  dom;
  renderer;
  scene;
  camera;
  renderFnArr = [];

  constructor(threeRef) {
    // 渲染场景的 DOM 元素
    this.dom = threeRef;
    // 创建渲染器对象
    this.renderer = new WebGLRenderer({
      // 抗锯齿
      antialias: true,
    });
    // 是否渲染阴影
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
    // 设置渲染区域尺寸
    this.renderer.setSize(this.dom.offsetWidth, this.dom.offsetHeight);
    // 设置背景颜色
    this.renderer.setClearColor(0x9999ff, 1);
    // 把 canvas 对象插入到指定 DOM 标签中
    this.dom.appendChild(this.renderer.domElement);

    // 实例化场景
    this.scene = new Scene();

    // 设置相机
    // 宽高比
    const k = this.dom.offsetWidth / this.dom.offsetHeight;
    // 三维场景显示范围控制系数 系数越大 显示的范围越大
    const s = 1000;
    // 创建相机对象
    this.camera = new OrthographicCamera(-s * k, s * k, s, -s, -s * 10, s * 10);

    // 设置相机位置
    this.camera.position.set(1000, 1000, 1000);
    // 设置相机方向(需要指向的场景对象)
    this.camera.lookAt(this.scene.position);

    const anim = () => {
      if (this.renderFnArr.length > 0) {
        this.renderFnArr.forEach((fn) => {
          if (typeof fn === "function") {
            fn();
          }
        });
      }

      // labelRenderer.render(this.scene, this.camera);

      // this.renderer.autoClear = false;
      // this.renderer.render(this.scene, this.camera1);
      requestAnimationFrame(anim);
    };
    anim();
  }

  addRenderAnim(fn) {
    this.renderFnArr.push(fn);
  }

  // 添加模型到场景中
  addObject(...object) {
    object.forEach((elem) => this.scene.add(elem));
  }
}
