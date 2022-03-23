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
    <goods-tag
      v-for="goodsTagData in goodsList"
      :key="goodsTagData.id"
      :goodsTagData="goodsTagData"
      :shelf="shelfList.find((item) => item.id === goodsTagData.shelf_id)"
    >
      <a-tag color="orange">双击并拖动可以移动货物位置</a-tag>
    </goods-tag>
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

export default {
  name: "Store",
  components: { GoodsTag, ShelfTag, OperationPanel },
  setup() {
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
    // 实例化的 ThreeJS 引擎
    let TE = null;

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

      // 添加 CSS2D 渲染器到渲染列表
      TE.addRenderAnim(() => labelRenderer.render(TE.scene, TE.camera));
    });

    return {
      storeId,
      threeRef,
      shelfTagRef,
      shelfList,
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
