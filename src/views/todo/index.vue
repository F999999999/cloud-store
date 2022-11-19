<template>
  <div style="margin: 0 10px">
    <a-row :gutter="[20, 20]" style="border-bottom: 1px solid #ccc">
      <a-col :span="2">日志ID</a-col>
      <a-col :span="6">商品名称(商品ID)</a-col>
      <a-col :span="11">当前位置/目标位置</a-col>
      <a-col :span="5">操作</a-col>
    </a-row>
    <a-row :gutter="20">
      <a-col
        :span="24"
        v-for="item in toDoList"
        :key="item.id"
        style="border-bottom: 1px solid #ccc; padding: 10px 0"
      >
        <a-row>
          <a-col :span="2" style="position: relative">
            <div
              style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              "
            >
              {{ item.id }}
            </div>
          </a-col>
          <a-col :span="6" style="position: relative">
            <div
              style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              "
            >
              {{ item.goods_name }}({{ item.goods_id }})
            </div>
          </a-col>
          <a-col :span="11">
            <a-row>
              <div v-if="item.before_shelf_grid_id === null">入库</div>
              <div v-if="item.before_shelf_grid_id">
                {{ item.before_store_name }}<span style="color: #187ddc">></span
                >{{ item.before_shelf_name }}货架<span style="color: #187ddc"
                  >></span
                >{{ item.before_shelf_grid_y + 1 }}层{{
                  item.before_shelf_grid_x + 1
                }}行{{ item.before_shelf_grid_z + 1 }}列
              </div>
            </a-row>
            <div
              style="
                width: 100%;
                height: 1px;
                background-color: green;
                margin: 6px 0;
              "
            ></div>
            <a-row>
              <div v-if="item.now_shelf_grid_id === null">出库</div>
              <div v-if="item.now_shelf_grid_id">
                {{ item.now_store_name }}<span style="color: #187ddc">></span
                >{{ item.now_shelf_name }}货架<span style="color: #187ddc"
                  >></span
                >{{ item.now_shelf_grid_y + 1 }}层{{
                  item.now_shelf_grid_x + 1
                }}行{{ item.now_shelf_grid_z + 1 }}列
              </div>
            </a-row>
          </a-col>
          <a-col :span="5" style="position: relative">
            <a-button
              type="primary"
              @click="confirmMoveGoods(item.id)"
              style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
              "
            >
              完成
            </a-button>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { confirmMoveGoodsApi, getPendingGoodsApi } from "@/api/goods";
import { ref } from "vue";
import { message } from "ant-design-vue";

export default {
  name: "todo",
  setup() {
    const toDoList = ref([]);
    const getPendingGoods = () => {
      getPendingGoodsApi().then((res) => {
        if (res.status === 200) {
          toDoList.value = res.data;
        }
      });
    };
    getPendingGoods();

    const confirmMoveGoods = (logId) => {
      confirmMoveGoodsApi({ log_id: logId }).then((res) => {
        if (res.status === 200) {
          // 提示信息
          message.success(res.message);
          getPendingGoods();
        } else {
          // 提示信息
          message.error(res.message);
        }
      });
    };

    setInterval(() => {
      getPendingGoods();
    }, 6000);

    return {
      toDoList,
      confirmMoveGoods,
    };
  },
};
</script>

<style scoped></style>
