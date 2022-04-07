<template>
  <div class="store">
    <div class="three-canvas" ref="threeRef"></div>
    <operation-panel
      :storeId="storeId"
      :height="fullHeight - 160"
      style="top: 80px; left: 40px"
    />
    <!--货架标签-->
    <template ref="shelfTagRef">
      <shelf-tag
        v-for="shelfTagData in shelfList"
        :key="shelfTagData.id"
        :shelfTagData="shelfTagData"
      />
    </template>
    <!--货物标签-->
    <goods-tag
      v-for="goodsTagData in goodsList"
      :key="goodsTagData.id"
      :goodsTagData="goodsTagData"
      :shelf="shelfList.find((item) => item.id === goodsTagData.shelf_id)"
    >
      <a-tag color="orange">拖动可以移动货物位置</a-tag>
    </goods-tag>
    <!--移动确认框-->
    <div
      class="confirm-box"
      v-show="goodsMoveConfirmVisible"
      :style="{
        top: mousePosition.y + 'px',
        left: mousePosition.x + 'px',
      }"
    >
      <a-button type="primary" @click="goodsMoveOk">确认</a-button>
      <a-button type="primary" danger @click="goodsMoveCancel">取消</a-button>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import OperationPanel from "@/views/store/components/operationPanel";
import ShelfTag from "@/components/shelfTag";
import GoodsTag from "@/components/goodsTag";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import router from "@/router";
import { message } from "ant-design-vue";
import { useTEngine } from "@/hooks/useTEngine";
import labelRenderer from "@/utils/three/CSS2DRenderer";
import { toggleShelfBaseEmissive } from "@/hooks/useShelf";
import TDragControls from "@/utils/three/TDragControls";
import Outline from "@/utils/three/TOutline";
import {
  isShelfMove,
  isShelfOverlap,
  updateOneGoodsModelPosition,
} from "@/hooks/useGoods";
import TRaycaster from "@/utils/three/TRaycaster";
import getMousePosition from "@/utils/getMousePosition";

