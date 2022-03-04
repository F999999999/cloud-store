<template>
  <div class="shelf-tag" ref="domElementRef">
    <a-card
      v-show="tagShow"
      :title="'货物 - ' + name"
      style="width: 260px; opacity: 0.8"
      headStyle="color: #000; background-color: #fff;"
      bodyStyle="color: #fff; background-color: #92a2ba;"
      :bordered="false"
    >
      <template #extra>
        <a href="#" v-if="persistentShow">{{ tagShowTimer }}</a>
      </template>

      <a-row style="color: #000">
        <a-col :span="8">ID:</a-col>
        <a-col :span="16">{{ id || "-" }}</a-col>
        <a-col :span="8"> 名称：</a-col>
        <a-col :span="16">{{ name || "-" }}</a-col>
        <a-col :span="8"> 重量：</a-col>
        <a-col :span="16"> {{ weight >= 0 ? weight : "-" }}</a-col>
        <a-col :span="8"> 保质期：</a-col>
        <a-col :span="16"> {{ shelflife >= 0 ? shelflife : "-" }}</a-col>
        <a-col :span="8">生产日期：</a-col>
        <a-col :span="16">
          {{
            production_date >= 0
              ? new Date(production_date * 1000).toLocaleString()
              : "-"
          }}
        </a-col>
        <a-col :span="8">入库时间：</a-col>
        <a-col :span="16">
          {{
            production_date >= 0
              ? new Date(production_date * 1000).toLocaleString()
              : "-"
          }}
        </a-col>
        <a-col :span="8">货物位置：</a-col>
        <a-col :span="16"> {{ shelf_id }} - {{ shelf_grid_id }}</a-col>
      </a-row>
      <a-row>
        <a-col
          :span="24"
          v-if="persistentShow"
          style="color: red; background-color: yellow"
        >
          6s后自动关闭
        </a-col>
        <a-col :span="24" v-else style="color: red; background-color: yellow">
          提示：双击并拖动可以移动货物位置
        </a-col>
      </a-row>
    </a-card>
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
    changeGoodsTagShow: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const domElementRef = ref(null);

    const store = useStore();

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
    };
  },
};
</script>

<style scoped>
.shelf-tag {
  position: absolute;
  top: 0;
  left: 0;
  /*color: #fff;*/
  /*background-color: #92a2ba9d;*/
  /*border-radius: 15px;*/
}
</style>
