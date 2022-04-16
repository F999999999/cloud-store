<template>
  <div class="operationPanel-delivery" style="display: none">
    <!--  搜索框  -->
    <a-input-search
      v-model:value="searchValue"
      placeholder="请输入您要出库的商品名称"
      :style="{ width: '100%' }"
      @search="onSearch"
    />
    <!--  搜索出的商品列表  -->
    <div class="operationPanel-delivery-list" v-if="deliveryList?.length > 0">
      <goods-item
        class="operationPanel-delivery-item"
        v-for="item in deliveryList"
        :key="item.id"
        :goodsData="item"
        :active="selectedDeliveryIdList.indexOf(item.id) !== -1"
        activeText="已选择"
        @click="onSelectDelivery(item.id)"
      />
    </div>
    <!--  商品出库按钮  -->
    <a-button
      type="danger"
      :style="{ marginTop: '8px' }"
      v-if="deliveryList?.length > 0"
      @click="removeGoods"
    >
      商品出库
    </a-button>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { searchGoodsNameApi } from "@/api/goods";
import { message } from "ant-design-vue";
import { useStore } from "vuex";
import GoodsItem from "@/components/goodsItem";
import { setGoodsAttribute } from "@/hooks/useGoods";
import { outlinePass } from "@/utils/three/TOutlinePass";
export default {
  name: "operationPanelDelivery",
  components: { GoodsItem },
  props: {
    storeId: {
      type: Number,
      default: null,
    },
    currentPanelId: {
      type: String,
      default: "search",
    },
  },
  setup(props) {
    const store = useStore();
    // 搜索关键字
    const searchValue = ref("");
    // 搜索出的商品列表(商品出库)
    const deliveryList = ref([]);
    // 当前被选中的商品
    const selectedDeliveryIdList = ref([]);
    // 点击搜索或按下回车键时的回调
    const onSearch = () => {
      // 根据商品名称搜索商品列表
      searchGoodsNameApi({
        store_id: props.storeId,
        name: searchValue.value,
      }).then((result) => {
        if (result.status === 200) {
          // 存储商品列表(商品出库)
          deliveryList.value = result.data;
          // 提示信息
          message.success(result.message);
          // 清空搜索输入框
          searchValue.value = "";
        }
        if (result.status === 400) {
          // 提示信息
          message.warning(result.message);
          // 清空搜索输入框
          searchValue.value = "";
        }
      });
    };
    // 点击移除商品按钮 移除商品
    const removeGoods = () => {
      store
        .dispatch("goods/removeGoods", {
          storeId: props.storeId,
          ids: selectedDeliveryIdList.value,
        })
        .then((result) => {
          if (result.status === 200) {
            // 删除搜索结果中移除的商品
            deliveryList.value = deliveryList.value.filter(
              (item) => !result.data.find((goods) => goods.goods_id === item.id)
            );
          }
        });
      // 清空选中的商品
      selectedDeliveryIdList.value = [];
    };

    // 选中商品
    const onSelectDelivery = (goodsId) => {
      if (selectedDeliveryIdList.value.indexOf(goodsId) === -1) {
        selectedDeliveryIdList.value.push(goodsId);
        // 给选中的商品添加自发光效果
        const goodsMesh = setGoodsAttribute({
          goodsIds: goodsId,
          value: 0x333333,
          attribute: "color",
        });
        // 添加描边效果
        outlinePass.selectedObjects.push(...goodsMesh);
      } else {
        selectedDeliveryIdList.value.splice(
          selectedDeliveryIdList.value.indexOf(goodsId),
          1
        );
        // 给取消选中的商品还原自发光效果
        const goodsMesh = setGoodsAttribute({
          goodsIds: goodsId,
          value: 0xffffff,
          attribute: "color",
        });
        // 移除描边效果
        outlinePass.selectedObjects = outlinePass.selectedObjects.filter(
          (item) => !goodsMesh.find((mesh) => mesh.data.id === item.data.id)
        );
      }
    };

    watch(
      () => props.currentPanelId,
      (newVal, oldVal) => {
        if (oldVal === "delivery" && newVal !== "delivery") {
          // 执行清理操作
          // 清空当前被选中的商品
          selectedDeliveryIdList.value = [];
          // 给选中的商品还原自发光效果
          setGoodsAttribute({
            all: true,
            value: 0xffffff,
            attribute: "color",
          });
          // 给选中的商品还原描边效果
          outlinePass.selectedObjects = [];
        }
        if (oldVal !== "delivery" && newVal === "delivery") {
          outlinePass.selectedObjects = [];
        }
      }
    );

    return {
      searchValue,
      onSearch,
      deliveryList,
      selectedDeliveryIdList,
      removeGoods,
      onSelectDelivery,
    };
  },
};
</script>

<style scoped lang="less">
:deep(.ant-input-group-wrapper) {
  border-radius: 15px;
  background-color: #1f1f1f;
}
:deep(.ant-input-group .ant-input) {
  border-radius: 15px 0 0 15px;
}
:deep(.ant-input-group-addon),
:deep(.ant-input-search
    > .ant-input-group
    > .ant-input-group-addon:last-child
    .ant-input-search-button) {
  border-radius: 0 15px 15px 0;
}
.operationPanel-delivery {
  height: 100%;
  .operationPanel-delivery-list {
    text-align: left;
    height: calc(100% - 32px - 32px - 30px);
    overflow-y: auto;
    margin-top: 5px;
    border-radius: 10px;
    p {
      margin-bottom: 8px;
    }
    .operationPanel-delivery-item {
      opacity: 0.9;
      &:hover,
      &.active {
        opacity: 1;
      }
    }
  }
}
</style>
