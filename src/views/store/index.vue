<template>
  <div class="store">
    <div class="three-canvas" ref="threeRef"></div>
    <operation-panel />
    <button style="position: absolute; top: 0; left: 0">hhhhhh</button>
    <template ref="shelfTagRef">
      <shelf-tag
        v-for="shelfTag in shelfList"
        :key="shelfTag.id"
        :tagShow="shelfTag.tagShow"
        :id="shelfTag.id"
        :name="shelfTag.name"
        :size="shelfTag.size"
        :position="shelfTag.position"
      />
    </template>
    <div ref="goodsTagRef">
      <goods-tag
        v-for="goodsTagData in goodsList"
        :key="goodsTagData.id"
        :tagShow="goodsTagData.tagShow"
        :tagShowTimer="goodsTagData.tagShowTimer"
        :title="goodsTagData.title"
        :id="goodsTagData.id"
        :name="goodsTagData.name"
        :shelf_id="goodsTagData.shelf_id"
        :shelf_grid_id="goodsTagData.shelf_grid_id"
        :weight="goodsTagData.weight"
        :shelflife="goodsTagData.shelflife"
        :production_date="goodsTagData.production_date"
        :storage_time="goodsTagData.storage_time"
        :persistentShow="goodsTagData.persistentShow"
      />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { TEngine } from "@/utils/three";
import { lightsList } from "@/utils/three/TLinghts";
import { basicObjectList } from "@/utils/three/TBasicObject";
// import { helperList } from "@/utils/three/THelper";
import { ContainerMobile } from "@/utils/three/loadModel/containerMobile";
import { ShelfMobile } from "@/utils/three/loadModel/shelfMobile";
import { shelfLocation } from "@/utils/modelLocation/shelfModelLocation";
import OperationPanel from "@/views/store/components/operationPanel";
import { useStore } from "vuex";
import TRaycaster from "@/utils/three/TRaycaster";
import Outline from "@/utils/three/TOutline";
import TDragControls from "@/utils/three/TDragControls";
import cameraControls from "@/utils/three/CameraControls";
import labelRenderer from "@/utils/three/CSS2DRenderer";
import { goodsTag, shelfTag } from "@/utils/three/CSS2DObject";
import ShelfTag from "@/views/store/components/shelfTag";
import GoodsTag from "@/views/store/components/goodsTag";
// import { CameraHelper } from "three";

