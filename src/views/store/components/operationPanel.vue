<template>
  <div
    class="operationPanel"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <a-row class="container">
      <a-col :span="4" class="operationPanel-left">
        <div
          class="operationPanel-left-item"
          :class="{ active: currentPanelId === item.id }"
          style="cursor: Pointer"
          v-for="item in panelList"
          :key="item.id"
          @click="handlePanelClick(item.id)"
        >
          <HomeOutlined :style="{ fontSize: 'large' }" />
          <span>{{ item.title }}</span>
        </div>
      </a-col>
      <a-col :span="20" class="operationPanel-right">
        <!--  库存  -->
        <operation-panel-inventory
          :storeId="storeId"
          v-show="currentPanelId === 'inventory'"
        />
        <!--  入库  -->
        <operation-panel-storage
          :storeId="storeId"
          v-show="currentPanelId === 'storage'"
        />
        <!--  出库  -->
        <operation-panel-delivery
          :storeId="storeId"
          v-show="currentPanelId === 'delivery'"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { HomeOutlined } from "@ant-design/icons-vue";
import OperationPanelInventory from "@/views/store/components/operationPanelInventory";
import OperationPanelStorage from "@/views/store/components/operationPanelStorage";
import OperationPanelDelivery from "@/views/store/components/operationPanelDelivery";
import { ref } from "vue";
export default {
  name: "operationPanel",
  components: {
    OperationPanelDelivery,
    OperationPanelStorage,
    OperationPanelInventory,
    HomeOutlined,
  },
  props: {
    width: {
      type: Number,
      default: 340,
    },
    height: {
      type: Number,
      default: 0,
    },
    storeId: {
      type: Number,
      default: null,
    },
  },
  setup() {
    const panelList = ref([
      {
        id: "inventory",
        title: "库存",
      },
      {
        id: "storage",
        title: "入库",
      },
      {
        id: "delivery",
        title: "出库",
      },
    ]);
    // 当前选中的操作面板
    const currentPanelId = ref(panelList.value[0].id);

    // 切换操作面板
    const handlePanelClick = (panelId) => {
      currentPanelId.value = panelId;
    };

    return { panelList, currentPanelId, handlePanelClick };
  },
};
</script>

<style scoped lang="less">
.operationPanel {
  position: absolute;
  top: 0;
  left: 0;
  width: 340px;
  height: 100%;
  background-color: #92a2ba9d;
  border-radius: 15px;
  overflow: hidden;
  .container {
    height: 100%;
    .operationPanel-left {
      background-color: #ffffff91;
      .operationPanel-left-item {
        height: 90px;
        padding: 20px 0;
        &.active {
          color: #3f85fe;
        }
        span {
          display: block;
          margin-top: 5px;
        }
      }
    }
    .operationPanel-right {
      height: 100%;
      padding: 20px 20px 0;
    }
  }
}
</style>
