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
import { useShelf } from "@/hooks/useShelf";
import { useGoods } from "@/hooks/useGoods";
// import { CameraHelper } from "three";

export default {
  name: "Store",
  components: { OperationPanel },
  setup() {
    const threeRef = ref(null);

    // 货架数据
    const { shelfList } = useShelf();
    // 货物数据
    const { goodsList } = useGoods();
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
        shelfList.forEach((item) => {
          // 复制模型
          const newGroup = group.scene.children[0].clone();
          // 遍历每个位置
          newGroup.children.forEach((child, i) => {
            // 给货架的每个位置都添加自定义属性
            newGroup.children[i].data = {
              id: Number(child.name.slice(-3)),
              shelf_id: item.id,
            };
            // 让货架每个位置的材质都变成独立的
            newGroup.children[i].material = child.material.clone();
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
          // 设置缩放比例
          newGroup.scale.set(
            item?.scale?.x ? item.scale.x * groupScale : groupScale,
            item?.scale?.y ? item.scale.y * groupScale : groupScale,
            item?.scale?.z ? item.scale.z * groupScale : groupScale
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
        goodsList.forEach((item) => {
          // 复制模型
          let newGroup = group.scene.children[0].clone();
          newGroup.material = group.scene.children[0].material.clone();
          // 设置名称
          newGroup.name = "goods";
          // 保存箱子数据
          newGroup.data = item;
          // 查找货架
          const shelf = shelfList.find((shelf) => shelf.id === item.shelf_id);
          // 设置箱子的位置
          newGroup.position.set(
            shelf.position.x * shelfSpacing.x +
              shelfLocation[item.shelf_base_id - 1].x,
            shelf.position.y * shelfSpacing.y +
              shelfLocation[item.shelf_base_id - 1].y,
            shelf.position.z * shelfSpacing.z +
              shelfLocation[item.shelf_base_id - 1].z
          );

          // 设置缩放比例
          newGroup.scale.set(
            item?.scale?.x ? item.scale.x * groupScale : groupScale,
            item?.scale?.y ? item.scale.y * groupScale : groupScale,
            item?.scale?.z ? item.scale.z * groupScale : groupScale
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
