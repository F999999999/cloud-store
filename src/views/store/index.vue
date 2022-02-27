<template>
  <div class="store">
    <div class="three-canvas" ref="threeRef"></div>
    <operation-panel />
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { TEngine } from "@/utils/three";
import { lightsList } from "@/utils/three/TLinghts";
import { basicObjectList } from "@/utils/three/TBasicObject";
import { helperList } from "@/utils/three/THelper";
import { ContainerMobile } from "@/utils/three/loadModel/containerMobile";
import { ShelfMobile } from "@/utils/three/loadModel/shelfMobile";
import { shelfLocation } from "@/utils/modelLocation/shelfModelLocation";
import OperationPanel from "@/views/store/components/operationPanel";
// import { CameraHelper } from "three";

export default {
  name: "Store",
  components: { OperationPanel },
  setup() {
    const threeRef = ref(null);

    //货架示例数据
    const shelfArr = [
      {
        id: 1,
        name: "shelf1",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        id: 2,
        name: "shelf2",
        position: { x: 1, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        id: 3,
        name: "shelf3",
        position: { x: 2, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        id: 4,
        name: "shelf4",
        position: { x: 1, y: 0, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    ];
    // 箱子示例数据
    const containerArr = [
      {
        name: "box",
        shelf_id: 1,
        shelf_base_id: 1,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box1",
        shelf_id: 1,
        shelf_base_id: 2,
        position: { x: 1, y: 0, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box2",
        shelf_id: 1,
        shelf_base_id: 3,
        position: { x: 0, y: 0, z: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box3",
        shelf_id: 1,
        shelf_base_id: 4,
        position: { x: 1, y: 0, z: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box4",
        shelf_id: 1,
        shelf_base_id: 6,
        position: { x: 0, y: 0, z: 4 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box5",
        shelf_id: 1,
        shelf_base_id: 12,
        position: { x: 0, y: 0, z: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box",
        shelf_id: 1,
        shelf_base_id: 19,
        position: { x: 0, y: 1, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box",
        shelf_id: 1,
        shelf_base_id: 21,
        position: { x: 0, y: 1, z: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box",
        shelf_id: 2,
        shelf_base_id: 22,
        position: { x: 0, y: 1, z: 6 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box",
        shelf_id: 1,
        shelf_base_id: 25,
        position: { x: 0, y: 1, z: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box",
        shelf_id: 1,
        shelf_base_id: 39,
        position: { x: 0, y: 1, z: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box",
        shelf_id: 4,
        shelf_base_id: 66,
        position: { x: 0, y: 2, z: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
      {
        name: "box",
        shelf_id: 2,
        shelf_base_id: 20,
        position: { x: 0, y: 3, z: 3 },
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
      // 相机辅助
      // TE.addObject(new CameraHelper(TE.camera));

      // 货架模型间距
      const shelfSpacing = { x: 500, y: 466, z: -1000 };

      // 遍历数据渲染货架模型
      ShelfMobile.then((group) => {
        console.log("=货架模型=", group);
        // 模型缩放比例
        const groupScale = 100;
        // 遍历渲染模型
        shelfArr.forEach((item) => {
          // 复制模型
          const newGroup = group.scene.children[0].clone();
          // 遍历每个位置
          newGroup.children.forEach((child, i) => {
            newGroup.children[i].data = {
              id: Number(child.name.slice(-3)),
              shelf_id: item.id,
            };
          });

          // 设置名称
          newGroup.name = "shelf";

          // 保存货架数据
          newGroup.data = item;

          // 设置模型的位置
          newGroup.position.set(
            item.position.x * shelfSpacing.x,
            item.position.y * shelfSpacing.y,
            item.position.z * shelfSpacing.z
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

      // 遍历数据渲染箱子模型
      ContainerMobile.then((group) => {
        console.log("=箱子模型=", group);
        // 模型缩放比例
        const groupScale = 80;
        // 遍历渲染模型
        containerArr.forEach((item) => {
          // 复制模型
          let newGroup = group.scene.clone();
          newGroup = newGroup.children[0].clone();
          // 设置名称
          newGroup.name = "goods";

          // 保存箱子数据
          newGroup.data = item;

          // 查找货架
          const shelf = shelfArr.find((shelf) => shelf.id === item.shelf_id);
          // console.log(
          //   "shelf: ",
          //   shelf,
          //   shelf.position.x,
          //   shelfLocation[item.shelf_base_id - 1],
          //   item.shelf_base_id
          // );
          // 设置模型的位置
          newGroup.position.set(
            shelf.position.x * shelfSpacing.x +
              shelfLocation[item.shelf_base_id - 1].x,
            shelf.position.y * shelfSpacing.y +
              shelfLocation[item.shelf_base_id - 1].y,
            shelf.position.z * shelfSpacing.z +
              shelfLocation[item.shelf_base_id - 1].z
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

      console.log("TE", TE);
    });

    return { threeRef };
  },
};
</script>

<style scoped>
.store {
  position: relative;
  width: 100%;
  height: 100%;
}

.three-canvas {
  width: 100%;
  height: 100%;
}
</style>
