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
    this.renderer.setClearColor(0x141e30, 1);
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
    this.camera.position.set(2000, 2000, 1000);
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

      requestAnimationFrame(anim);
    };
    anim();
  }

  addRenderAnim(fn) {
    this.renderFnArr.push(fn);
  }
  // 设置正投影相机大小
  setOrthographicCameraSize(width, height, s = 1000) {
    // 设置渲染容器的尺寸
    this.dom.style.width = width;
    this.dom.style.height = height;
    // 重置渲染器输出画布canvas尺寸
    this.renderer.setSize(width, height);
    // 设置宽高比
    const k = width / height;
    this.camera.left = -s * k;
    this.camera.right = s * k;
    this.camera.top = s;
    this.camera.bottom = -s;
    // 渲染器执行 render 方法的时候会读取相机对象的投影矩阵属性 projectionMatrix
    // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
    // 如果相机的一些属性发生了变化，需要执行 updateProjectionMatrix 方法更新相机的投影矩阵
    this.camera.updateProjectionMatrix();
  }

  // 设置透视投影照相机大小
  setPerspectiveCameraCameraSize(width, height) {
    // 重置渲染器输出画布canvas尺寸
    this.renderer.setSize(width, height);
    // 全屏情况下：设置观察范围长宽比 aspect 为窗口宽高比
    this.camera.aspect = width / height;
    // 渲染器执行 render 方法的时候会读取相机对象的投影矩阵属性 projectionMatrix
    // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
    // 如果相机的一些属性发生了变化，需要执行 updateProjectionMatrix 方法更新相机的投影矩阵
    this.camera.updateProjectionMatrix();
  }

  // 添加模型到场景中
  addObject(...object) {
    object.forEach((elem) => this.scene.add(elem));
  }
}
