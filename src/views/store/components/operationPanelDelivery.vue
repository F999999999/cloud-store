<template>
  <div class="operationPanel-right-delivery" style="display: none">
    <!--  搜索框  -->
    <a-input-search
      v-model:value="searchValue"
      placeholder="请输入您要出库的商品名称"
      :style="{ width: '100%' }"
      @search="onSearch"
    />
    <!--  搜索出的商品列表  -->
    <div
      class="operationPanel-right-delivery-list"
      v-if="deliveryList?.length > 0"
    >
      <a-card
        :class="[
          'operationPanel-right-delivery-item',
          item.id === currentDeliveryId ? 'active' : '',
        ]"
        size="small"
        :title="`商品名称：${item.name}`"
        :style="{ width: '100%', marginBottom: '5px' }"
        v-for="item in deliveryList"
        :key="item.id"
        @click="currentDeliveryId = item.id"
      >
        <p>ID：{{ item.id }}</p>
        <p>重量：{{ item.weight }}</p>
        <p>保质期：{{ item.shelflife }}</p>
        <p>货架ID：{{ item.shelf_id }}</p>
        <p>货架格子ID：{{ item.shelf_grid_id }}</p>
        <p>生产日期：{{ item.production_date }}</p>
        <p>入库时间：{{ item.storage_time }}</p>
      </a-card>
    </div>
    <!--  商品出库按钮  -->
    <a-button
      type="primary"
      :style="{ marginTop: '8px' }"
      v-if="deliveryList?.length > 0"
      @click="removeGoods"
    >
      移除商品
    </a-button>
  </div>
</template>

<script>
import { ref } from "vue";
import { searchDeliveryNameApi, removeGoodsByIdApi } from "@/api/goods";
import { message } from "ant-design-vue";
export default {
  name: "operationPanelDelivery",
  props: {
    width: {
      type: Number,
      default: 340,
    },
    height: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    // 搜索关键字
    const searchValue = ref("");
    // 搜索出的商品列表(商品出库)
    const deliveryList = ref(null);
    // 用于存储当前id和判断active的类名的加入
    const currentDeliveryId = ref(0);
    // 点击搜索或按下回车键时的回调
    const onSearch = () => {
      // 根据商品名称搜索商品列表
      searchDeliveryNameApi(searchValue.value).then((data) => {
        if (data.status === 200) {
          // 存储商品列表(商品出库)
          deliveryList.value = data.data;
          // 提示信息
          message.success(data.message);
          // 清空搜索输入框
          searchValue.value = "";
        }
        if (data.status === 400) {
          // 提示信息
          message.warning(data.message);
          // 清空搜索输入框
          searchValue.value = "";
        }
      });
    };
    // 点击移除商品按钮 移除商品
    const removeGoods = () => {
      // 根据商品id移除商品
      removeGoodsByIdApi({
        id: currentDeliveryId.value,
        takeout_time: new Date().toLocaleString() / 1000,
      }).then((data) => {
        if (data.status === 200) {
          // 提示信息
          message.success(data.message);
          // 清空搜索商品列表
          deliveryList.value = [];
        }
      });
    };

    return {
      searchValue,
      onSearch,
      deliveryList,
      currentDeliveryId,
      removeGoods,
    };
  },
};
</script>

<style scoped lang="less">
.operationPanel-right-delivery {
  height: 100%;
  .operationPanel-right-delivery-list {
    text-align: left;
    height: 80%;
    overflow-y: auto;
    margin-top: 5px;
    p {
      margin-bottom: 8px;
    }
    .operationPanel-right-delivery-item {
      &:hover,
      &.active {
        background-color: #3f85fe66;
      }
    }
  }
}
</style>
