<template>
  <div class="operationPanel-inventory" style="display: block">
    <div class="operationPanel-overview">
      <h3>商品总览</h3>
      <a-row class="operationPanel-overview-content">
        <a-col :span="12" class="operationPanel-overview-usage">
          <a-progress
            type="circle"
            strokeColor="#f33"
            trailColor="#18e"
            :percent="
              (shelfTotal?.useGrid /
                (shelfTotal?.useGrid + shelfTotal?.emptyGrid)) *
              100
            "
            :width="100"
            class="operationPanel-overview-usage-progress"
          >
            <template #format>
              <div class="operationPanel-overview-usage-inside">
                <div>
                  <span>使用率</span>
                  <span class="number">
                    {{
                      shelfTotal?.useGrid
                        ? (
                            (shelfTotal?.useGrid /
                              (shelfTotal?.useGrid + shelfTotal?.emptyGrid)) *
                            100
                          ).toFixed(2)
                        : ""
                    }}%
                  </span>
                </div>
              </div>
            </template>
          </a-progress>
        </a-col>
        <a-col :span="12" class="operationPanel-overview-overview">
          <div>
            <a-tag color="#f33">已用：{{ shelfTotal?.useGrid }}</a-tag>
            <a-tag color="#18e">空闲：{{ shelfTotal?.emptyGrid }}</a-tag>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="operationPanel-logistics">
      <h3>智能调度</h3>
      <a-row>
        <a-col :span="24">
          <a-cascader
            v-model:value="oldShelfOptionsValue"
            :options="useShelfOptions"
            :display-render="oldDisplayRender"
            expand-trigger="hover"
            placeholder="请选择原商品"
          />
        </a-col>
        <a-col :span="20" :offset="2">
          <span class="operationPanel-logistics-down" @click="moveGoods">
            <ArrowDownOutlined /> 确认移动 <ArrowDownOutlined />
          </span>
        </a-col>
        <a-col :span="24">
          <a-cascader
            v-model:value="newShelfOptionsValue"
            :options="emptyShelfOptions"
            :display-render="newDisplayRender"
            expand-trigger="hover"
            placeholder="请选择新商品位置"
          />
        </a-col>
      </a-row>
    </div>
    <div class="operationPanel-replenishment">
      <h3>临期检测</h3>
      <div class="operationPanel-replenishment-content">
        <div
          class="operationPanel-replenishment-item"
          v-for="goods in expireGoodsList"
          :key="goods.id"
        >
          <h3>
            商品名称：<span>{{ goods.name }}</span>
          </h3>
          <p>
            生产日期：
            <span>
              {{
                new Date(goods.production_date * 1000)
                  .toLocaleString()
                  .replaceAll("/", "-")
                  .replaceAll("00:00:00", "")
              }}
            </span>
          </p>
          <p>
            过期日期：
            <span>
              {{
                new Date(goods.expiration_time * 1000)
                  .toLocaleString()
                  .replaceAll("/", "-")
                  .replaceAll("00:00:00", "")
              }}
            </span>
          </p>
          <p>
            入库时间：
            <span>
              {{
                new Date(goods.storage_time * 1000)
                  .toLocaleString()
                  .replaceAll("/", "-")
              }}
            </span>
          </p>
          <p>
            位置：
            <span>
              {{
                `【${goods.grid_position.shelf_name}】${
                  goods.grid_position.grid.position.y + 1
                }层 ${goods.grid_position.grid.position.x + 1}行 ${
                  goods.grid_position.grid.position.z + 1
                }列`
              }}
            </span>
          </p>
          <span
            class="validity"
            :style="{
              color:
                (new Date().getTime() / 1000 - goods.production_date) / 86400 >
                goods.shelflife
                  ? 'red'
                  : (new Date().getTime() / 1000 - goods.production_date) /
                      86400 >
                    goods.shelflife * 0.8
                  ? 'yellow'
                  : 'greenyellow',
            }"
          >
            {{
              goods.expiration_time > new Date().valueOf() / 1000
                ? (
                    (goods.expiration_time - new Date().valueOf() / 1000) /
                    86400
                  ).toFixed()
                : "已过期"
            }}
            / {{ goods.shelflife }}天
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ArrowDownOutlined } from "@ant-design/icons-vue";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default {
  name: "operationPanelInventory",
  components: {
    ArrowDownOutlined,
  },
  props: {
    storeId: {
      type: Number,
      default: null,
    },
  },
  setup() {
    // 获取路由
    const route = useRoute();

    const store = useStore();
    // 货架统计数据
    const shelfTotal = computed(() => store.state.shelf.shelfTotal);

    // 商品移动表单字段
    const goodsFormState = ref({
      // 商品ID
      goods_id: "",
      // 新仓库ID
      store_id: route.query.id,
      // 新货架ID
      shelf_id: "",
      // 新货架格子ID
      shelf_grid_id: "",
    });

    // 未使用货架信息
    const emptyShelfOptions = computed(
      () => store.getters["shelf/getEmptyShelfGridList"]
    );
    // 已使用货架信息
    const useShelfOptions = computed(
      () => store.getters["shelf/getUseShelfGridList"]
    );

    // 选中的原货架
    const oldShelfOptionsValue = ref(null);

    // 选中原货架位置后的回调事件
    const oldDisplayRender = ({ labels, selectedOptions }) => {
      if (selectedOptions.length > 0) {
        goodsFormState.value.goods_id = selectedOptions[1].goods_id;
      }
      return labels.join(" / ");
    };

    // 选中的新货架
    const newShelfOptionsValue = ref(null);

    // 选中新货架位置后的回调事件
    const newDisplayRender = ({ labels, selectedOptions }) => {
      if (selectedOptions.length > 0) {
        goodsFormState.value.shelf_id = selectedOptions[0].value;
        goodsFormState.value.shelf_grid_id = selectedOptions[1].value;
      }
      return labels.join(" / ");
    };

    // 移动商品
    const moveGoods = () => {
      store.dispatch("goods/moveGoods", {
        goodsId: goodsFormState.value.goods_id,
        storeId: goodsFormState.value.store_id,
        shelfId: goodsFormState.value.shelf_id,
        shelfGridId: goodsFormState.value.shelf_grid_id,
      });

      // 清空表单
      oldShelfOptionsValue.value = null;
      newShelfOptionsValue.value = null;
    };

    // 临期商品列表
    const expireGoodsList = computed(() => store.state.goods.expireGoodsList);

    return {
      shelfTotal,
      goodsFormState,
      emptyShelfOptions,
      useShelfOptions,
      oldShelfOptionsValue,
      oldDisplayRender,
      newShelfOptionsValue,
      newDisplayRender,
      moveGoods,
      expireGoodsList,
    };
  },
};
</script>

