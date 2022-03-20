<template>
  <vue3-seamless-scroll
    :list="goodsLogList"
    class="scroll"
    hover
    :step="0.5"
    v-if="goodsLogList.length > 0"
  >
    <div class="item" v-for="(item, index) in goodsLogList" :key="index">
      <span>
        {{ item.now_store_name }}：{{ item.goods_name }} => {{ item.status }}
      </span>
      <span>
        {{
          new Date(item.operate_time * 1000)
            .toLocaleString()
            .replaceAll("/", "-")
        }}
      </span>
    </div>
  </vue3-seamless-scroll>
</template>
<script>
import { defineComponent, ref } from "vue";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import { getGoodsLogDateApi } from "@/api/store";

export default defineComponent({
  name: "App",
  components: {
    Vue3SeamlessScroll,
  },
  setup() {
    // 获取商品日志
    const { goodsLogList } = useGoodsLog();

    return { goodsLogList };
  },
});

//获取商品日志
const useGoodsLog = () => {
  const goodsLogList = ref([]);
  const getGoodsLog = async () => {
    const res = await getGoodsLogDateApi();
    console.log(res);
    if (res.status === 200) {
      goodsLogList.value = res.data.map((item) => {
        //入库
        if (
          !(
            item.before_shelf_grid_id &&
            item.before_shelf_id &&
            item.before_store_id
          )
        ) {
          item.status = "入库";
        }
        //  出库
        if (
          !(item.now_shelf_grid_id && item.now_shelf_id && item.now_store_id)
        ) {
          item.status = "出库";
        }
        //  移动
        if (
          item.before_shelf_grid_id &&
          item.before_shelf_id &&
          item.before_store_id &&
          item.now_shelf_grid_id &&
          item.now_shelf_id &&
          item.now_store_id
        ) {
          item.status = "移动";
        }
        return item;
      });
    }
  };
  getGoodsLog();
  return { goodsLogList };
};
</script>

<style>
.scroll {
  height: 100%;
  overflow: hidden;
  color: #fff;
}

.scroll .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}
.scroll .item span {
  white-space: nowrap;
  /*溢出部分文字隐藏*/
  overflow: hidden;
  /*溢出部分省略号处理*/
  text-overflow: ellipsis;
}
</style>
