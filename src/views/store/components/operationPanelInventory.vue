<template>
  <div class="operationPanel-right-inventory" style="display: block">
    <div class="operationPanel-right-overview">
      <h3>货物总览</h3>
      <a-row class="operationPanel-right-overview-content">
        <a-col :span="8" class="operationPanel-right-overview-left">
          <a-tag color="#f66">已用：{{ shelfTotal?.useGrid }}</a-tag>
          <a-tag color="#18e">空闲：{{ shelfTotal?.emptyGrid }}</a-tag>
        </a-col>
        <a-col :span="8" class="operationPanel-right-overview-center">
          <a-progress
            type="circle"
            stroke-color="#18e"
            trailColor="#f66"
            :percent="
              shelfTotal?.useGrid /
              (shelfTotal?.useGrid + shelfTotal?.emptyGrid)
            "
            :width="80"
            :showInfo="false"
          />
          <div class="inside">
            <span>使用率</span>
            <span class="number">{{
              (
                shelfTotal?.useGrid /
                (shelfTotal?.useGrid + shelfTotal?.emptyGrid)
              ).toFixed(2)
            }}</span>
          </div>
        </a-col>
        <a-col :span="8" class="operationPanel-right-overview-right">
          <p>XX数量</p>
          <span>XX</span>
        </a-col>
      </a-row>
    </div>
    <div class="operationPanel-right-logistics">
      <h3>智能流配</h3>
      <a-row class="operationPanel-right-logistics-content">
        <a-col :span="16" class="operationPanel-right-logistics-left">
          <span class="red">XXXXXXXXX</span>
          <span class="blue">XXXXXXXXX</span>
        </a-col>
        <a-col
          :span="5"
          :offset="3"
          class="operationPanel-right-logistics-right"
        >
          <span><ArrowUpOutlined /></span>
          <span><ArrowRightOutlined /></span>
        </a-col>
      </a-row>
    </div>
    <div class="operationPanel-right-replenishment">
      <h3>补货信息</h3>
      <a-row class="operationPanel-right-replenishment-content">
        <a-col
          :span="7"
          class="operationPanel-right-replenishment-item"
        ></a-col>
        <a-col
          :span="7"
          :offset="1"
          class="operationPanel-right-replenishment-item"
        ></a-col>
        <a-col
          :span="7"
          :offset="1"
          class="operationPanel-right-replenishment-item"
        ></a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { ArrowRightOutlined, ArrowUpOutlined } from "@ant-design/icons-vue";
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "operationPanelInventory",
  components: {
    ArrowRightOutlined,
    ArrowUpOutlined,
  },
  props: {
    storeId: {
      type: Number,
      default: null,
    },
  },
  setup() {
    const store = useStore();
    // 货架统计数据
    const shelfTotal = computed(() => store.state.shelf.shelfTotal);

    return {
      shelfTotal,
    };
  },
};
</script>

<style scoped lang="less">
.operationPanel-right-inventory {
  .operationPanel-right-overview,
  .operationPanel-right-logistics,
  .operationPanel-right-replenishment {
    h3 {
      text-align: left;
      font-weight: 700;
      font-size: 15px;
    }
  }
  .operationPanel-right-overview {
    .operationPanel-right-overview-content {
      height: 120px;
      .operationPanel-right-overview-left {
        span {
          display: block;
          width: 74px;
          height: 20px;
          margin-top: 20px;
          color: white;
          &.blue {
            background-color: #3f85fe;
          }
          &.red {
            background-color: #ff7b6a;
          }
        }
      }
      .operationPanel-right-overview-center {
        position: relative;
        padding-top: 10px;
        .inside {
          position: absolute;
          top: 20px;
          left: 10px;
          height: 60px;
          width: 60px;
          border-radius: 50%;
          background-color: #ffffffac;
          padding-top: 10px;
          span {
            display: block;
            font-size: 12px;
            &.number {
              font-size: 16px;
              font-weight: bold;
            }
          }
        }
      }
      .operationPanel-right-overview-right {
        p {
          margin: 20px 0 10px 0;
        }
        span {
          font-weight: bold;
        }
      }
    }
  }
  .operationPanel-right-logistics {
    .operationPanel-right-logistics-content {
      height: 100px;
      .operationPanel-right-logistics-left {
        span {
          display: block;
          height: 30px;
          line-height: 30px;
          color: white;
          border-radius: 15px;
          &.red {
            background-color: #f66;
            margin-bottom: 10px;
          }
          &.blue {
            background-color: #18e;
          }
        }
      }
      .operationPanel-right-logistics-right {
        span {
          display: block;
          height: 30px;
          line-height: 30px;
          background-color: #ffffffac;
          border-radius: 15px;
          margin-bottom: 10px;
        }
      }
    }
  }
  .operationPanel-right-replenishment {
    .operationPanel-right-replenishment-content {
      height: 140px;
      .operationPanel-right-replenishment-item {
        height: 120px;
        background-color: #ffffff54;
        border-radius: 10px;
      }
    }
  }
}
</style>
