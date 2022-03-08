<template>
  <div class="operationPanel-right-delivery" style="display: none">
    <!--  搜索框  -->
    <a-input-search
      v-model:value="searchValue"
      placeholder="请搜索你想选择的商品"
      :style="{ width: '100%' }"
      @search="onSearch"
    />
    <!--  搜索出的商品列表  -->
    <div class="operationPanel-right-delivery-list">
      <a-card
        size="small"
        title="商品名称"
        :style="{ width: '100%', marginTop: '5px' }"
      >
        <p>ID：8</p>
        <p>重量：2.5</p>
        <p>保质期：6</p>
        <p>货架ID：3</p>
        <p>货架格子ID：34</p>
        <p>生产日期：2022/10/7</p>
        <p>入库时间：2022/11/6 22:00:00</p>
      </a-card>
      <a-card
        size="small"
        title="商品名称"
        :style="{ width: '100%', marginTop: '5px' }"
      >
        <p>ID：8</p>
        <p>重量：2.5</p>
        <p>保质期：6</p>
        <p>货架ID：3</p>
        <p>货架格子ID：34</p>
        <p>生产日期：2022/10/7</p>
        <p>入库时间：2022/11/6 22:00:00</p>
      </a-card>
      <a-card
        size="small"
        title="商品名称"
        :style="{ width: '100%', marginTop: '5px' }"
      >
        <p>ID：8</p>
        <p>重量：2.5</p>
        <p>保质期：6</p>
        <p>货架ID：3</p>
        <p>货架格子ID：34</p>
        <p>生产日期：2022/10/7</p>
        <p>入库时间：2022/11/6 22:00:00</p>
      </a-card>
      <a-card
        size="small"
        title="商品名称"
        :style="{ width: '100%', marginTop: '5px' }"
      >
        <p>ID：8</p>
        <p>重量：2.5</p>
        <p>保质期：6</p>
        <p>货架ID：3</p>
        <p>货架格子ID：34</p>
        <p>生产日期：2022/10/7</p>
        <p>入库时间：2022/11/6 22:00:00</p>
      </a-card>
    </div>
    <!--  商品出库按钮  -->
    <a-button type="primary" :style="{ marginTop: '8px' }"> 移除商品 </a-button>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "operationPanelDelivery",
  setup() {
    // 搜索关键字
    const searchValue = ref("");
    // 点击搜索或按下回车键时的回调
    const onSearch = (value) => {
      console.log("use value", value);
      console.log("or use this.value", searchValue.value);
    };

    return {
      searchValue,
      onSearch,
    };
  },
};
</script>

<style scoped></style>
