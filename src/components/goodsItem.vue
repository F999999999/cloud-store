<template>
  <div class="goods-item">
    <h3 style="color: #fff">商品 - {{ goodsData.name }}</h3>
    <a-row style="color: #fff">
      <a-col :span="4">ID:</a-col>
      <a-col :span="6">
        <span style="font-weight: 700; color: yellow">
          {{ goodsData.id || "-" }}
        </span>
      </a-col>
      <a-col :span="6"> 重量：</a-col>
      <a-col :span="8">
        <span style="font-weight: 700">
          <span style="color: yellow">{{
            goodsData.weight >= 0 ? goodsData.weight : "-"
          }}</span>
          KG
        </span>
      </a-col>
      <a-col :span="24"><hr /></a-col>
      <a-col :span="7"> 保质期：</a-col>
      <a-col :span="6">
        <span style="font-weight: 700">
          <span style="color: white">
            {{ goodsData.shelflife >= 0 ? goodsData.shelflife : "-" }}</span
          >
          天
        </span>
      </a-col>
      <a-col :span="5"><span>状态：</span></a-col>
      <a-col :span="6">
        <span
          :style="{
            fontWeight: 700,
            opacity: 0.8,
            color:
              (new Date().getTime() / 1000 - goodsData.production_date) /
                86400 >
              goodsData.shelflife
                ? 'red'
                : (new Date().getTime() / 1000 - goodsData.production_date) /
                    86400 >
                  goodsData.shelflife * 0.8
                ? 'yellow'
                : 'green',
          }"
        >
          {{
            (new Date().getTime() / 1000 - goodsData.production_date) / 86400 >
            goodsData.shelflife
              ? "已过期"
              : (new Date().getTime() / 1000 - goodsData.production_date) /
                  86400 >
                goodsData.shelflife * 0.8
              ? "临过期"
              : "未过期"
          }}
        </span>
      </a-col>
      <a-col :span="8"><span style="color: #1890ff">生产日期：</span></a-col>
      <a-col :span="16">
        <span style="font-weight: 700; color: white">
          {{
            goodsData.production_date >= 0
              ? new Date(goodsData.production_date * 1000)
                  .toLocaleString()
                  .replaceAll("/", "-")
                  .replaceAll("00:00:00", "")
              : "-"
          }}
        </span>
      </a-col>
      <a-col :span="8"><span style="color: #52c41a">入库时间：</span></a-col>
      <a-col :span="16">
        <span style="font-weight: 700; color: white">
          {{
            goodsData.storage_time >= 0
              ? new Date(goodsData.storage_time * 1000)
                  .toLocaleString()
                  .replaceAll("/", "-")
                  .replaceAll("00:00:00", "")
              : "-"
          }}
        </span>
      </a-col>
      <a-col :span="24">
        <a-progress
          :percent="
            (Math.abs(
              Math.floor(
                (new Date().getTime() / 1000 - goodsData.production_date) /
                  86400
              )
            ) /
              goodsData.shelflife) *
            100
          "
          :success-percent="
            (Math.abs(
              Math.floor(
                (new Date().getTime() / 1000 - goodsData.storage_time) / 86400
              )
            ) /
              goodsData.shelflife) *
            100
          "
        >
          <template #format="percent">
            <span
              :style="{
                color:
                  (new Date().getTime() / 1000 - goodsData.production_date) /
                    86400 >
                  goodsData.shelflife
                    ? 'red'
                    : (new Date().getTime() / 1000 -
                        goodsData.production_date) /
                        86400 >
                      goodsData.shelflife * 0.8
                    ? 'yellow'
                    : 'green',
              }"
              >{{ percent.toFixed() }}%</span
            >
          </template>
        </a-progress>
      </a-col>
      <a-col :span="24"><hr /></a-col>
      <a-col :span="24">
        <a-row>
          <a-col :span="6">货架：</a-col>
          <a-col :span="18">
            <span style="color: yellow">
              {{ shelf?.name }}
            </span>
          </a-col>
          <a-col :span="6">位置：</a-col>
          <a-col :span="18">
            <span style="color: yellow">
              {{ currentShelfGrid?.position?.y + 1 }}
            </span>
            层
            <span style="color: yellow">
              {{ currentShelfGrid?.position?.x + 1 }}
            </span>
            行
            <span style="color: yellow">
              {{ currentShelfGrid?.position?.z + 1 }}
            </span>
            列
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <!-- 角标 -->
    <div
      v-show="active"
      class="subscript"
      :style="{ color: activeColor, backgroundColor: activeBackgroundColor }"
    >
      {{ activeText }}
    </div>
    <!-- 插槽 -->
    <div class="slot" v-if="slot.default"><slot /></div>
  </div>
</template>

<script>
import { computed, ref, useSlots } from "vue";
import store from "@/store";

export default {
  name: "goodsItem",
  props: {
    goodsData: {
      type: Object,
      default: () => ({}),
    },
    active: {
      type: Boolean,
      default: false,
    },
    activeText: {
      type: String,
      default: "",
    },
    activeColor: {
      type: String,
      default: "#fff",
    },
    activeBackgroundColor: {
      type: String,
      default: "#1890ff",
    },
  },
  setup(props) {
    // 获取 slot 的内容
    const slot = useSlots();
    // 货架列表数据
    const shelfList = computed(() => store.state.shelf.shelfList);
    // 查找货架
    const shelf = ref(
      shelfList.value.find((shelf) => shelf.id === props.goodsData.shelf_id)
    );
    // 当前货架格子位置
    const currentShelfGrid = ref(
      shelf.value.shelf_grid.find(
        (grid) => grid.goods_id === props.goodsData.id
      )
    );

    return { slot, shelf, currentShelfGrid };
  },
};
</script>

<style lang="less" scoped>
.goods-item {
  width: 100%;
  background-color: #282c34;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
  .subscript {
    color: #fff;
    height: 30px;
    width: 100px;
    position: absolute;
    top: 8px;
    right: -30px;
    text-align: center;
    line-height: 30px;
    background-color: #1890ff;
    transform: rotate(45deg);
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
