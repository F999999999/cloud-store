import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

// 实例化一个 GLTF 加载器
const gltfLoader = new GLTFLoader();

// 实例化一个 DRACOLoader 用于解码压缩的网格数据
// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath(`model/container/textures/`);
// gltfLoader.setDRACOLoader(dracoLoader);

// 导入 GLB/GLTF 模型
export const ContainerMobile = gltfLoader.loadAsync(
  `model/container/container.glb`,
  (xhr) => {
    // 模型正在加载中
    console.log("加载进度：" + (xhr.loaded / xhr.total) * 100 + "%");
  }
);
