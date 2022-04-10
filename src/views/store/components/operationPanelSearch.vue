<template>
  <div class="operationPanel-setting" style="display: none">
    <!--  搜索框  -->
    <a-input-search
      v-model:value="searchValue"
      placeholder="请输入您要查找的商品名称"
      :style="{ width: '100%' }"
      @search="onSearch"
    />
    <!--  搜索结果列表  -->
    <div class="operationPanel-search-list" v-if="searchResultList?.length > 0">
      <goods-item
        class="operationPanel-search-item"
        v-for="item in searchResultList"
        :key="item.id"
        :goodsData="item"
        :active="selectedGoodsList.indexOf(item.id) !== -1"
        activeText="高亮显示"
        @click="onSelectGoods(item.id)"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { searchGoodsNameApi } from "@/api/goods";
import { message } from "ant-design-vue";
import { setGoodsAttribute } from "@/hooks/useGoods";
import { outlinePass } from "@/utils/three/TOutline";
import GoodsItem from "@/components/goodsItem";
export default {
  name: "operationPanelSearch",
  components: { GoodsItem },
  props: {
    storeId: {
      type: Number,
      default: null,
    },
  },
  setup(props) {
    // 搜索关键字
    const searchValue = ref("");
    // 搜索结果
    const searchResultList = ref([]);
    // 当前被选中的商品
    const selectedGoodsList = ref([]);
    // 点击搜索或按下回车键时的回调
    const onSearch = () => {
      // 根据商品名称搜索商品列表
      searchGoodsNameApi({
        store_id: props.storeId,
        name: searchValue.value,
      }).then((result) => {
        console.log(result);
        if (result.status === 200) {
          // 提示信息
          message.success(result.message);
          searchResultList.value = result.data;
        }
        if (result.status === 400) {
          // 提示信息
          message.warning(result.message);
        }
        // 清空搜索输入框
        searchValue.value = "";
      });
    };
    // 选中商品
    const onSelectGoods = (goodsId) => {
      // 判断是否已经选中
      if (selectedGoodsList.value.indexOf(goodsId) === -1) {
        // 如果未选中该商品 则选中
        selectedGoodsList.value.push(goodsId);
        // 给选中的商品添加自发光效果
        const goodsMesh = setGoodsAttribute(goodsId, 0x41b883, "color");
        // 添加描边效果
        outlinePass.selectedObjects.push(...goodsMesh);
      } else {
        // 如果已经选中了该商品 则取消选中
        selectedGoodsList.value = selectedGoodsList.value.filter(
          (item) => item !== goodsId
        );
        // 给取消选中的商品还原自发光效果
        const goodsMesh = setGoodsAttribute(goodsId, 0xffffff, "color");
        // 移除描边效果
        outlinePass.selectedObjects = outlinePass.selectedObjects.filter(
          (item) => !goodsMesh.find((mesh) => mesh.data.id === item.data.id)
        );
      }
    };

    return {
      searchValue,
      onSearch,
      searchResultList,
      selectedGoodsList,
      onSelectGoods,
    };
  },
};
</script>

<style scoped lang="less">
:deep(.ant-input-affix-wrapper) {
  border-radius: 15px;
  background-color: #1f1f1f;
}
.operationPanel-setting {
  height: 100%;
  .operationPanel-search-list {
    width: 100%;
    text-align: left;
    height: calc(100% - 32px - 30px);
    overflow-y: auto;
    margin-top: 5px;
    border-radius: 10px;
    p {
      margin-bottom: 8px;
    }
    .operationPanel-search-item {
      opacity: 0.9;
      &:hover,
      &.active {
        opacity: 1;
      }
    }
  }
}
</style>
