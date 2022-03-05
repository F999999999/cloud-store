<template>
  <div class="shelf-tag" ref="domElementRef">
    <a-card
      v-show="tagShow"
      :title="'货架 - ' + name"
      style="width: 200px; opacity: 0.8"
      headStyle="color: #000; background-color: #fff;"
      bodyStyle="color: #fff; background-color: #92a2ba;"
      :bordered="false"
    >
      <template #extra>
        <a href="#">more</a>
      </template>

      <a-row style="color: #000">
        <a-col :span="8">货架ID:</a-col>
        <a-col :span="16">{{ id }}</a-col>
        <a-col :span="8"> 名称：</a-col>
        <a-col :span="16">{{ name }}</a-col>
        <a-col :span="8"> 尺寸：</a-col>
        <a-col :span="16">
          {{ size.length }}*{{ size.width }}*{{ size.height }}
        </a-col>
        <a-col :span="8"> 位置：</a-col>
        <a-col :span="8"> 第 {{ position.x + 1 }} 行</a-col>
        <a-col :span="8">第 {{ position.z + 1 }} 列</a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "shelfTag",
  props: {
    tagShow: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: null,
    },
    name: {
      type: String,
      default: "",
    },
    size: {
      type: Object,
      default: () => ({
        length: 0,
        width: 0,
        height: 0,
      }),
    },
    position: {
      type: Object,
      default: () => ({
        x: 0,
        y: 0,
        z: 0,
      }),
    },
  },
  setup() {
    const domElementRef = ref(null);
    return {
      domElementRef,
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
