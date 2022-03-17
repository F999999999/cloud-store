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
import OperationPanel from "@/views/store/components/operationPanel";
import { useStore } from "vuex";
import ShelfTag from "@/components/shelfTag";
import GoodsTag from "@/components/goodsTag";
import { useRoute } from "vue-router";
import router from "@/router";
import { message } from "ant-design-vue";
import { useTEngine } from "@/hooks/useTEngine";
import { addGoodsModel } from "@/hooks/useGoods";
import { addShelfModel } from "@/hooks/useShelf";
import labelRenderer from "@/utils/three/CSS2DRenderer";

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
    // 实例化的 ThreeJS 引擎
    let TE = null;

    // 货架 Tag
    const shelfTagRef = ref(null);
    // 货物 Tag
    const goodsTagRef = ref(null);

    // 货架列表数据
    const shelfList = computed(() => store.state.shelf.shelfList);
    // 货物列表数据
    const goodsList = computed(() => store.state.goods.goodsList);

    // 获取货架列表数据
    store.dispatch("shelf/getShelfList", route.query.id);

    // DOM 渲染完成后执行
    onMounted(() => {
      TE = useTEngine(threeRef.value);

      // 自动调整渲染器大小
      window.onresize = () => {
        return (() => {
          // 设置正投影相机大小
          TE.setOrthographicCameraSize(
            document.body.clientWidth,
            document.body.clientHeight
          );

          // 设置 Tag 标签的渲染大小参数
          labelRenderer.setSize(window.innerWidth, window.innerHeight);
        })();
      };

      // 添加 CSS 2D渲染器到渲染列表
      TE.addRenderAnim(() => labelRenderer.render(TE.scene, TE.camera));

      // 监听货架列表数据变化
      watch(
        () => shelfList.value.length,
        () => {
          // 获取商品列表数据
          store.dispatch("goods/getGoodsList", route.query.id);
          shelfList.value.forEach((item) => {
            // 添加货架模型
            addShelfModel(item, shelfTagRef.value).then((shelfModel) => {
              // 添加货架到场景中
              TE.addObject(shelfModel);
            });
          });
        }
      );

      // 监听货物列表数据变化
      watch(
        () => goodsList.value,
        (newValue, oldValue) => {
          if (shelfList.value.length > 0) {
            if (newValue.length > oldValue.length) {
              // 新增
              // 根据数据渲染货物模型
              newValue.forEach((item) => {
                addGoodsModel(item, goodsTagRef.value).then((goodsModel) => {
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
