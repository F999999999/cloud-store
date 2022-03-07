<template>
  <div class="goods-tag" ref="domElementRef">
    <div v-show="tagShow">
      <a-card
        :title="'货物 - shhosh s手孔井上片机是' + name"
        style="width: 260px; opacity: 0.9"
        headStyle="color: #000; background-color: #fff;"
        bodyStyle="color: #fff; background-color: #92a2ba;"
        :bordered="false"
      >
        <template #extra>
          <a href="#" v-if="persistentShow">{{ tagShowTimer }}</a>
        </template>

        <a-row style="color: #000">
          <a-col :span="4">ID:</a-col>
          <a-col :span="6">
            <a-tag color="#008000" style="font-weight: 700; color: yellow">
              {{ id || "-" }}
            </a-tag>
          </a-col>
          <a-col :span="6"> 重量：</a-col>
          <a-col :span="8">
            <a-tag color="#008000" style="font-weight: 700">
              <span style="color: yellow">{{
                weight >= 0 ? weight : "-"
              }}</span>
              KG
            </a-tag>
          </a-col>
          <a-col :span="8"> 保质期：</a-col>
          <a-col :span="16">
            <a-tag color="#008000" style="font-weight: 700">
              <span style="color: yellow">
                {{ shelflife >= 0 ? shelflife : "-" }}</span
              >
              天
            </a-tag>
          </a-col>
          <a-col :span="8">生产日期：</a-col>
          <a-col :span="16">
            <a-tag color="#008000" style="font-weight: 700; color: yellow">
              {{
                production_date >= 0
                  ? new Date(production_date * 1000).toLocaleString()
                  : "-"
              }}
            </a-tag>
          </a-col>
          <a-col :span="8">入库时间：</a-col>
          <a-col :span="16">
            <a-tag color="#008000" style="font-weight: 700; color: yellow">
              {{
                storage_time >= 0
                  ? new Date(storage_time * 1000).toLocaleString()
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
                    (new Date().getTime() / 1000 - production_date) / 86400
                  )
                ) /
                  shelflife) *
                100
              "
              :success-percent="
                (Math.abs(
                  Math.floor(
                    (new Date().getTime() / 1000 - storage_time) / 86400
                  )
                ) /
                  shelflife) *
                100
              "
              :width="80"
              :strokeWidth="10"
              :status="production_date === shelflife ? 'exception' : 'normal'"
              :format="
                () =>
                  `产:${Math.abs(
                    Math.floor(
                      (new Date().getTime() / 1000 - production_date) / 86400
                    )
                  )}天
                库:${Math.abs(
                  Math.floor(
                    (new Date().getTime() / 1000 - storage_time) / 86400
                  )
                )}天`
              "
            />
          </a-col>
          <a-col :span="14">
            <a-row>
              <a-col :span="10">货架：</a-col>
              <a-col :span="14">
                <a-tag color="#008000" style="font-weight: 700; color: yellow">
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
      <a-row>
        <a-col :span="24" v-if="persistentShow">
          <a-tag color="orange">6s后自动关闭</a-tag>
        </a-col>
        <a-col :span="24" v-else>
          <a-tag color="orange">双击并拖动可以移动货物位置</a-tag>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";

export default {
  name: "goodsTag",
  props: {
    tagShow: {
      type: Boolean,
      default: false,
    },
    tagShowTimer: {
      type: Number,
      default: 0,
    },
    id: {
      type: Number,
      default: null,
    },
    name: {
      type: String,
      default: "",
    },
    shelf_id: {
      type: Number,
      default: null,
    },
    shelf_grid_id: {
      type: Number,
      default: null,
    },
    weight: {
      type: Number,
      default: null,
    },
    shelflife: {
      type: Number,
      default: null,
    },
    production_date: {
      type: Number,
      default: null,
    },
    storage_time: {
      type: Number,
      default: null,
    },
    persistentShow: {
      type: Boolean,
      default: false,
    },
    shelf: {
      type: Object,
      default: () => ({}),
    },
    changeGoodsTagShow: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const domElementRef = ref(null);

    const store = useStore();
    // 当前货物的位置
    const currentShelfGrid = ref({});
    // 监听货物位置信息的变化
    watch(
      () => props.shelf.shelf_grid,
      (shelf_grid) => {
        if (shelf_grid.length > 0 && props.shelf_grid_id) {
          // currentShelfGrid.value = shelf_grid.find(
          //   (item) => item.shelf_grid_id === props.shelf_grid_id
          // );
          currentShelfGrid.value = shelf_grid[props.shelf_grid_id - 1];
          console.log("=====================", props.shelf);
        }
      }
    );

    // 商品列表
    const goodsList = computed(() => store.state.goods.goodsList);
    // 商品索引
    const goodsIndex = goodsList.value.findIndex(
      (goods) => goods.id === props.id
    );
    if (goodsIndex >= 0 && goodsList.value[goodsIndex].tagPersistentShow) {
      // 倒计时
      console.log(goodsList[goodsIndex]?.tagShowTimer);
      // 倒计时大于0时 启动自动关闭倒计时
      if (goodsList[goodsIndex]?.tagShowTimer > 0) {
        const timerId = setInterval(() => {
          console.log(goodsList[goodsIndex].tagShowTimer);
          if (goodsList[goodsIndex].tagShowTimer > 0) {
            // tagTimer.value--;
            // store.commit("goods/changeGoodsTagShowTime", {
            //   id: props.id,
            //   tagShowTime:
            //     goodsList.value.find((item) => item.id === props.id).tagShowTime -
            //     1000,
            // });
            store.commit("goods/changeGoodsTagShowTime", {
              id: props.id,
              tagShowTime: goodsList[goodsIndex].tagShowTimer - 1000,
            });
          } else {
            clearInterval(timerId);
            closeTag();
          }
        }, 1000);
      }
    }

    watch(
      () => props.tagPersistentShow,
      () => {
        console.log("watch", props.tagPersistentShow);
      }
    );

    // 定时关闭 Tag 标签
    const timeoutCloseTag = (time) => {
      const timerId = setInterval(() => {
        console.log(goodsList[goodsIndex].tagShowTimer);
        if (goodsList[goodsIndex].tagShowTimer > 0) {
          // tagTimer.value--;
          // store.commit("goods/changeGoodsTagShowTime", {
          //   id: props.id,
          //   tagShowTime:
          //     goodsList.value.find((item) => item.id === props.id).tagShowTime -
          //     1000,
          // });
          store.commit("goods/changeGoodsTagShowTime", {
            id: props.id,
            tagShowTime: time - 1000,
          });
        } else {
          clearInterval(timerId);
          closeTag();
        }
      }, 1000);
    };

    // 关闭货物 Tag 标签
    const closeTag = () => {
      store.commit("goods/changeGoodsTagShow", false);
    };

    return {
      domElementRef,
      closeTag,
      timeoutCloseTag,
      currentShelfGrid,
    };
  },
};
</script>

<style scoped>
.goods-tag {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
