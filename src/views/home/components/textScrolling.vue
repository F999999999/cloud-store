<template>
  <vue3-seamless-scroll :list="list" class="scroll" hover :step="0.5">
    <div class="item" v-for="item in list" :key="item.goods_id">
      <span>商品:{{ item.goods_name + goodsStatus }}</span>
      <span>{{ formatDate(item.operate_time) }}</span>
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
    const list = ref([]);
    const goodsStatus = ref("");
    //获取商品日志
    getGoodsLogDateApi().then((res) => {
      console.log(res);
      if (res.status === 200) {
        list.value = res.data;
        console.log(list.value);
        if (list.value) {
          list.value.forEach((item) => {
            //入库
            if (
              !(
                item.before_shelf_grid_id &&
                item.before_shelf_id &&
                item.before_store_id
              )
            ) {
              goodsStatus.value = "入库";
            }
            //  出库
            if (
              !(
                item.now_shelf_grid_id &&
                item.now_shelf_id &&
                item.now_store_id
              )
            ) {
              goodsStatus.value = "出库";
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
              goodsStatus.value = "移动";
            }
          });
        }
      }
    });
    //时间格式转化
    function formatDate(value) {
      let date = new Date(value);
      let y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate(),
        h = date.getHours(),
        i = date.getMinutes(),
        s = date.getSeconds();
      if (m < 10) {
        m = "0" + m;
      }
      if (d < 10) {
        d = "0" + d;
      }
      if (h < 10) {
        h = "0" + h;
      }
      if (i < 10) {
        i = "0" + i;
      }
      if (s < 10) {
        s = "0" + s;
      }
      let t = y + "-" + m + "-" + d + " " + h + ":" + i + ":" + s;
      return t;
    }
    return { list, formatDate, goodsStatus };
  },
});
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
