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
        <div class="operationPanel-right-inventory" style="display: block">
          <div class="operationPanel-right-overview">
            <h3>货物总览</h3>
            <a-row class="operationPanel-right-overview-content">
              <a-col :span="8" class="operationPanel-right-overview-left">
                <span class="blue">XXXX</span>
                <span class="red">XXXX</span>
              </a-col>
              <a-col :span="8" class="operationPanel-right-overview-center">
                <a-progress
                  type="circle"
                  stroke-color="#3f85fe"
                  trailColor="#ff7b6a"
                  :percent="80"
                  :width="78"
                  :showInfo="false"
                />
                <div class="inside">
                  <span>XXX</span>
                  <span class="number">24.6</span>
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
        <!--  入库  -->
        <div class="operationPanel-right-storage" style="display: none">
          <a-form layout="vertical" :model="formState" @finish="onFinish">
            <a-form-item label="商品名称：" name="name">
              <a-input v-model:value="formState.name" required />
            </a-form-item>
            <a-form-item label="商品重量（单位：kg）：" name="weight">
              <a-input v-model:value="formState.weight" />
            </a-form-item>
            <a-form-item label="商品保质期（单位：天）：" name="shelflife">
              <a-input v-model:value="formState.shelflife" />
            </a-form-item>
            <a-form-item label="商品生产日期：" name="production_date">
              <a-date-picker v-model:value="formState.production_date">
                <template #renderExtraFooter>extra footer</template>
              </a-date-picker>
            </a-form-item>
            <a-form-item label="商品入库时间：" name="storage_time">
              <a-date-picker show-time v-model:value="formState.storage_time">
                <template #renderExtraFooter>extra footer</template>
              </a-date-picker>
            </a-form-item>
            <a-form-item label="货架ID：" name="shelf_id">
              <a-input v-model:value="formState.shelf_id" required />
            </a-form-item>
            <a-form-item label="货架格子ID：" name="shelf_grid_id">
              <a-input v-model:value="formState.shelf_grid_id" required />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" html-type="submit">添加商品</a-button>
            </a-form-item>
          </a-form>
        </div>
        <!--  出库  -->
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
                item.id === currentDeliveryIndex ? 'active' : '',
              ]"
              size="small"
              :title="`商品名称：${item.name}`"
              :style="{ width: '100%', marginTop: '5px' }"
              v-for="item in deliveryList"
              :key="item.id"
              @click="currentDeliveryIndex = item.id"
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
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  HomeOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons-vue";
import { ref } from "vue";
import {
  addGoodsApi,
  searchDeliveryNameApi,
  removeGoodsByIdApi,
} from "@/api/goods";
import { message } from "ant-design-vue";
import { useStore } from "vuex";
export default {
  name: "operationPanel",
  components: { HomeOutlined, ArrowRightOutlined, ArrowUpOutlined },
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
    const store = useStore();
    // 入库表单字段
    const formState = ref({
      // 商品名称
      name: "",
      // 商品重量
      weight: "",
      // 商品保质期
      shelflife: "",
      // 商品生产日期
      production_date: "",
      // 商品入库时间
      storage_time: "",
      // 货架ID
      shelf_id: "",
      // 货架格子ID
      shelf_grid_id: "",
    });
    // 搜索关键字
    const searchValue = ref("");
    // 搜索出的商品列表(商品出库)
    const deliveryList = ref(null);
    // 用于存储当前id和判断active的类名的加入
    const currentDeliveryIndex = ref(0);
    // 提交表单且数据验证成功后回调事件
    const onFinish = (values) => {
      // 将时间进行处理 处理为时间戳
      values.production_date = Math.floor(
        new Date(values.production_date).valueOf() / 1000
      );
      values.storage_time = Math.floor(
        new Date(values.storage_time).valueOf() / 1000
      );
      // console.log(values, "values2");
      // 商品入库
      addGoodsApi(values).then((data) => {
        console.log(data, "data");
        if (data.status === 200) {
          // 提示信息
          message.success(data.message);
          // 刷新商品列表
          store.dispatch("goods/getGoodsList");
          // 将表单内容清空
          formState.value = {};
        }
      });
    };
    // 点击搜索或按下回车键时的回调
    const onSearch = () => {
      console.log("or use this.value", searchValue.value);
      // 根据商品名称搜索商品列表
      searchDeliveryNameApi(searchValue.value).then((data) => {
        console.log(data, "data");
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
        id: currentDeliveryIndex.value,
        takeout_time: new Date().toLocaleString() / 1000,
      }).then((data) => {
        console.log(data, "data");
        if (data.status === 200) {
          // 提示信息
          message.success(data.message);
          // 清空搜索商品列表
          deliveryList.value = [];
        }
      });
    };

    return {
      formState,
      searchValue,
      onFinish,
      onSearch,
      deliveryList,
      currentDeliveryIndex,
      removeGoods,
    };
  },
};
// 实现tabs切换(排他思想)
window.onload = function () {
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
      padding: 20px 20px 0;
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
                width: 52px;
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
                top: 19px;
                left: 9px;
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
                  background-color: #ff7b6a;
                  margin-bottom: 10px;
                }
                &.blue {
                  background-color: #3f85fe;
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
      .operationPanel-right-storage {
        /deep/ .ant-input {
          padding: 4px;
          background-color: #d1d5ed;
        }
        /deep/ .ant-calendar-picker {
          width: 100%;
        }
        /deep/ .ant-select-selector {
          background-color: #d1d5ed;
        }
      }
      .operationPanel-right-delivery {
        .operationPanel-right-delivery-list {
          text-align: left;
          height: 600px;
          overflow-y: auto;
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
    }
  }
}
</style>
