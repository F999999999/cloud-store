<template>
  <div class="shelf-tag" ref="domElementRef" :data-id="shelfTagData.id">
    <a-card
      v-show="shelfTagData.tagShow"
      :title="'货架 - ' + shelfTagData.name"
      style="width: 200px; opacity: 0.8"
      headStyle="color: #000; background-color: #fff;"
      bodyStyle="color: #fff; background-color: #92a2ba;"
      :bordered="false"
    >
      <a-row>
        <a-col :span="16">
          <a-row style="color: #000">
            <a-col :span="12">货架ID:</a-col>
            <a-col :span="12">
              <a-tag color="#008000" style="font-weight: 700; color: yellow">
                {{ shelfTagData.id || "-" }}
              </a-tag>
            </a-col>
            <a-col :span="12"> 名称：</a-col>
            <a-col :span="12">
              <a-tag color="#008000" style="font-weight: 700; color: yellow">
                {{ shelfTagData.name || "-" }}
              </a-tag>
            </a-col>
            <a-col :span="12"> 位置：</a-col>
            <a-col :span="12">
              <a-tag color="#008000" style="font-weight: 700">
                <span style="color: yellow">{{
                  shelfTagData.position.x + 1
                }}</span>
                行
                <span style="color: yellow">{{
                  shelfTagData.position.z + 1
                }}</span>
                列
              </a-tag>
            </a-col>
            <a-col :span="12"> 尺寸：</a-col>
            <a-col :span="12">
              <a-tag color="#008000" style="font-weight: 700">
                <span style="color: yellow">{{
                  shelfTagData.size.length
                }}</span>
                *
                <span style="color: yellow">{{ shelfTagData.size.width }}</span>
                *
                <span style="color: yellow">{{
                  shelfTagData.size.height
                }}</span>
              </a-tag>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="8" style="margin-top: -18px">
          <a-progress
            type="circle"
            :percent="shelfTagData.total.useGrid"
            :width="60"
          />
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "shelfTag",
  props: {
    shelfTagData: {
      type: Object,
      default: () => ({}),
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
}
</style>
