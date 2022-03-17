<template>
  <div class="store">
    <div class="three-canvas" ref="threeRef"></div>
    <operation-panel
      :storeId="storeId"
      :height="fullHeight - 160"
      style="top: 80px; left: 40px"
    />
    <template ref="shelfTagRef">
      <shelf-tag
        v-for="shelfTagData in shelfList"
        :key="shelfTagData.id"
        :shelfTagData="shelfTagData"
      />
    </template>
    <div ref="goodsTagRef">
      <goods-tag
        v-for="goodsTagData in goodsList"
        :key="goodsTagData.id"
        :goodsTagData="goodsTagData"
        :shelf="shelfList.find((item) => item.id === goodsTagData.shelf_id)"
      >
        <a-tag color="orange">双击并拖动可以移动货物位置</a-tag>
      </goods-tag>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { TEngine } from "@/utils/three";
import { lightsList } from "@/utils/three/TLinghts";
import { basicObjectList } from "@/utils/three/TBasicObject";
// import { helperList } from "@/utils/three/THelper";
// import { CameraHelper } from "three";
import { shelfLocation } from "@/utils/modelLocation/shelfModelLocation";
import OperationPanel from "@/views/store/components/operationPanel";
import { useStore } from "vuex";
import TRaycaster from "@/utils/three/TRaycaster";
import Outline from "@/utils/three/TOutline";
import TDragControls from "@/utils/three/TDragControls";
import cameraControls from "@/utils/three/CameraControls";
import labelRenderer from "@/utils/three/CSS2DRenderer";
import { goodsTag, shelfTag } from "@/utils/three/CSS2DObject";
import ShelfTag from "@/components/shelfTag";
import GoodsTag from "@/components/goodsTag";
import { useGoodsModel } from "@/hooks/useGoods";
import { useShelfModel } from "@/hooks/useShelf";
import { useRoute } from "vue-router";
import router from "@/router";
import { message } from "ant-design-vue";

