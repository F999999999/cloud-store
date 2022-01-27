<template>
  <div class="store">
    <div class="three-canvas" ref="threeRef"></div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { TEngine } from "@/utils/three";
import { lightsList } from "@/utils/three/TLinghts";
import { basicObjectList } from "@/utils/three/TBasicObject";
import { helperList } from "@/utils/three/THelper";
import { ContainerMobile } from "@/utils/three/loadModel/containerMobile";

export default {
  name: "Store",
  setup() {
    const threeRef = ref(null);
    // 示例数据
    const arr = [
      {
        name: "box",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box1",
        position: { x: 0, y: 0, z: -200 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box2",
        position: { x: 0, y: 0, z: -400 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box3",
        position: { x: 0, y: 0, z: -600 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box4",
        position: { x: 0, y: 0, z: -800 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box5",
        position: { x: 0, y: 0, z: -1000 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box",
        position: { x: 0, y: 200, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box",
        position: { x: 0, y: 200, z: -400 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box",
        position: { x: 0, y: 200, z: -600 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box",
        position: { x: 0, y: 200, z: -1000 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box",
        position: { x: 0, y: 400, z: -200 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    ];

    // DOM 渲染完成后执行
    onMounted(() => {
      // 实例化 Three
      const TE = new TEngine(threeRef.value);

      // 辅助工具
      TE.addObject(...helperList);
      // 光源
      TE.addObject(...lightsList);
      // 基本网格模型
      TE.addObject(...basicObjectList);

      // 遍历数据渲染箱子模型
      ContainerMobile.then((group) => {
        console.log("=模型=", group);
        // 模型缩放比例
        const groupScale = 100;
        // 遍历渲染模型
        arr.forEach((item) => {
          // 复制模型
          const newGroup = group.scene.children[0].clone();
          // 设置名称
          newGroup.name = item.name;
          // 设置模型的位置
          newGroup.position.set(
            item.position.x,
            item.position.y,
            item.position.z
          );

          // 设置模型旋转角度
          newGroup.rotation.set(
            item.rotation.x,
            item.rotation.y,
            item.rotation.z
          );

          // 设置缩放比例
          newGroup.scale.set(
            item.scale.x * groupScale,
            item.scale.y * groupScale,
            item.scale.z * groupScale
          );

          // 添加模型到场景中
          TE.addObject(newGroup);
        });
      });
    });

    return { threeRef };
  },
};
</script>

<style scoped>
.store {
  width: 100%;
  height: 100%;
}

.three-canvas {
  width: 100%;
  height: 100%;
}
</style>
