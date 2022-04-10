<template>
  <div ref="domElementRef" :data-id="goodsTagData.id">
    <div class="goods-item" v-show="goodsTagData.tagShow">
      <h3 style="color: #fff">商品 - {{ goodsTagData.name }}</h3>
      <a-row style="color: #fff">
        <a-col :span="4">ID:</a-col>
        <a-col :span="6">
          <a-tag color="#008000" style="font-weight: 700; color: yellow">
            {{ goodsTagData.id || "-" }}
          </a-tag>
        </a-col>
        <a-col :span="6"> 重量：</a-col>
        <a-col :span="8">
          <a-tag color="#008000" style="font-weight: 700">
            <span style="color: yellow">{{
              goodsTagData.weight >= 0 ? goodsTagData.weight : "-"
            }}</span>
            KG
          </a-tag>
        </a-col>
        <a-col :span="24"><hr /></a-col>
        <a-col :span="6"> 保质期：</a-col>
        <a-col :span="7">
          <a-tag color="#894D21" style="font-weight: 700">
            <span style="color: white">
              {{
                goodsTagData.shelflife >= 0 ? goodsTagData.shelflife : "-"
              }}</span
            >
            天
          </a-tag>
        </a-col>
        <a-col :span="5"><span>状态：</span></a-col>
        <a-col :span="6">
          <a-tag color="#894D21" style="font-weight: 700; color: white">
            {{
              (new Date().getTime() / 1000 - goodsTagData.production_date) /
                86400 >
              goodsTagData.shelflife
                ? "已过期"
                : (new Date().getTime() / 1000 - goodsTagData.production_date) /
                    86400 >
                  goodsTagData.shelflife * 0.8
                ? "临过期"
                : "未过期"
            }}
          </a-tag>
        </a-col>
        <a-col :span="8"><span style="color: #1890ff">生产日期：</span></a-col>
        <a-col :span="16">
          <a-tag color="#894D21" style="font-weight: 700; color: white">
            {{
              goodsTagData.production_date >= 0
                ? new Date(goodsTagData.production_date * 1000)
                    .toLocaleString()
                    .replaceAll("/", "-")
                    .replaceAll("00:00:00", "")
                : "-"
            }}
          </a-tag>
        </a-col>
        <a-col :span="8"><span style="color: #52c41a">入库时间：</span></a-col>
        <a-col :span="16">
          <a-tag color="#894D21" style="font-weight: 700; color: white">
            {{
              goodsTagData.storage_time >= 0
                ? new Date(goodsTagData.storage_time * 1000)
                    .toLocaleString()
                    .replaceAll("/", "-")
                    .replaceAll("00:00:00", "")
                : "-"
            }}
          </a-tag>
        </a-col>
        <a-col :span="24">
          <a-progress
            :percent="
              (Math.abs(
                Math.floor(
                  (new Date().getTime() / 1000 - goodsTagData.production_date) /
                    86400
                )
              ) /
                goodsTagData.shelflife) *
              100
            "
            :success-percent="
              (Math.abs(
                Math.floor(
                  (new Date().getTime() / 1000 - goodsTagData.storage_time) /
                    86400
                )
              ) /
                goodsTagData.shelflife) *
              100
            "
          >
            <template #format="percent">
              <span
                :style="{
                  color:
                    (new Date().getTime() / 1000 -
                      goodsTagData.production_date) /
                      86400 >
                    goodsTagData.shelflife
                      ? 'red'
                      : (new Date().getTime() / 1000 -
                          goodsTagData.production_date) /
                          86400 >
                        goodsTagData.shelflife * 0.8
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
              <a-tag color="#008000" style="font-weight: 700; color: white">
                {{ shelf.name }}
              </a-tag>
            </a-col>
            <a-col :span="6">位置：</a-col>
            <a-col :span="18" style="font-weight: 700">
              <a-tag color="#008000">
                <span style="color: yellow">{{
                  currentShelfGrid?.position?.y + 1
                }}</span
                >层
                <span style="color: yellow">{{
                  currentShelfGrid?.position?.x + 1
                }}</span
                >行
                <span style="color: yellow">{{
                  currentShelfGrid?.position?.z + 1
                }}</span
                >列
              </a-tag>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <!-- 提示 -->
      <div class="slot" v-if="slot.default"><slot /></div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, useSlots, watch } from "vue";
import { getGridPosition } from "@/hooks/useShelf";
import { goodsTag } from "@/utils/three/CSS2DObject";
import { ThreeJS } from "@/hooks/useTEngine";
import { useStore } from "vuex";

export default {
  name: "goodsTag",
  props: {
    goodsTagData: {
      type: Object,
      default: () => ({}),
    },
    shelf: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    // 获取 slot 的内容
    const slot = useSlots();

    const store = useStore();

    const domElementRef = ref(null);

    // 添加商品 Tag 标签显示状态
    store.commit("goods/changeGoodsTagShow", {
      id: props.goodsTagData.id,
      tagShow: props.goodsTagData.tagShow,
    });

    onMounted(() => {
      const tag = goodsTag(
        domElementRef.value,
        getGridPosition(
          props.goodsTagData.shelf_id,
          props.goodsTagData.shelf_grid_id
        )
      );
      // 添加自定义属性
      tag.data = props.goodsTagData;
      // 渲染 Tag 标签
      ThreeJS.addObject(tag);
    });

    // 当前商品的位置
    const currentShelfGrid = ref({});

    // 监听商品位置信息的变化
    watch(
      () => props.shelf.shelf_grid,
      (shelf_grid) => {
        if (shelf_grid?.length > 0 && props.goodsTagData.shelf_grid_id) {
          // currentShelfGrid.value = shelf_grid.find(
          //   (item) => item.shelf_grid_id === props.goodsTagData.shelf_grid_id
          // );
          currentShelfGrid.value =
            shelf_grid[props.goodsTagData.shelf_grid_id - 1];
        }
      },
      {
        immediate: true,
      }
    );

    return { slot, domElementRef, currentShelfGrid };
  },
};
</script>

<style scoped>
.goods-item {
  /*width: 260px;*/
  /*position: absolute;*/
  /*top: -300px;*/
  /*left: -130px;*/
  width: 16rem;
  position: absolute;
  top: -22rem;
  left: -8rem;
  background-color: #282c34;
  padding: 10px;
  border-radius: 10px;
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