export default {
  name: "Store",
  components: { GoodsTag, ShelfTag, OperationPanel },
  setup() {
    // 获取路由
    const route = useRoute();
    // 仓库ID
    const storeId = Number(route.query.id);
    if (!route.query.id) {
      // 跳转到登录页面
      router.push("/login").then(() => {
        // 提示信息
        message.success("仓库不存在");
      });
    }

    // 获取 store
    const store = useStore();
    // three 绑定的元素
    const threeRef = ref(null);
    // 实例化的 ThreeJS
    let ThreeJs = ref(null);

    // 货架 Tag
    const shelfTagRef = ref(null);

    // 货物 Tag
    const goodsTagRef = ref(null);

    // 货架列表数据
    const shelfList = computed(() => store.state.shelf.shelfList);
    // 获取货架列表数据
    store.dispatch("shelf/getShelfList", route.query.id);
    // 货物列表数据
    const goodsList = computed(() => store.state.goods.goodsList);

    // DOM 渲染完成后执行
    onMounted(() => {
      // 实例化 ThreeJs
      const TE = new TEngine(threeRef.value);
      ThreeJs.value = TE;

      window.onresize = () => {
        return (() => {
          // 设置正投影相机大小
          TE.setOrthographicCameraSize(
            document.body.clientWidth,
            document.body.clientHeight
          );

          // 设置 Tag 标签的渲染大小参数
          labelRenderer.setSize(
            window.innerWidth - 240,
            window.innerHeight - 240
          );
        })();
      };

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
              // 隐藏货物 Tag 标签显示状态
              store.commit("goods/changeGoodsTagShow", {
                id: item.id,
                tagShow: false,
              });
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
      TE.renderer.domElement.addEventListener("mousedown", () => {
        const _goodsObjects = [];
        // 遍历相交的模型
        intersectObjects.forEach((intersect) => {
          // 判断是否是货物
          if (intersect?.object?.name === "goods") {
            // 判断是否处于拖放状态
            if (!dragControls.getDragState()) {
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

      // 开始拖拽时执行
      dragControls.addEventListener("dragstart", (event) => {
        if (dragControls.getCurrentDragControls().length <= 0) {
          // 克隆当前被拖拽的物体
          const object = event.object.clone();
          // 当前被拖放物体的自定义数据
          object.data = event.object.data;
          // 保存当前被拖放的物体
          dragControls.setCurrentDragControls(object);
        }

        // 设置拖放状态为正在拖放
        dragControls.setDragState(true);

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

      // 渲染货架模型
      const addShelfModel = async (shelf, show = false) => {
        const shelfModel = await useShelfModel({ shelf });

        // 添加货架 Tag 标签显示状态
        store.commit("shelf/changeShelfTagShow", {
          id: shelf.id,
          tagShow: show,
        });

        // 添加 CSS2DObject 标签
        Promise.resolve(shelfModel).then((shelf) => {
          // 查找货架的 domElement 元素
          for (let domElement of shelfTagRef.value.children) {
            if (Number(domElement.getAttribute("data-id")) === shelf.data.id) {
              // 生成货架的 Tag 标签
              const tag = shelfTag(
                domElement,
                shelf.data.name,
                shelf.data.position
              );
              // 添加货架的 Tag 标签
              shelf.add(tag);
            }
          }
        });

        return shelfModel;
      };

      watch(
        () => shelfList.value.length,
        () => {
          // 获取商品列表数据
          store.dispatch("goods/getGoodsList", route.query.id);
          shelfList.value.forEach((item) => {
            // 添加货架模型
            addShelfModel(item).then((shelfModel) => {
              // 添加货架到场景中
              TE.addObject(shelfModel);
            });
          });
        }
      );

      // 渲染货物模型
      const addGoodsModel = async (goods, show = false) => {
        const goodsModel = await useGoodsModel({
          shelfList: shelfList.value,
          goods,
          groupScale: 80,
        });

        // 添加货物 Tag 标签显示状态
        store.commit("goods/changeGoodsTagShow", {
          id: goods.id,
          tagShow: show,
        });

        // 添加 CSS2DObject 标签
        Promise.resolve(goodsModel).then((goods) => {
          // 查找货物的 domElement 元素
          for (let domElement of goodsTagRef.value.children) {
            if (Number(domElement.getAttribute("data-id")) === goods.data.id) {
              // 生成货架的 Tag 标签
              const tag = goodsTag(
                domElement,
                goods.data.name,
                goods.data.position
              );
              // 添加货架的 Tag 标签
              goods.add(tag);
            }
          }
        });

        return goodsModel;
      };

      // 监听货物列表数据渲染模型
      watch(
        () => goodsList.value,
        (newValue, oldValue) => {
          if (shelfList.value.length > 0) {
            if (newValue.length > oldValue.length) {
              // 新增
              // 根据数据渲染货物模型
              newValue.forEach((item) => {
                addGoodsModel(item).then((goodsModel) => {
                  // 添加货物到场景中
                  TE.addObject(goodsModel);
                });
              });
            } else if (newValue.length < oldValue.length) {
              // 删除
              // 被移除的货物
              const removeGoods = oldValue.filter(
                (oldGoods) =>
                  !newValue.find((newGoods) => newGoods.id === oldGoods.id)
              );
              // 递归遍历组对象group释放所有后代网格模型绑定几何体占用内存
              TE.scene.children.forEach((obj) => {
                if (obj.type === "Mesh" && obj.name === "goods") {
                  // 当前货物是否是被删除的货物
                  const remove =
                    removeGoods.findIndex(
                      (goods) => goods.id === obj.data.id
                    ) >= 0;
                  if (remove) {
                    // 从内存中删除对象
                    obj.geometry.dispose();
                    obj.material.dispose();
                    // 删除场景对象scene的子对象group
                    TE.scene.remove(obj);
                  }
                }
              });
            }
          }
        }
      );

      // 设置 Tag 标签的渲染参数
      labelRenderer.setSize(window.innerWidth - 240, window.innerHeight - 240);
      labelRenderer.domElement.style.left = "240px";
      labelRenderer.domElement.style.top = "240px";
      // 添加 CSS 2D渲染器到渲染列表
      TE.addRenderAnim(() => labelRenderer.render(TE.scene, TE.camera));

      console.log("TE", TE);
    });

    return {
      storeId,
      threeRef,
      shelfTagRef,
      shelfList,
      goodsTagRef,
      goodsList,
      fullHeight: window.innerHeight,
    };
  },
};
</script>

<style lang="less" scoped>
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