export default {
  name: "Store",
  components: { GoodsTag, ShelfTag, OperationPanel },
  setup() {
    // three 绑定的元素
    const threeRef = ref(null);
    // 实例化的 ThreeJS
    let ThreeJs = ref(null);
    // 获取 store
    const store = useStore();

    // 货架 Tag
    const shelfTagRef = ref(null);

    // 货物 Tag
    const goodsTagRef = ref(null);

    // 货架列表数据
    const shelfList = computed(() => store.state.shelf.shelfList);
    // 获取货架列表数据
    store.dispatch("shelf/getShelfList");
    // 货物列表数据
    const goodsList = computed(() => store.state.goods.goodsList);
    // 获取商品列表数据
    store.dispatch("goods/getGoodsList");
    // 货架模型间距
    const shelfSpacing = { x: 240 + 260, y: 466, z: -1000 };

    // DOM 渲染完成后执行
    onMounted(() => {
      // 实例化 ThreeJs
      const TE = new TEngine(threeRef.value);
      ThreeJs.value = TE;
      // 辅助工具
      // TE.addObject(...helperList);
      // 光源
      TE.addObject(...lightsList);
      // 基本网格模型
      TE.addObject(...basicObjectList);
      // 相机辅助
      // TE.addObject(new CameraHelper(TE.camera));

      // 相机控制器
      const TCameraControls = cameraControls(TE.renderer, TE.scene, TE.camera);
      // 添加相机控制器到渲染列表
      TE.addRenderAnim(TCameraControls.renderCamera);

      // 射线投射器(鼠标选中模型对象)
      const raycaster = TRaycaster(TE.dom, TE.renderer, TE.scene, TE.camera);

      // 轮廓线渲染
      const outline = Outline(TE.renderer, TE.scene, TE.camera);
      // 添加轮廓线到渲染列表
      TE.addRenderAnim(outline.renderOutline);

      // 拖放控制器
      const dragControls = TDragControls(TE.camera, TE.renderer);

      // 货架格子
      let shelfBaseObjects = [];
      // 拖放前的货架格子
      let beforeShelfBaseObjects = [];
      // 货物
      let goodsObjects = [];
      // 与射线相交的物体
      let intersectObjects = [];

      // 监听鼠标指针移动事件
      TE.renderer.domElement.addEventListener("pointermove", (event) => {
        // 获取与射线相交的物体
        intersectObjects = raycaster.updateIntersects(event);

        // 判断是否有与射线相交的模型
        if (intersectObjects.length > 0) {
          // 遍历相交的模型
          intersectObjects.forEach((intersect) => {
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
            beforeShelfBaseObjects.forEach((item) => {
              // 清除颜色
              item.object.material.emissive.set(0x000000);
            });
            // 清空之前被选中的货架格子
            beforeShelfBaseObjects = [];

            // 货架格子添加颜色
            // 只渲染第一个货架格子
            shelfBaseObjects[0].object.material.emissive.set(0x118ee9);
            // 保存被选中的货架格子
            beforeShelfBaseObjects.push(shelfBaseObjects[0]);
          } else {
            // 清除之前被选中的货架格子的颜色
            beforeShelfBaseObjects.forEach((item) => {
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
            // 判断是否处于拖放状态
            if (!dragControls.getDragState()) {
              // 隐藏货物 Tag 标签
              store.commit("goods/changeGoodsTagShow", {
                all: true,
                tagShow: false,
              });
              // 显示货物 Tag 标签
              store.commit("goods/changeGoodsTagShow", {
                id: selectedObject.data.id,
                tagShow: true,
              });
              // 显示货物详情
              // goodsList.value.forEach((item, i) => {
              //   // 隐藏未选中的并显示选中的
              //   goodsList.value[i].tagShow = item.id === selectedObject.data.id;
              // });
            }
          } else {
            // 清除描边效果
            outline.outlinePass.selectedObjects = [];
            // 清空被拖放的物体
            dragControls.clearDragControlsObject();

            // 隐藏货物详情
            goodsList.value.forEach((item) => {
              if (!item.persistentShow) {
                // 隐藏货物 Tag 标签显示状态
                store.commit("goods/changeGoodsTagShow", {
                  id: item.id,
                  tagShow: false,
                });
                // goodsList.value[i].tagShow = false;
              }
            });
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

      // 监听鼠标左键按下事件
      TE.renderer.domElement.addEventListener("mousedown", (event) => {
        console.log("mousedown", intersectObjects, event);
        const _goodsObjects = [];
        // 遍历相交的模型
        intersectObjects.forEach((intersect) => {
          // 判断是否是货物
          if (intersect?.object?.name === "goods") {
            // 判断是否处于拖放状态
            if (!dragControls.getDragState()) {
              // 设置货物 tag 标签持久显示
              store.commit("goods/changeGoodsTagPersistentShow", {
                id: intersect.object.data.id,
                tagPersistentShow: true,
              });

              // 显示货物 Tag 标签
              store.commit("goods/changeGoodsTagShow", {
                id: intersect.object.data.id,
                tagShow: true,
              });
            }
            _goodsObjects.push(intersect);
          }
        });
        // 判断是否捕获到货物
        if (_goodsObjects.length > 0) {
          // 当前货物
          const selectedObject = _goodsObjects[0].object;
          // 添加到可拖放列表
          dragControls.addDragControlsObject(selectedObject);
        }
      });

      // 鼠标移入时执行
      dragControls.addEventListener("hoveron", (event) => {
        // 克隆当前被拖拽的物体
        const object = event.object.clone();
        // 当前被拖放物体的自定义数据
        object.data = event.object.data;
        // 保存当前被拖放的物体
        dragControls.setCurrentDragControls(object);
      });

      // 开始拖拽时执行
      dragControls.addEventListener("dragstart", () => {
        // 设置拖放状态为正在拖放
        dragControls.setDragState(true);

        // 取消货物 tag 标签持久显示
        store.commit("goods/changeGoodsTagPersistentShow", {
          id: intersectObjects[0].object.data.id,
          tagPersistentShow: false,
        });

        // 隐藏货物 Tag 标签
        store.commit("goods/changeGoodsTagShow", {
          id: intersectObjects[0].object.data.id,
          tagShow: false,
        });
      });

      // dragControls.addEventListener("drag", () => {});

      // 完成拖拽时执行
      dragControls.addEventListener("dragend", (event) => {
        // 设置拖放状态为未在拖放
        dragControls.setDragState(false);

        // 过滤鼠标指向的货架格子
        const shelfBaseMesh = intersectObjects.find(
          (item) => item.object.name.slice(0, 11) === "shelf_base_"
        );

        // 判断是否拖拽到货架格子
        if (shelfBaseMesh) {
          console.log("shelfBaseMesh", shelfBaseMesh);
          // 判断货架格子是否更改
          if (
            shelfBaseMesh.object.data.id ===
              dragControls.getCurrentDragControls().data.shelf_grid_id &&
            shelfBaseMesh.object.data.shelf_id ===
              dragControls.getCurrentDragControls().data.shelf_id
          ) {
            // 货架格子未进行更改
            console.log("货架格子未进行更改");
            // 货物位置还原
            event.object.position.set(
              dragControls.getCurrentDragControls().position.x,
              dragControls.getCurrentDragControls().position.y,
              dragControls.getCurrentDragControls().position.z
            );
            return;
          }

          // 生成新的货物列表
          const newGoodList = goodsList.value.map((item) => {
            if (
              item.shelf_id === event.object.data.shelf_id &&
              item.shelf_grid_id === event.object.data.shelf_grid_id
            ) {
              item.shelf_id = shelfBaseMesh.object.data.shelf_id;
              item.shelf_grid_id = shelfBaseMesh.object.data.id;
              return item;
            } else {
              return item;
            }
          });

          // 判断货物是否重叠
          if (
            newGoodList.filter(
              (item) =>
                item.shelf_id === event.object.data.shelf_id &&
                item.shelf_grid_id === event.object.data.shelf_grid_id
            ).length > 1
          ) {
            // 货物重叠
            console.log("货物重叠");

            // 物体闪烁
            event.object.material.emissive.set(0xff0000);
            setTimeout(() => {
              event.object.material.emissive.set(0x000000);
              setTimeout(() => {
                event.object.material.emissive.set(0xff0000);
                setTimeout(() => {
                  event.object.material.emissive.set(0x000000);
                  // 货物位置还原
                  event.object.position.set(
                    dragControls.getCurrentDragControls().position.x,
                    dragControls.getCurrentDragControls().position.y,
                    dragControls.getCurrentDragControls().position.z
                  );
                }, 200);
              }, 200);
            }, 200);

            return;
          }
          // 更新数据
          store.commit("goods/changeGoods", newGoodList);
          // 更新货物数据
          event.object.data = {
            ...event.object.data,
            shelf_id: shelfBaseMesh.object.data.shelf_id,
            shelf_grid_id: shelfBaseMesh.object.data.id,
          };
          // 把货物放入货架格子
          event.object.position.set(
            shelfBaseMesh.object.parent.position.x +
              shelfLocation[shelfBaseMesh.object.data.id - 1].x,
            shelfBaseMesh.object.parent.position.y +
              shelfLocation[shelfBaseMesh.object.data.id - 1].y,
            shelfBaseMesh.object.parent.position.z +
              shelfLocation[shelfBaseMesh.object.data.id - 1].z
          );
        } else {
          // 还原货物位置
          event.object.position.set(
            dragControls.getCurrentDragControls().position.x,
            dragControls.getCurrentDragControls().position.y,
            dragControls.getCurrentDragControls().position.z
          );
        }
      });

      // 遍历数据渲染货架模型
      ShelfMobile.then((group) => {
        console.log("=货架模型=", group);
        // 模型缩放比例
        const groupScale = 100;
        // 遍历渲染模型
        shelfList.value.forEach((item, i) => {
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

          // 添加货架 Tag 标签显示状态
          store.commit("shelf/changeShelfTagShow", {
            id: item.id,
            tagShow: false,
          });

          // 添加 CSS2DObject 标签
          Promise.resolve(i).then((i) => {
            console.log("shelfTagRef.value", shelfTagRef.value);
            // 生成货架的 Tag 标签
            const tag = shelfTag(
              shelfTagRef.value.children[i],
              shelfList.value[i].name,
              shelfList.value[i].position
            );
            // 添加货架的 Tag 标签
            newGroup.add(tag);
          });

          // 添加模型到场景中
          TE.addObject(newGroup);
        });
      });

      // 遍历数据渲染货物模型
      ContainerMobile.then((group) => {
        console.log("=货物模型=", group);
        // 模型缩放比例
        const groupScale = 80;
        // 遍历渲染模型
        goodsList.value.forEach((item, i) => {
          // 复制模型
          let newGroup = group.scene.children[0].clone();
          newGroup.material = group.scene.children[0].material.clone();
          // 设置名称
          newGroup.name = "goods";
          // 保存货物数据
          newGroup.data = item;
          // 查找货架
          const shelf = shelfList.value.find(
            (shelf) => shelf.id === item.shelf_id
          );
          // 设置货物的位置
          newGroup.position.set(
            shelf.position.x * shelfSpacing.x +
              shelfLocation[item.shelf_grid_id - 1].x,
            shelf.position.y * shelfSpacing.y +
              shelfLocation[item.shelf_grid_id - 1].y,
            shelf.position.z * shelfSpacing.z +
              shelfLocation[item.shelf_grid_id - 1].z
          );

          // 设置缩放比例
          newGroup.scale.set(
            item?.scale?.x ? item.scale.x * groupScale : groupScale,
            item?.scale?.y ? item.scale.y * groupScale : groupScale,
            item?.scale?.z ? item.scale.z * groupScale : groupScale
          );

          // 添加货物 Tag 标签显示状态
          store.commit("goods/changeGoodsTagShow", {
            id: item.id,
            tagShow: false,
          });

          // 添加货物 Tag 标签持久显示状态
          store.commit("goods/changeGoodsTagPersistentShow", {
            id: item.id,
            tagPersistentShow: false,
          });

          // 添加货物 Tag 标签显示时间
          store.commit("goods/changeGoodsTagShowTime", {
            id: item.id,
            tagShowTimer: 6000,
          });

          // 添加 CSS2DObject 标签
          Promise.resolve(i).then((i) => {
            // 生成货物的 Tag 标签
            const tag = goodsTag(
              goodsTagRef.value.children[i],
              goodsList.value[i].name,
              goodsList.value[i].position
            );
            // 添加货物的 Tag 标签
            newGroup.add(tag);
          });

          // 添加模型到场景中
          TE.addObject(newGroup);
        });
      });

      // 添加 CSS 2D渲染器到渲染列表
      TE.addRenderAnim(() => labelRenderer.render(TE.scene, TE.camera));

      console.log("TE", TE);
    });

    return {
      threeRef,
      shelfTagRef,
      shelfList,
      goodsTagRef,
      goodsList,
    };
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