export default {
  name: "Store",
  components: { GoodsTag, ShelfTag, OperationPanel },
  setup() {
    // 鼠标位置
    const mousePosition = ref({ x: 0, y: 0 });

    // 获取路由
    const route = useRoute();
    // 仓库ID
    const storeId = Number(route.query.id);
    if (!route.query.id) {
      // 跳转到首页
      router.push("/").then(() => {
        // 提示信息
        message.success("仓库不存在");
      });
    }

    // 获取 store
    const store = useStore();
    // three 绑定的元素
    const threeRef = ref(null);

    // 货架 Tag
    const shelfTagRef = ref(null);

    // 货架列表数据
    const shelfList = computed(() => store.state.shelf.shelfList);
    // 货物列表数据
    const goodsList = computed(() => store.state.goods.goodsList);

    // 获取货架列表数据
    store.dispatch("shelf/getShelfList", route.query.id).then(() => {
      // 获取商品列表数据
      store.dispatch("goods/getGoodsList", route.query.id);
    });

    // 拖放控制器
    let dragControls = null;
    // 移动的货物的事件对象
    let goodsMoveEvent = null;
    // 货物移动后的货架格子
    let goodsMoveShelfBaseMesh = null;
    // 货物移动确认框
    const goodsMoveConfirmVisible = ref(false);
    // 确认移动货物
    const goodsMoveOk = () => {
      // 移动货物
      store.dispatch("goods/moveGoods", {
        goodsId: dragControls.getCurrentDragControls().data.id,
        storeId: goodsMoveShelfBaseMesh.data.store_id,
        shelfId: goodsMoveShelfBaseMesh.data.shelf_id,
        shelfGridId: goodsMoveShelfBaseMesh.data.id,
      });
      // 清除货架格子的自发光
      toggleShelfBaseEmissive(goodsMoveShelfBaseMesh);
      // 关闭确认框
      goodsMoveConfirmVisible.value = false;
      // 提示消息
      message.success("移动成功");
    };
    // 取消货物移动
    const goodsMoveCancel = () => {
      // 还原货物位置
      updateOneGoodsModelPosition(goodsMoveEvent.object);
      // 清除货架格子的自发光
      toggleShelfBaseEmissive(goodsMoveShelfBaseMesh);
      // 关闭确认框
      goodsMoveConfirmVisible.value = false;
      // 提示消息
      message.warning("取消移动");
    };

    // DOM 渲染完成后执行
    onMounted(() => {
      const ThreeJS = useTEngine(threeRef.value);

      // 自动调整渲染器大小
      window.onresize = () => {
        return (() => {
          // 设置正投影相机大小
          ThreeJS.setOrthographicCameraSize(
            document.body.clientWidth,
            document.body.clientHeight
          );

          // 设置 Tag 标签的渲染大小参数
          labelRenderer.setSize(window.innerWidth, window.innerHeight);
        })();
      };

      // 射线投射器(鼠标选中模型对象)
      const raycaster = TRaycaster(
        ThreeJS.dom,
        ThreeJS.renderer,
        ThreeJS.scene,
        ThreeJS.camera
      );

      // 拖放控制器
      dragControls = TDragControls(ThreeJS.camera, ThreeJS.renderer);

      // 轮廓线渲染
      const outline = Outline(ThreeJS.renderer, ThreeJS.scene, ThreeJS.camera);
      // 添加轮廓线到渲染列表
      ThreeJS.addRenderAnim(outline.renderOutline);

      // 与射线相交的物体
      let intersectObjects = [];
      // 货物
      let goodsObjects = [];
      // 货架格子
      let shelfBaseObjects = [];
      // 拖放前的货架格子
      let beforeShelfBaseObjects = {};

      // 添加 CSS2D 渲染器到渲染列表
      ThreeJS.addRenderAnim(() =>
        labelRenderer.render(ThreeJS.scene, ThreeJS.camera)
      );

      // 监听鼠标指针移动事件
      ThreeJS.renderer.domElement.addEventListener("pointermove", (event) => {
        // 获取与射线相交的物体
        intersectObjects = raycaster.updateIntersects(event);
        // 判断是否有与射线相交的模型
        if (intersectObjects.length > 0) {
          // 遍历相交的模型
          intersectObjects.forEach((intersect) => {
            // 获取货架格子
            if (intersect?.object?.name.slice(0, 11) === "shelf_base_") {
              shelfBaseObjects.push(intersect);
            }
            // 获取货物
            if (intersect?.object?.name === "goods") {
              goodsObjects.push(intersect);
            }
          });
        }

        // 判断移动确认框是否显示
        if (!goodsMoveConfirmVisible.value) {
          // 如果拖放控制器处于拖放状态则添加货架格子自发光属性
          beforeShelfBaseObjects = toggleShelfBaseEmissive(
            beforeShelfBaseObjects,
            shelfBaseObjects,
            0x118ee9,
            dragControls.getDragState()
          );
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
          }

          // 将当前货物添加到可拖放列表
          dragControls.addDragControlsObject(selectedObject);
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
      });

      // 监听鼠标左键按下事件
      // TE.renderer.domElement.addEventListener("mousedown", () => {
      //   console.log("mousedown", intersectObjects);
      //   const _goodsObjects = [];
      //   // 遍历相交的模型
      //   intersectObjects.forEach((intersect) => {
      //     // 判断是否是货物
      //     if (intersect?.object?.name === "goods") {
      //       // 判断是否处于拖放状态
      //       if (!dragControls.getDragState()) {
      //         // 显示货物 Tag 标签
      //         store.commit("goods/changeGoodsTagShow", {
      //           id: intersect.object.data.id,
      //           tagShow: true,
      //         });
      //       }
      //       _goodsObjects.push(intersect);
      //     }
      //   });
      //   // 判断是否捕获到货物
      //   if (_goodsObjects.length > 0) {
      //     // 将当前货物添加到可拖放列表
      //     dragControls.addDragControlsObject(_goodsObjects[0].object);
      //   }
      // });

      // 监听鼠标左键按下事件
      ThreeJS.renderer.domElement.addEventListener("mousedown", () => {
        // 判断是否有与射线相交的模型
        if (intersectObjects.length > 0) {
          const currentGoodsObject = intersectObjects.find(
            (object) => object?.object?.name === "goods"
          );
          // 判断是否有货物
          if (currentGoodsObject) {
            console.log("currentGoodsObject", currentGoodsObject);
          }
        }
      });

      // 开始拖拽时执行
      dragControls.addEventListener("dragstart", (event) => {
        if (goodsMoveConfirmVisible.value === true) {
          goodsMoveCancel();
        }

        // 设置拖放状态为正在拖放
        dragControls.setDragState(true);

        // 隐藏移动确认框
        goodsMoveConfirmVisible.value = false;

        // 保存当前被拖放的物体
        dragControls.setCurrentDragControls({
          // 克隆当前被拖拽的物体
          ...event.object.clone(),
          // 附加被拖放物体的自定义数据
          data: event.object.data,
        });

        // 隐藏货物 Tag 标签
        store.commit("goods/changeGoodsTagShow", {
          id: intersectObjects[0].object.data.id,
          tagShow: false,
        });
      });

      // 拖拽中执行
      dragControls.addEventListener("drag", () => {
        // 获取与射线相交的物体
        intersectObjects = raycaster.updateIntersects(event);
        const currentMesh = intersectObjects.find(
          (object) => object.object.name.slice(0, 11) === "shelf_base_"
        )?.object;
        if (currentMesh) {
          const shelf = shelfList.value.find(
            (shelf) => shelf.id === currentMesh.data.shelf_id
          );
          const grid = shelf.shelf_grid.find(
            (grid) => grid.shelf_grid_id === currentMesh.data.id
          );
          console.log(
            currentMesh,
            `${grid.position.y + 1}层 ${grid.position.x + 1}行 ${
              grid.position.z + 1
            }列(${grid.shelf_grid_id})`
          );
        }
      });

      // 完成拖拽时执行
      dragControls.addEventListener("dragend", (event) => {
        // 设置拖放状态为未在拖放
        dragControls.setDragState(false);

        // 保存当前移移动的货物的事件对象
        goodsMoveEvent = event;

        // 获取鼠标位置
        mousePosition.value = getMousePosition();
        console.log("mousePosition", mousePosition.value);

        // 获取鼠标指向的货架格子
        goodsMoveShelfBaseMesh = intersectObjects.find(
          (item) => item.object.name.slice(0, 11) === "shelf_base_"
        )?.object;
        // 判断是否拖拽到货架格子
        if (goodsMoveShelfBaseMesh) {
          // 判断货物是否移动
          if (
            !isShelfMove(
              event.object,
              dragControls.getCurrentDragControls(),
              goodsMoveShelfBaseMesh
            )
          )
            return message.warning("货架格子未进行更改");

          // 判断货物是否重叠
          if (isShelfOverlap(event.object, goodsMoveShelfBaseMesh))
            return message.warning("该货架格子已被使用");

          // 弹出确认框
          goodsMoveConfirmVisible.value = true;
        } else {
          // 还原货物位置
          updateOneGoodsModelPosition(event.object);
        }
      });
    });

    return {
      storeId,
      threeRef,
      shelfTagRef,
      shelfList,
      goodsList,
      fullHeight: window.innerHeight,
      goodsMoveConfirmVisible,
      goodsMoveOk,
      goodsMoveCancel,
      mousePosition,
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

.confirm-box {
  position: absolute;
  display: flex;
  flex-direction: column;
}
</style>
