<template>
  <div class="shelf-tag" ref="domElementRef">
    <a-card
      v-show="show"
      :title="title"
      style="width: 260px; opacity: 0.8"
      headStyle="color: #000; background-color: #fff;"
      bodyStyle="color: #fff; background-color: #92a2ba;"
      :bordered="false"
    >
      <template #extra>
        <a href="#">more</a>
      </template>

      <a-row style="color: #000">
        <a-col :span="8">ID:</a-col>
        <a-col :span="16">{{ id || "-" }}</a-col>
        <a-col :span="8"> 名称：</a-col>
        <a-col :span="16">{{ name || "-" }}</a-col>
        <a-col :span="8"> 重量：</a-col>
        <a-col :span="16"> {{ weight >= 0 ? weight : "-" }} </a-col>
        <a-col :span="8"> 保质期：</a-col>
        <a-col :span="16"> {{ shelflife >= 0 ? shelflife : "-" }} </a-col>
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
        <a-col :span="16"> {{ shelf_id }} - {{ shelf_grid_id }} </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" v-if="persistentShow">
          提示：再次按下鼠标左键并拖动可以移动货物位置
        </a-col>
        <a-col :span="24" v-else>提示：双击并拖动可以移动货物位置</a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "goodsTag",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
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
