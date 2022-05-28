<template>
  <div class="goods-log-content">
    <div v-for="goodsLog in logList" :key="goodsLog.id">
      <!-- 入库 -->
      <div class="goods-log-init-item" v-if="!goodsLog.before_shelf_grid_id">
        <div style="text-align: center; font-weight: 700; color: green">
          <span>入库</span>
        </div>
      </div>
      <!-- 移动 -->
      <div class="goods-log-init-item" v-if="goodsLog.now_shelf_grid_id">
        <span style="color: #fff">
          <span>{{ goodsLog.now_store_name }}</span>
          <span>【</span>
          <span>{{ goodsLog.now_shelf_name }}</span>
          <span>】</span>
          <span>{{ getShelfGridPosition(goodsLog, "now") }}</span>
        </span>
        <div style="color: #999">
          {{
            new Date(goodsLog.operate_time * 1000)
              .toLocaleString()
              .replaceAll("/", "-")
          }}
        </div>
      </div>
      <!-- 出库 -->
      <div class="goods-log-init-item" v-if="!goodsLog.now_shelf_grid_id">
        <div style="text-align: center; font-weight: 700; color: #f00">
          <span>出库</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getGridPositionIndex } from "@/hooks/useShelf";

export default {
  name: "goodsLogBox",
  props: {
    logList: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    // 获取货架格子位置
    const getShelfGridPosition = (goodsLog, type) => {
      if (
        goodsLog[`${type}_store_id`] &&
        goodsLog[`${type}_shelf_id`] &&
        goodsLog[`${type}_shelf_grid_id`]
      ) {
        const grid = getGridPositionIndex({
          storeId: goodsLog[`${type}_store_id`],
          shelfId: goodsLog[`${type}_shelf_id`],
          shelfGridId: goodsLog[`${type}_shelf_grid_id`],
        });
        return `${grid?.position?.y + 1}层 ${grid?.position?.x + 1}行 ${
          grid?.position?.z + 1
        }列`;
      }
      return "";
    };

    return { getShelfGridPosition };
  },
};
</script>

<style lang="less" scoped>
.goods-log-content {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #323844;
}
.goods-log-id {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 20px;
  font-weight: 700;
  color: yellow;
  opacity: 0.4;
}
.goods-log-init-item {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #282c34;
}
.goods-log-init-step {
  width: 100%;
  padding: 2px;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #282c34;
  text-align: center;
}
</style>
