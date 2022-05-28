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

    <!-- 入库 -->
    <!--<div v-if="!goodsLog.before_shelf_grid_id && goodsLog.now_shelf_grid_id">-->
    <!--  &lt;!&ndash; 原始位置 &ndash;&gt;-->
    <!--  <div class="goods-log-init-item">-->
    <!--    <div style="text-align: center; font-weight: 700; color: green">-->
    <!--      <span>入库</span>-->
    <!--    </div>-->
    <!--  </div>-->
    <!--  &lt;!&ndash; icon &ndash;&gt;-->
    <!--  <div class="goods-log-init-step"><CaretDownOutlined /></div>-->
    <!--  &lt;!&ndash; 目标位置 &ndash;&gt;-->
    <!--  <div class="goods-log-init-item">-->
    <!--    <span style="color: #fff">-->
    <!--      <span>{{ goodsLog.now_store_name }}</span>-->
    <!--      <i>【</i>-->
    <!--      <span>{{ goodsLog.now_shelf_name }}</span>-->
    <!--      <i>】</i>-->
    <!--      <span>{{ getShelfGridPosition(goodsLog, "now") }}</span>-->
    <!--    </span>-->
    <!--  </div>-->
    <!--</div>-->
    <!-- 移动 -->
    <!--<div v-if="goodsLog.before_shelf_grid_id && goodsLog.now_shelf_grid_id">-->
    <!--  &lt;!&ndash; 原始位置 &ndash;&gt;-->
    <!--  <div class="goods-log-init-item">-->
    <!--    <span style="color: #fff">-->
    <!--      <span> {{ goodsLog.now_store_name }}</span>-->
    <!--      【<span-->
    <!--        :style="{-->
    <!--          color:-->
    <!--            goodsLog.before_shelf_name === goodsLog.now_shelf_name-->
    <!--              ? '#fff'-->
    <!--              : '#f00',-->
    <!--        }"-->
    <!--      >-->
    <!--        {{ goodsLog.before_shelf_name }} </span-->
    <!--      >】-->
    <!--      <span-->
    <!--        :style="{-->
    <!--          color:-->
    <!--            goodsLog.before_store_id === goodsLog.now_store_id &&-->
    <!--            goodsLog.before_shelf_id === goodsLog.now_shelf_id &&-->
    <!--            goodsLog.before_shelf_grid_id === goodsLog.now_shelf_grid_id-->
    <!--              ? '#fff'-->
    <!--              : '#f00',-->
    <!--        }"-->
    <!--      >-->
    <!--        {{ getShelfGridPosition("before") }}-->
    <!--      </span>-->
    <!--    </span>-->
    <!--  </div>-->
    <!--  &lt;!&ndash; icon &ndash;&gt;-->
    <!--  <div class="goods-log-init-step"><CaretDownOutlined /></div>-->
    <!--  &lt;!&ndash; 目标位置 &ndash;&gt;-->
    <!--  <div class="goods-log-init-item">-->
    <!--    <span style="color: #fff">-->
    <!--      <span>{{ goodsLog.now_store_name }}</span>-->
    <!--      <i>【</i>-->
    <!--      <span>{{ goodsLog.now_shelf_name }}</span>-->
    <!--      <i>】</i>-->
    <!--      <span>{{ getShelfGridPosition("now") }}</span>-->
    <!--    </span>-->
    <!--    <a-row>-->
    <!--      <a-col :span="6">仓库：</a-col>-->
    <!--      <a-col :span="18">-->
    <!--        <span>-->
    <!--          {{ goodsLog.now_store_name }}-->
    <!--        </span>-->
    <!--      </a-col>-->
    <!--      <a-col :span="6">货架：</a-col>-->
    <!--      <a-col :span="18">-->
    <!--        <span>-->
    <!--          {{ goodsLog.now_shelf_name }}-->
    <!--        </span>-->
    <!--      </a-col>-->
    <!--      <a-col :span="6">位置：</a-col>-->
    <!--      <a-col :span="18">-->
    <!--        <span>-->
    <!--          {{ getShelfGridPosition("now") }}-->
    <!--        </span>-->
    <!--      </a-col>-->
    <!--    </a-row>-->
    <!--  </div>-->
    <!--</div>-->
    <!-- 出库 -->
    <!--<div v-if="!goodsLog.now_shelf_grid_id && goodsLog.before_shelf_grid_id">-->
    <!--  &lt;!&ndash; 原始位置 &ndash;&gt;-->
    <!--  <div class="goods-log-init-item">-->
    <!--    <a-row style="color: #fff">-->
    <!--      <a-col :span="6">仓库：</a-col>-->
    <!--      <a-col :span="18">-->
    <!--        <span>-->
    <!--          {{ goodsLog.before_store_name }}-->
    <!--        </span>-->
    <!--      </a-col>-->
    <!--      <a-col :span="6">货架：</a-col>-->
    <!--      <a-col :span="18">-->
    <!--        <span>-->
    <!--          {{ goodsLog.before_shelf_name }}-->
    <!--        </span>-->
    <!--      </a-col>-->
    <!--      <a-col :span="6">位置：</a-col>-->
    <!--      <a-col :span="18">-->
    <!--        <span>-->
    <!--          {{ getShelfGridPosition("before") }}-->
    <!--        </span>-->
    <!--      </a-col>-->
    <!--    </a-row>-->
    <!--  </div>-->
    <!--  &lt;!&ndash; icon &ndash;&gt;-->
    <!--  <div class="goods-log-init-step"><CaretDownOutlined /></div>-->
    <!--  &lt;!&ndash; 目标位置 &ndash;&gt;-->
    <!--  <div class="goods-log-init-item">-->
    <!--    <div style="text-align: center; font-weight: 700; color: #f00">-->
    <!--      <span>出库</span>-->
    <!--    </div>-->
    <!--  </div>-->
    <!--</div>-->
  </div>
</template>

<script>
import { getGridPositionIndex } from "@/hooks/useShelf";
// import { CaretDownOutlined } from "@ant-design/icons-vue";

export default {
  name: "goodsLogBox",
  // components: { CaretDownOutlined },
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
