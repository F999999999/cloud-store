<template>
  <div class="store">
    <div class="three-canvas" ref="threeRef"></div>
    <operation-panel
      :storeId="storeId"
      :height="fullHeight - 160"
      style="top: 80px; left: 40px"
    />
    <!--商品标签-->
    <goods-tag
      v-for="goodsTagData in goodsList"
      :key="goodsTagData.id"
      :goodsTagData="goodsTagData"
    >
      <span style="color: yellow">拖动可以移动商品位置</span>
    </goods-tag>
    <!--移动确认框-->
    <div
      class="move-confirm-box"
      v-show="goodsMoveConfirmVisible"
      :style="{
        top: mousePosition.y + 'px',
        left: mousePosition.x + 'px',
      }"
    >
      <a-button type="primary" @click="goodsMoveOk">确认移动</a-button>
      <a-button type="primary" danger @click="goodsMoveCancel">
        取消移动
      </a-button>
    </div>
    <!--右键菜单-->
    <div
      class="right-menu-box"
      v-show="goodsMoveRightMenuVisible"
      :style="{
        top: mousePosition.y + 'px',
        left: mousePosition.x + 'px',
      }"
    >
      <!--一级菜单-->
      <div
        v-show="goodsMoveRightMenuLevel === 1"
        @click="goodsMoveRightMenuLevel = 2"
      >
        <div
          style="
            display: block;
            position: absolute;
            top: -32px;
            left: 0;
            background-color: #282c34;
            border-radius: 6px;
            padding: 4px 6px 4px 4px;
            user-select: none;
          "
          @click="goodsMoveRightMenuVisible = false"
        >
          <span style="display: inline-block; vertical-align: middle">
            取消
          </span>
        </div>
        <a-button type="primary" @click="getGoodsLog"> 查询日志 </a-button>
        <a-button type="primary" danger @click="removeGoodsConfirm = true">
          出库
        </a-button>
      </div>
      <!--二级菜单-->
      <div v-if="goodsMoveRightMenuLevel === 2">
        <div
          style="
            display: block;
            position: absolute;
            top: -32px;
            left: 0;
            background-color: #282c34;
            border-radius: 6px;
            padding: 4px 6px 4px 4px;
            user-select: none;
          "
          @click="
            goodsMoveRightMenuLevel = 1;
            removeGoodsConfirm = false;
          "
        >
          <ArrowLeftOutlined
            style="
              display: inline-block;
              vertical-align: middle;
              font-size: 18px;
            "
          />
          <span style="display: inline-block; vertical-align: middle">
            返回
          </span>
        </div>

        <!--商品日志-->
        <goods-log-box
          :logList="currentGoodsLog.list"
          v-if="currentGoodsLog.goods_id && !removeGoodsConfirm"
        />
        <!--出库确认框-->
        <a-button
          type="primary"
          @click="
            () => {
              removeGoods();
              goodsMoveRightMenuVisible = false;
            }
          "
          v-if="removeGoodsConfirm"
        >
          确认出库
        </a-button>
        <a-button
          type="primary"
          danger
          @click="goodsMoveRightMenuVisible = false"
          v-if="removeGoodsConfirm"
        >
          取消出库
        </a-button>
      </div>
    </div>
    <!-- 拖拽时货架格子位置 Tag -->
    <div
      class="grid-tag-box"
      v-show="gridPositionTagVisible"
      :style="{
        top: mousePosition.y - 30 + 'px',
        left: mousePosition.x + 'px',
      }"
    >
      <a-tag color="green">{{ gridPositionTagValue }}</a-tag>
    </div>
  </div>
</template>

<script>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import OperationPanel from "@/views/store/components/operationPanel";
import GoodsTag from "@/components/goodsTag";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import router from "@/router";
import { message } from "ant-design-vue";
import { useTEngine } from "@/hooks/useTEngine";
import labelRenderer from "@/utils/three/CSS2DRenderer";
import { toggleShelfBaseEmissive } from "@/hooks/useShelf";
import TDragControls from "@/utils/three/TDragControls";
import { TOutlinePass } from "@/utils/three/TOutlinePass";
import {
  getGoodsMesh,
  isShelfMove,
  isShelfOverlap,
  updateOneGoodsModelPosition,
} from "@/hooks/useGoods";
import TRaycaster from "@/utils/three/TRaycaster";
import getMousePosition from "@/utils/getMousePosition";
import { getGoodsLogByIdApi } from "@/api/goods";
import GoodsLogBox from "@/components/goodsLogBox";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";

