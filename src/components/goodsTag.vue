<template>
  <div class="goods-tag" ref="domElementRef" :data-id="goodsTagData.id">
    <div v-show="goodsTagData.tagShow">
      <a-card
        :title="'商品 - ' + goodsTagData.name"
        style="width: 260px; opacity: 0.9"
        headStyle="color: #000; background-color: #fff;"
        bodyStyle="color: #fff; background-color: #92a2ba;"
        :bordered="false"
      >
        <a-row style="color: #000">
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
          <a-col :span="8"> 保质期：</a-col>
          <a-col :span="16">
            <a-tag color="#894D21" style="font-weight: 700">
              <span style="color: white">
                {{
                  goodsTagData.shelflife >= 0 ? goodsTagData.shelflife : "-"
                }}</span
              >
              天
            </a-tag>
          </a-col>
          <a-col :span="8">生产日期：</a-col>
          <a-col :span="16">
            <a-tag color="#894D21" style="font-weight: 700; color: white">
              {{
                goodsTagData.production_date >= 0
                  ? new Date(
                      goodsTagData.production_date * 1000
                    ).toLocaleString()
                  : "-"
              }}
            </a-tag>
          </a-col>
          <a-col :span="8">入库时间：</a-col>
          <a-col :span="16">
            <a-tag color="#894D21" style="font-weight: 700; color: white">
              {{
                goodsTagData.storage_time >= 0
                  ? new Date(goodsTagData.storage_time * 1000).toLocaleString()
                  : "-"
              }}
            </a-tag>
          </a-col>
          <a-col :span="10">
            <a-progress
              type="circle"
              :percent="
                (Math.abs(
                  Math.floor(
                    (new Date().getTime() / 1000 -
                      goodsTagData.production_date) /
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
              :width="80"
              :strokeWidth="10"
              :status="
                goodsTagData.production_date === goodsTagData.shelflife
                  ? 'exception'
                  : 'normal'
              "
              :format="
                () =>
                  `产:${Math.abs(
                    Math.floor(
                      (new Date().getTime() / 1000 -
                        goodsTagData.production_date) /
                        86400
                    )
                  )}天
                库:${Math.abs(
                  Math.floor(
                    (new Date().getTime() / 1000 - goodsTagData.storage_time) /
                      86400
                  )
                )}天`
              "
            />
          </a-col>
          <a-col :span="14">
            <a-row>
              <a-col :span="10">货架：</a-col>
              <a-col :span="14">
                <a-tag color="#008000" style="font-weight: 700; color: white">
                  {{ shelf.name }}
                </a-tag>
              </a-col>

              <a-col :span="10">位置：</a-col>
              <a-col :span="14" style="font-weight: 700">
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
      </a-card>
      <!-- 提示 -->
      <slot />
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { getGridPosition } from "@/hooks/useShelf";
import { goodsTag } from "@/utils/three/CSS2DObject";
import { ThreeJS } from "@/hooks/useTEngine";
import store from "@/store";

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
    const domElementRef = ref(null);

    // 添加商品 Tag 标签显示状态
    store.commit("goods/changeGoodsTagShow", {
      id: props.goodsTagData.id,
      tagShow: props.goodsTagData.tagShow,
    });

    onMounted(() => {
      // 渲染 Tag 标签
      ThreeJS.addObject(
        goodsTag(
          domElementRef.value,
          getGridPosition(
            props.goodsTagData.shelf_id,
            props.goodsTagData.shelf_grid_id
          )
        )
      );
    });

    // 当前商品的位置
    const currentShelfGrid = ref({});

    // 监听商品位置信息的变化
    watch(
      () => props.shelf.shelf_grid,
      (shelf_grid) => {
        if (shelf_grid.length > 0 && props.goodsTagData.shelf_grid_id) {
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

    return {
      domElementRef,
      currentShelfGrid,
    };
  },
};
</script>

<style scoped>
.goods-tag {
  position: absolute;
  top: -220px;
  left: 0;
}
</style>
