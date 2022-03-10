<template>
  <vue3-seamless-scroll :list="list" class="scroll" hover :step="0.5">
    <div class="item" v-for="(item, index) in list" :key="index">
      <span>{{ item.title }}</span>
      <span>{{ item.date }}</span>
    </div>
  </vue3-seamless-scroll>
</template>
<script>
import { defineComponent, ref } from "vue";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";

export default defineComponent({
  name: "App",
  components: {
    Vue3SeamlessScroll,
  },
  setup() {
    const list = ref([
      {
        title: "无缝滚动展示数据第1条",
        date: "2022/03/09",
      },
      {
        title: "无缝滚动展示数据第2条",
        date: "2022/03/09",
      },
      {
        title: "无缝滚动展示数据第3条",
        date: "2022/03/09",
      },
      {
        title: "无缝滚动展示数据第4条",
        date: "2022/03/09",
      },
    ]);
    return { list };
  },
});
</script>

<style>
.scroll {
  height: 105px;
  width: 280px;
  overflow: hidden;
  color: #fff;
}

.scroll .item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}
</style>