export default {
  name: "Store",
  components: { ArrowLeftOutlined, GoodsLogBox, GoodsTag, OperationPanel },
  setup() {
    // 鼠标位置
    const mousePosition = ref({ x: 0, y: 0 });
    // 获取路由
    const route = useRoute();
    // ThreeJS 实例
    let ThreeJS = null;
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

    // 货架列表数据
    const shelfList = computed(() => store.state.shelf.shelfList);
    // 商品列表数据
    const goodsList = computed(() => store.state.goods.goodsList);

    // 获取货架列表数据
    store.dispatch("shelf/getShelfList", storeId).then(() => {
      // 获取商品列表数据
      store.dispatch("goods/getGoodsList", storeId);
      // 获取临期商品
      store.dispatch("goods/getExpireGoodsList", { storeId });
    });

    // 拖放控制器
    let dragControls = null;
    // 移动的商品的事件对象
    let goodsMoveEvent = null;
    // 商品移动后的货架格子
    let goodsMoveShelfBaseMesh = null;
    // 货架格子位置 Tag 是否显示
    const gridPositionTagVisible = ref(false);
    // 货架格子位置 Tag 的内容
    const gridPositionTagValue = ref("");

    // 商品移动确认框
    const goodsMoveConfirmVisible = ref(false);
    // 右键菜单是否显示
    const goodsMoveRightMenuVisible = ref(false);
    // 右键菜单显示级别
    const goodsMoveRightMenuLevel = ref(1);
    // 商品出库确认框
    const removeGoodsConfirm = ref(false);

    // 统一隐藏所有操作面板
    const hideAllOperationPanel = () => {
      goodsMoveConfirmVisible.value = false;
      goodsMoveRightMenuVisible.value = false;
    };

    // 显示右键菜单
    const showGoodsMoveRightMenu = () => {
      // 隐藏所有操作面板
      hideAllOperationPanel();
      // 设置右键菜单显示
      goodsMoveRightMenuVisible.value = true;
      // 设置右键菜单显示级别
      goodsMoveRightMenuLevel.value = 1;
      // 重置右键菜单显示状态
      removeGoodsConfirm.value = false;
    };

    // 确认移动商品
    const goodsMoveOk = () => {
      // 移动商品
      store.dispatch("goods/moveGoods", {
        goodsId: dragControls.getCurrentDragControls().data.id,
        storeId: goodsMoveShelfBaseMesh.data.store_id,
        shelfId: goodsMoveShelfBaseMesh.data.shelf_id,
        shelfGridId: goodsMoveShelfBaseMesh.data.id,
      });
      // 清除货架格子的自发光
      toggleShelfBaseEmissive(goodsMoveShelfBaseMesh);
      // 关闭确认框
      hideAllOperationPanel();
      // 隐藏货架格子 Tag
      gridPositionTagVisible.value = false;
      // 查找新的商品模型
      const goodsMesh = getGoodsMesh(
        dragControls.getCurrentDragControls().data.id
      );
      // 更新商品 Tag 位置
      ThreeJS.scene.children.forEach((item) => {
        if (item.type === "Object3D" && item.name === "goodsTag") {
          if (item.data.id === dragControls.getCurrentDragControls().data.id) {
            item.position.set(
              goodsMesh.position.x,
              goodsMesh.position.y,
              goodsMesh.position.z
            );
          }
        }
      });
    };
    // 取消商品移动
    const goodsMoveCancel = () => {
      // 还原商品位置
      updateOneGoodsModelPosition(goodsMoveEvent.object);
      // 清除货架格子的自发光
      toggleShelfBaseEmissive(goodsMoveShelfBaseMesh);
      // 关闭确认框
      hideAllOperationPanel();
      // 隐藏货架格子 Tag
      gridPositionTagVisible.value = false;
      // 提示消息
      message.warning("取消移动");
    };

    // 当前操作的商品模型
    let currentGoodsMesh = null;
    // 当前商品操作日志
    const currentGoodsLog = ref({});
    // 获取商品日志
    const getGoodsLog = async () => {
      if (currentGoodsMesh) {
        const result = await getGoodsLogByIdApi({
          goods_id: currentGoodsMesh.data.id,
        });
        console.log(result);
        if (result.status === 200) {
          // 保存当前商品操作日志
          currentGoodsLog.value = result.data[0];
        }
      }
    };

    // 移除商品
    const removeGoods = (id) => {
      store.dispatch("goods/removeGoods", {
        storeId,
        ids: id || currentGoodsMesh.data.id,
      });
    };

    // DOM 渲染完成后执行
    onMounted(() => {
      ThreeJS = useTEngine(threeRef.value);

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

      // 禁用鼠标右键默认事件
      document.oncontextmenu = function (e) {
        e.preventDefault();
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
      const outlinePass = TOutlinePass(
        ThreeJS.renderer,
        ThreeJS.scene,
        ThreeJS.camera
      );
      // 添加轮廓线到渲染列表
      ThreeJS.addRenderAnim(outlinePass.renderOutline);

      // 与射线相交的物体
      let intersectObjects = [];
      // 商品
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
            // 获取商品
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

        // 判断是否捕获到商品
        if (goodsObjects.length > 0) {
          // 当前商品
          const selectedObject = goodsObjects[0].object;
          // 添加到描边列表
          outlinePass.selectedObjects = [selectedObject];
          // 判断是否处于拖放状态
          if (!dragControls.getDragState()) {
            // 隐藏商品 Tag 标签
            store.commit("goods/changeGoodsTagShow", {
              all: true,
              tagShow: false,
            });
            // 显示商品 Tag 标签
            store.commit("goods/changeGoodsTagShow", {
              id: selectedObject.data.id,
              tagShow: true,
            });
          }

          // 将当前商品添加到可拖放列表
          dragControls.addDragControlsObject(selectedObject);
        } else {
          // 清除描边效果
          outlinePass.selectedObjects = [];
          // 清空被拖放的物体
          dragControls.clearDragControlsObject();

          // 隐藏商品详情
          goodsList.value.forEach((item) => {
            // 隐藏商品 Tag 标签显示状态
            store.commit("goods/changeGoodsTagShow", {
              id: item.id,
              tagShow: false,
            });
          });
        }
        // 清空商品列表
        goodsObjects = [];
      });

      // 监听鼠标左键按下事件
      // ThreeJS.renderer.domElement.addEventListener("mousedown", () => {
      //   // 判断是否有与射线相交的模型
      //   if (intersectObjects.length > 0) {
      //     const currentGoodsObject = intersectObjects.find(
      //       (object) => object?.object?.name === "goods"
      //     );
      //     // 判断是否有商品
      //     if (currentGoodsObject) {
      //       console.log("currentGoodsObject", currentGoodsObject);
      //     }
      //   }
      // });

      // 监听鼠标右键按下事件
      ThreeJS.renderer.domElement.addEventListener("contextmenu", () => {
        currentGoodsLog.value = {};
        // 判断是否有与射线相交的模型
        if (intersectObjects.length > 0) {
          const currentGoodsObject = intersectObjects.find(
            (object) => object?.object?.name === "goods"
          );
          // 判断是否有商品
          if (currentGoodsObject) {
            currentGoodsMesh = currentGoodsObject.object;
            if (!goodsMoveConfirmVisible.value) {
              showGoodsMoveRightMenu();
            }
          } else {
            goodsMoveRightMenuVisible.value = false;
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
        hideAllOperationPanel();

        // 保存当前被拖放的物体
        dragControls.setCurrentDragControls({
          // 克隆当前被拖拽的物体
          ...event.object.clone(),
          // 附加被拖放物体的自定义数据
          data: event.object.data,
        });

        // 隐藏商品 Tag 标签
        store.commit("goods/changeGoodsTagShow", {
          id: intersectObjects[0].object.data.id,
          tagShow: false,
        });
      });

      let oldMesh = null;
      // 拖拽中执行
      dragControls.addEventListener("drag", () => {
        // 获取与射线相交的物体
        intersectObjects = raycaster.updateIntersects(event);
        const currentMesh = intersectObjects.find(
          (object) => object.object.name.slice(0, 11) === "shelf_base_"
        )?.object;
        // 判断是否获取到货架格子
        if (currentMesh) {
          // 判断当前获取到的货架格子是否与上一次的一样
          if (currentMesh?.data?.id !== oldMesh?.data?.id) {
            const shelf = shelfList.value.find(
              (shelf) => shelf.id === currentMesh.data.shelf_id
            );
            const grid = shelf.shelf_grid.find(
              (grid) => grid.shelf_grid_id === currentMesh.data.id
            );
            // 设置货架格子 Tag 的内容
            gridPositionTagValue.value = `【${shelf.name}】${
              grid.position.y + 1
            }层 ${grid.position.x + 1}行 ${grid.position.z + 1}列(${
              grid.shelf_grid_id
            })`;
            // 更新鼠标位置
            mousePosition.value = getMousePosition();
            // 保存当前 mesh
            oldMesh = currentMesh;
          }
          // 显示货架格子 Tag
          gridPositionTagVisible.value = true;
        } else {
          // 隐藏货架格子 Tag
          gridPositionTagVisible.value = false;
        }
      });

      // 完成拖拽时执行
      dragControls.addEventListener("dragend", (event) => {
        // 设置拖放状态为未在拖放
        dragControls.setDragState(false);
        // 保存当前移移动的商品的事件对象
        goodsMoveEvent = event;
        // 获取鼠标位置
        mousePosition.value = getMousePosition();
        // 获取鼠标指向的货架格子
        goodsMoveShelfBaseMesh = intersectObjects.find(
          (item) => item.object.name.slice(0, 11) === "shelf_base_"
        )?.object;
        // 判断是否拖拽到货架格子
        if (goodsMoveShelfBaseMesh) {
          // 判断商品是否移动
          if (
            !isShelfMove(
              event.object,
              dragControls.getCurrentDragControls(),
              goodsMoveShelfBaseMesh
            )
          ) {
            // 隐藏货架格子 Tag
            gridPositionTagVisible.value = false;
            // return message.warning("货架格子未进行更改");
            return;
          }
          // 判断商品是否重叠
          if (isShelfOverlap(event.object, goodsMoveShelfBaseMesh)) {
            // 隐藏货架格子 Tag
            gridPositionTagVisible.value = false;
            return message.warning("该货架格子已被使用");
          }
          // 弹出确认框
          goodsMoveConfirmVisible.value = true;
          store.commit("goods/setBeforeGoodsModelObject", event.object);
        } else {
          // 还原商品位置
          updateOneGoodsModelPosition(event.object);
        }
      });
    });

    onBeforeUnmount(() => {
      // 数据清理
      store.commit("shelf/clearShelf");
      store.commit("shelf/clearTotal");
      store.commit("goods/clearGoods");
      store.commit("goods/clearExpireGoods");
    });

    return {
      storeId,
      threeRef,
      shelfList,
      goodsList,
      fullHeight: window.innerHeight,
      goodsMoveConfirmVisible,
      goodsMoveOk,
      goodsMoveCancel,
      mousePosition,
      gridPositionTagVisible,
      gridPositionTagValue,
      goodsMoveRightMenuVisible,
      goodsMoveRightMenuLevel,
      getGoodsLog,
      currentGoodsLog,
      removeGoods,
      removeGoodsConfirm,
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

.move-confirm-box {
  position: absolute;
  display: flex;
  flex-direction: column;
}

.right-menu-box {
  position: absolute;
  display: flex;
  flex-direction: column;
  div {
    display: flex;
    flex-direction: column;
  }
}

.grid-tag-box {
  position: absolute;
  pointer-events: none;
}
</style>
