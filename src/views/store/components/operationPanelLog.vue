<template>
  <div class="operationPanel-log" style="display: none">
    <a-radio-group
      v-model:value="logType"
      button-style="solid"
      @change="changeStore"
    >
      <a-radio-button value="current">当前仓库</a-radio-button>
      <a-radio-button value="all">全部仓库</a-radio-button>
    </a-radio-group>
    <div class="operationPanel-log-list">
      <goods-log-item
        class="operationPanel-log-content-item"
        v-for="item in goodsLogList"
        :key="item.id"
        :goodsLog="item"
      />
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import GoodsLogItem from "@/components/goodsLogItem";
export default {
  name: "operationPanelLog",
  components: { GoodsLogItem },
  props: {
    storeId: {
      type: Number,
      default: null,
    },
  },
  setup(props) {
    const store = useStore();
    // 日志类型
    const logType = ref("current");

    // 获取商品日志列表
    store.dispatch("goods/getGoodsLog", { storeId: props.storeId });
    // 商品日志列表
    const goodsLogList = computed(() => store.state.goods.goodsLog);

    const changeStore = () => {
      if (logType.value === "current") {
        store.dispatch("goods/getGoodsLog", { storeId: props.storeId });
      } else if (logType.value === "all") {
        store.dispatch("goods/getGoodsLog", {});
      }
    };

    return { logType, goodsLogList, changeStore };
  },
};
</script>

<style scoped lang="less">
:deep(.ant-radio-group) {
  border-radius: 16px;
  overflow: hidden;
  border-bottom: groove #111111cc;
}
.operationPanel-log {
  height: 100%;
  .operationPanel-log-list {
    width: 100%;
    text-align: left;
    height: calc(100% - 32px - 30px);
    overflow-y: auto;
    margin-top: 5px;
    border-radius: 10px;
    .operationPanel-log-item {
      opacity: 0.9;
      &:hover,
      &.active {
        opacity: 1;
      }
    }
  }
}
</style>
