<template>
  <div ref="domElementRef" :data-id="goodsTagData.id">
    <div v-if="goodsTagData.tagShow">
      <goods-item
        v-if="slot.default"
        class="goods-item"
        :goodsData="goodsTagData"
      >
        <slot />
      </goods-item>
      <goods-item v-else class="goods-item" :goodsData="goodsTagData" />
    </div>
  </div>
</template>

<script>
import { onMounted, ref, useSlots } from "vue";
import { getGridPosition } from "@/hooks/useShelf";
import { goodsTag } from "@/utils/three/CSS2DObject";
import { ThreeJS } from "@/hooks/useTEngine";
import { useStore } from "vuex";
import GoodsItem from "@/components/goodsItem";

export default {
  name: "goodsTag",
  components: { GoodsItem },
  props: {
    goodsTagData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    // 获取 slot 的内容
    const slot = useSlots();

    const store = useStore();
    // Tag 标签的 ref
    const domElementRef = ref(null);

    // 添加商品 Tag 标签显示状态
    store.commit("goods/changeGoodsTagShow", {
      id: props.goodsTagData.id,
      tagShow: props.goodsTagData.tagShow,
    });

    onMounted(() => {
      const tag = goodsTag(
        domElementRef.value,
        getGridPosition({
          shelfId: props.goodsTagData.shelf_id,
          shelfGridId: props.goodsTagData.shelf_grid_id,
        })
      );
      // 添加自定义属性
      tag.data = props.goodsTagData;
      // 渲染 Tag 标签
      ThreeJS.addObject(tag);
    });

    return { slot, domElementRef };
  },
};
</script>

<style scoped>
.goods-item {
  width: 16rem;
  position: absolute;
  top: -23rem;
  left: -8rem;
  background-color: #282c34;
  padding: 10px;
  border-radius: 10px;
}
</style>