<style scoped lang="less">
:deep(.ant-input),
:deep(.ant-cascader-picker) {
  // 设置 input 的圆角
  border-radius: 15px;
  background-color: #1f1f1f;
  &:focus {
    // 设置 input 的蓝色边框的圆角
    border-radius: 15px;
    .ant-cascader-input {
      // 设置 input 的蓝色边框的圆角
      border-radius: 15px;
    }
  }
}
.operationPanel-inventory {
  height: 100%;
  .operationPanel-overview,
  .operationPanel-logistics,
  .operationPanel-replenishment {
    margin-bottom: 10px;
    h3 {
      text-align: left;
      font-weight: 700;
      font-size: 15px;
    }
  }
  .operationPanel-overview {
    .operationPanel-overview-content {
      height: 120px;
      .operationPanel-overview-overview {
        > div {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        span {
          display: block;
          width: 100%;
          color: white;
          font-size: 16px;
          padding-top: 4px;
          padding-bottom: 4px;
          margin-top: 20px;
          &:nth-child(1) {
            margin-top: 0;
          }
        }
      }
      .operationPanel-overview-usage {
        position: relative;
        .operationPanel-overview-usage-progress {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .operationPanel-overview-usage-inside {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          height: 70px;
          width: 70px;
          border-radius: 50%;
          background-color: #393944;
          padding-top: 10px;

          div {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          span {
            width: 100%;
            display: block;
            font-size: 14px;
            margin-bottom: 6px;
            &.number {
              font-size: 18px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
  .operationPanel-logistics {
    .operationPanel-logistics-down {
      display: block;
      height: 30px;
      line-height: 30px;
      background-color: #393944;
      border-radius: 15px;
      margin-top: 10px;
      margin-bottom: 10px;
      // 鼠标形状设置为手指
      cursor: Pointer;
    }
  }
  .operationPanel-replenishment {
    height: 100%;
    .operationPanel-replenishment-content {
      height: calc(100% - 360px);
      overflow: auto;
      border-radius: 10px;
      .operationPanel-replenishment-item {
        position: relative;
        width: 100%;
        background-color: #393944;
        border-radius: 10px;
        padding: 10px;
        margin-bottom: 10px;

        p {
          text-align: left;
          margin-bottom: 0;
          opacity: 0.9;
        }
        .validity {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          font-size: 2rem;
          //top: 10px;
          //right: 10px;
          //font-size: 1rem;
          opacity: 0.4;
          font-weight: 700;
          pointer-events: none;
        }
        &:hover {
          .validity {
            opacity: 0.8;
            text-shadow: 0 0 4px #fff;
          }
        }
      }
    }
  }
}
</style>
