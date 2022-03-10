<template>
  <div
    class="operationPanel"
    :style="{ width: width + 'px', height: height + 'px' }"
  >
    <a-row class="container">
      <a-col :span="4" class="operationPanel-left">
        <div class="operationPanel-left-item active">
          <HomeOutlined :style="{ fontSize: 'large' }" /><span>库存</span>
        </div>
        <div class="operationPanel-left-item">
          <HomeOutlined :style="{ fontSize: 'large' }" /><span>入库</span>
        </div>
        <div class="operationPanel-left-item">
          <HomeOutlined :style="{ fontSize: 'large' }" /><span>出库</span>
        </div>
      </a-col>
      <a-col :span="20" class="operationPanel-right">
        <!--  库存  -->
        <operation-panel-inventory />
        <!--  入库  -->
        <operation-panel-storage />
        <!--  出库  -->
        <operation-panel-delivery />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { HomeOutlined } from "@ant-design/icons-vue";
import OperationPanelInventory from "@/views/store/components/operationPanelInventory";
import OperationPanelStorage from "@/views/store/components/operationPanelStorage";
import OperationPanelDelivery from "@/views/store/components/operationPanelDelivery";
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
  },
};

// 实现tabs切换(排他思想)
window.onload = () => {
  let titleName = document.getElementsByClassName("operationPanel-left-item");
  // console.log(titleName, "titleName");
  let tabContent = document.querySelectorAll(".operationPanel-right>div");
  // console.log(tabContent, "tabContent");
  if (titleName.length !== tabContent.length) {
    return;
  }
  for (let i = 0; i < titleName.length; i++) {
    titleName[i].id = i;
    titleName[i].onclick = function () {
      for (let j = 0; j < titleName.length; j++) {
        titleName[j].className = "operationPanel-left-item";
        tabContent[j].style.display = "none";
      }
      // console.log(this, "this");
      this.className = "operationPanel-left-item active";
      tabContent[this.id].style.display = "block";
    };
  }
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
      .operationPanel-right-delivery {
        .operationPanel-right-delivery-list {
          text-align: left;
          height: 600px;
          overflow-y: auto;
          p {
            margin-bottom: 8px;
          }
        }
      }
    }
  }
}
</style>
