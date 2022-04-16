<template>
  <div class="goods-log-item">
    <div class="goods-log-content">
      <span class="goods-log-id">{{ goodsLog.id }}</span>
      <a-row style="color: #fff">
        <a-col :span="10">商品ID：</a-col>
        <a-col :span="14">
          <span style="font-weight: 700">
            {{ goodsLog.goods_id }}
          </span>
        </a-col>
        <a-col :span="10">商品名称：</a-col>
        <a-col :span="14">
          <span>
            {{ goodsLog.goods_name }}
          </span>
        </a-col>
        <a-col :span="10">操作类型：</a-col>
        <a-col :span="14">
          <span
            :style="{
              fontWeight: 700,
              color: goodsLog.before_shelf_grid_id
                ? goodsLog.now_shelf_grid_id
                  ? 'yellow'
                  : 'red'
                : '#49AA19',
            }"
          >
            {{
              goodsLog.before_shelf_grid_id
                ? goodsLog.now_shelf_grid_id
                  ? "移动"
                  : "出库"
                : "入库"
            }}
          </span>
        </a-col>
        <a-col :span="10">操作员：</a-col>
        <a-col :span="14">
          <span>
            {{ goodsLog.operate_name }}
          </span>
        </a-col>
        <a-col :span="10">操作时间：</a-col>
        <a-col :span="14">
          <span style="font-size: 12px">
            {{
              new Date(goodsLog.operate_time * 1000)
                .toLocaleString()
                .replaceAll("/", "-")
            }}
          </span>
        </a-col>
      </a-row>
    </div>
    <!-- 日志详情 -->
    <div class="goods-log-content">
      <!-- 入库 -->
      <div v-if="!goodsLog.before_shelf_grid_id && goodsLog.now_shelf_grid_id">
        <!-- 原始位置 -->
        <div class="goods-log-init-item">
          <div style="text-align: center; font-weight: 700; color: green">
            <span>入库</span>
          </div>
        </div>
        <!-- icon -->
        <div class="goods-log-init-step"><CaretDownOutlined /></div>
        <!-- 目标位置 -->
        <div class="goods-log-init-item">
          <a-row style="color: #fff">
            <a-col :span="6">仓库：</a-col>
            <a-col :span="18">
              <span>
                {{ goodsLog.now_store_name }}
              </span>
            </a-col>
            <a-col :span="6">货架：</a-col>
            <a-col :span="18">
              <span>
                {{ goodsLog.now_shelf_name }}
              </span>
            </a-col>
            <a-col :span="6">位置：</a-col>
            <a-col :span="18">
              <span>
                {{ getShelfGridPosition("now") }}
              </span>
            </a-col>
          </a-row>
        </div>
      </div>
      <!-- 移动 -->
      <div v-if="goodsLog.before_shelf_grid_id && goodsLog.now_shelf_grid_id">
        <!-- 原始位置 -->
        <div class="goods-log-init-item">
          <a-row style="color: #fff">
            <a-col :span="6">仓库：</a-col>
            <a-col :span="18">
              <span
                :style="{
                  color:
                    goodsLog.before_store_name === goodsLog.now_store_name
                      ? '#fff'
                      : '#f00',
                }"
              >
                {{ goodsLog.before_store_name }}
              </span>
            </a-col>
            <a-col :span="6">货架：</a-col>
            <a-col :span="18">
              <span
                :style="{
                  color:
                    goodsLog.before_shelf_name === goodsLog.now_shelf_name
                      ? '#fff'
                      : '#f00',
                }"
              >
                {{ goodsLog.before_shelf_name }}
              </span>
            </a-col>
            <a-col :span="6">位置：</a-col>
            <a-col :span="18">
              <span
                :style="{
                  color:
                    goodsLog.before_store_id === goodsLog.now_store_id &&
                    goodsLog.before_shelf_id === goodsLog.now_shelf_id &&
                    goodsLog.before_shelf_grid_id === goodsLog.now_shelf_grid_id
                      ? '#fff'
                      : '#f00',
                }"
              >
                {{ getShelfGridPosition("before") }}
              </span>
            </a-col>
          </a-row>
        </div>
        <!-- icon -->
        <div class="goods-log-init-step"><CaretDownOutlined /></div>
        <!-- 目标位置 -->
        <div class="goods-log-init-item">
          <a-row style="color: #fff">
            <a-col :span="6">仓库：</a-col>
            <a-col :span="18">
              <span>
                {{ goodsLog.now_store_name }}
              </span>
            </a-col>
            <a-col :span="6">货架：</a-col>
            <a-col :span="18">
              <span>
                {{ goodsLog.now_shelf_name }}
              </span>
            </a-col>
            <a-col :span="6">位置：</a-col>
            <a-col :span="18">
              <span>
                {{ getShelfGridPosition("now") }}
              </span>
            </a-col>
          </a-row>
        </div>
      </div>
      <!-- 出库 -->
      <div v-if="!goodsLog.now_shelf_grid_id && goodsLog.before_shelf_grid_id">
        <!-- 原始位置 -->
        <div class="goods-log-init-item">
          <a-row style="color: #fff">
            <a-col :span="6">仓库：</a-col>
            <a-col :span="18">
              <span>
                {{ goodsLog.before_store_name }}
              </span>
            </a-col>
            <a-col :span="6">货架：</a-col>
            <a-col :span="18">
              <span>
                {{ goodsLog.before_shelf_name }}
              </span>
            </a-col>
            <a-col :span="6">位置：</a-col>
            <a-col :span="18">
              <span>
                {{ getShelfGridPosition("before") }}
              </span>
            </a-col>
          </a-row>
        </div>
        <!-- icon -->
        <div class="goods-log-init-step"><CaretDownOutlined /></div>
        <!-- 目标位置 -->
        <div class="goods-log-init-item">
          <div style="text-align: center; font-weight: 700; color: #f00">
            <span>出库</span>
          </div>
        </div>
      </div>
    </div>
    <!--<div>{{ goodsLog }}</div>-->

    <!-- 插槽 -->
    <div class="slot" v-if="slot.default"><slot /></div>
  </div>
</template>

<script>
import { useSlots } from "vue";
import { CaretDownOutlined } from "@ant-design/icons-vue";
import { getGridPositionIndex } from "@/hooks/useShelf";

export default {
  name: "goodsLogItem",
  components: { CaretDownOutlined },
  props: {
    goodsLog: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    // 获取 slot 的内容
    const slot = useSlots();
    // 获取货架格子位置
    const getShelfGridPosition = (type) => {
      if (
        props.goodsLog[`${type}_store_id`] &&
        props.goodsLog[`${type}_shelf_id`] &&
        props.goodsLog[`${type}_shelf_grid_id`]
      ) {
        const grid = getGridPositionIndex({
          storeId: props.goodsLog[`${type}_store_id`],
          shelfId: props.goodsLog[`${type}_shelf_id`],
          shelfGridId: props.goodsLog[`${type}_shelf_grid_id`],
        });
        return `${grid?.position?.y + 1}层 ${grid?.position?.x + 1}行 ${
          grid?.position?.z + 1
        }列`;
      }
      return "";
    };

    return { slot, getShelfGridPosition };
  },
};
</script>

<style lang="less" scoped>
.goods-log-item {
  width: 100%;
  background-color: #282c34;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
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
}
.slot {
  width: 100%;
  height: 100%;
  padding: 10px;
  border-radius: 10px;
  background-color: #323844;
  text-align: center;
  margin-top: 10px;
}
</style>
