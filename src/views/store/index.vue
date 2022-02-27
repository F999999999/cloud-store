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
import TRaycaster from "@/utils/three/TRaycaster";
import Outline from "@/utils/three/TOutline";
import TDragControls from "@/utils/three/TDragControls";
import cameraControls from "@/utils/three/CameraControls";
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
      // 实例化 ThreeJs
      const TE = new TEngine(threeRef.value);
      // 辅助工具
      TE.addObject(...helperList);
      // 光源
      TE.addObject(...lightsList);
      // 基本网格模型
      TE.addObject(...basicObjectList);
      // 相机辅助
      // TE.addObject(new CameraHelper(TE.camera));

      // 相机控制器
      const TCameraControls = cameraControls(TE.renderer, TE.scene, TE.camera);
      // 添加到更新渲染列表
      TE.addRenderAnim(TCameraControls.renderCamera);

      // 射线投射器(鼠标选中模型对象)
      const raycaster = TRaycaster(TE.dom, TE.renderer, TE.scene, TE.camera);

      // 轮廓线渲染
      const outline = Outline(TE.renderer, TE.scene, TE.camera);
      // 添加到更新渲染列表
      TE.addRenderAnim(outline.renderOutline);

      // 拖放控制器
      const dragControls = TDragControls(TE.camera, TE.renderer);

      // 货架格子
      let shelfBaseObjects = [];
      // 拖放前的货架格子
      let berfectShelfBaseObjects = [];
      // 货物
      let goodsObjects = [];

      // 监听鼠标指针移动事件
      TE.renderer.domElement.addEventListener("pointermove", (event) => {
        // 获取与射线相交的物体
        const intersects = raycaster.updateIntersects(event);
        // 传递射线选中的对象给拖放控制器
        dragControls.updateIntersectObjects(intersects);

        // 判断是否有与射线相交的模型
        if (intersects.length > 0) {
          // 遍历相交的模型
          intersects.forEach((intersect) => {
            // 判断是否是货架格子
            if (intersect?.object?.name.slice(0, 11) === "shelf_base_") {
              shelfBaseObjects.push(intersect);
            }
            // 判断是否是货物
            if (intersect?.object?.name === "goods") {
              goodsObjects.push(intersect);
            }
          });

          // 判断是否捕获到货架格子并且拖放控制器是否处于拖放状态
          if (shelfBaseObjects.length > 0 && dragControls.getDragState()) {
            // 清除之前被选中的货架格子的颜色
            berfectShelfBaseObjects.forEach((item) => {
              // 清除颜色
              item.object.material.emissive.set(0x000000);
            });
            // 清空之前被选中的货架格子
            berfectShelfBaseObjects = [];

            // 货架格子添加颜色
            shelfBaseObjects.forEach((item) => {
              item.object.material.emissive.set(0x118ee9);
              // 保存被选中的货架格子
              berfectShelfBaseObjects.push(item);
            });
          } else {
            // 清除之前被选中的货架格子的颜色
            berfectShelfBaseObjects.forEach((item) => {
              // 清除颜色
              item.object.material.emissive.set(0x000000);
            });
          }
          // 清空货架格子列表
          shelfBaseObjects = [];

          // 判断是否捕获到货物
          if (goodsObjects.length > 0) {
            // 当前货物
            const selectedObject = goodsObjects[0].object;
            // 添加到描边列表
            outline.outlinePass.selectedObjects = [selectedObject];
            // 添加被拖放的物体
            dragControls.addDragControlsObject(selectedObject);
          } else {
            // 清除描边效果
            outline.outlinePass.selectedObjects = [];
            // 清空被拖放的物体
            dragControls.clearDragControlsObject();
          }
          // 清空货物列表
          goodsObjects = [];
        } else {
          // 清除描边效果
          outline.outlinePass.selectedObjects = [];

          // 清空被拖放的物体
          dragControls.clearDragControlsObject();
        }
      });

      // 监听鼠标指针点击事件
      TE.renderer.domElement.addEventListener("click", (event) => {
        console.log("click", event);
      });

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
