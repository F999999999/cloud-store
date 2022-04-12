<template>
  <div
    class="operationPanel"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <a-row class="container">
      <a-col :span="4" class="operationPanel-options">
        <div
          class="operationPanel-options-item"
          :class="{ active: currentPanelId === item.id }"
          v-for="item in panelList"
          :key="item.id"
          @click="handlePanelClick(item.id)"
        >
          <HomeOutlined
            :style="{ fontSize: 'large' }"
            v-if="item.id === 'inventory'"
          />
          <CloudUploadOutlined
            :style="{ fontSize: 'large' }"
            v-if="item.id === 'storage'"
          />
          <CloudDownloadOutlined
            :style="{ fontSize: 'large' }"
            v-if="item.id === 'delivery'"
          />
          <searchOutlined
            :style="{ fontSize: 'large' }"
            v-if="item.id === 'search'"
          />
          <SettingOutlined
            :style="{ fontSize: 'large' }"
            v-if="item.id === 'setting'"
          />
          <span>{{ item.title }}</span>
        </div>
      </a-col>
      <a-col :span="20" class="operationPanel-content">
        <!--  库存  -->
        <operation-panel-inventory
          :storeId="storeId"
          v-show="currentPanelId === 'inventory'"
        />
        <!--  入库  -->
        <operation-panel-storage
          :storeId="storeId"
          v-show="currentPanelId === 'storage'"
          ref="storagePanelRef"
        />
        <!--  出库  -->
        <operation-panel-delivery
          :storeId="storeId"
          v-show="currentPanelId === 'delivery'"
          :currentPanelId="currentPanelId"
        />
        <!-- 查询 -->
        <operation-panel-search
          :store-id="storeId"
          v-show="currentPanelId === 'search'"
          :currentPanelId="currentPanelId"
        />
        <!-- 设置 -->
        <operation-panel-setting
          :storeId="storeId"
          v-show="currentPanelId === 'setting'"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  HomeOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";
import { ref } from "vue";
import OperationPanelInventory from "@/views/store/components/operationPanelInventory";
import OperationPanelStorage from "@/views/store/components/operationPanelStorage";
import OperationPanelDelivery from "@/views/store/components/operationPanelDelivery";
import OperationPanelSetting from "@/views/store/components/operationPanelSetting";
import OperationPanelSearch from "@/views/store/components/operationPanelSearch";

export default {
  name: "operationPanel",
  components: {
    OperationPanelSearch,
    OperationPanelSetting,
    OperationPanelDelivery,
    OperationPanelStorage,
    OperationPanelInventory,
    HomeOutlined,
    CloudDownloadOutlined,
    CloudUploadOutlined,
    SearchOutlined,
    SettingOutlined,
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
      {
        id: "search",
        title: "查询",
      },
      {
        id: "setting",
        title: "设置",
      },
    ]);
    // 当前选中的操作面板
    const currentPanelId = ref(panelList.value[0].id);

    // 切换操作面板
    const handlePanelClick = (panelId) => {
      currentPanelId.value = panelId;
      if (panelId === "storage") {
        // 切换到入库面板时，更新入库时间
        storagePanelRef.value.updateStorageTime();
      }
    };
    const storagePanelRef = ref(null);
    const currentDate = ref(new Date());

    return {
      panelList,
      currentPanelId,
      handlePanelClick,
      currentDate,
      storagePanelRef,
    };
  },
};
</script>

<style scoped lang="less">
.operationPanel {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #92a2ba9d;
  border-radius: 15px;
  overflow: hidden;
  .container {
    height: 100%;
    .operationPanel-options {
      background-color: #111111cc;
      .operationPanel-options-item {
        height: 90px;
        padding: 20px 0;
        // 鼠标形状设置为手指
        cursor: Pointer;
        &.active {
          color: #3f85fe;
        }
        span {
          display: block;
          margin-top: 5px;
        }
      }
    }
    .operationPanel-content {
      height: 100%;
      padding: 20px 20px 0;
      background-color: #393944cc;
    }
  }
}
</style>
