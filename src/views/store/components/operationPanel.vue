<template>
  <div class="operationPanel">
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
            <a-form-item label="商品名称:" name="name">
              <a-input v-model:value="formState.name" required />
            </a-form-item>
            <a-form-item label="商品重量:" name="weight">
              <a-input v-model:value="formState.weight" />
            </a-form-item>
            <a-form-item label="商品保质期:" name="shelflife">
              <a-input v-model:value="formState.shelflife" />
            </a-form-item>
            <a-form-item label="商品生产日期:" name="production_date">
              <a-date-picker v-model:value="formState.production_date">
                <template #renderExtraFooter>extra footer</template>
              </a-date-picker>
            </a-form-item>
            <a-form-item label="商品入库时间:" name="storage_time">
              <a-date-picker show-time v-model:value="formState.storage_time">
                <template #renderExtraFooter>extra footer</template>
              </a-date-picker>
            </a-form-item>
            <a-form-item label="货架ID:" name="shelf_id">
              <a-input v-model:value="formState.shelf_id" required />
            </a-form-item>
            <a-form-item label="货架格子ID:" name="shelf_grid_id">
              <a-input v-model:value="formState.shelf_grid_id" required />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" html-type="submit">添加商品</a-button>
            </a-form-item>
          </a-form>
        </div>
        <!--  出库  -->
        <div class="operationPanel-right-delivery" style="display: none">
          出库内容
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
export default {
  name: "operationPanel",
  components: { HomeOutlined, ArrowRightOutlined, ArrowUpOutlined },
  setup() {
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
    // 提交表单且数据验证成功后回调事件
    const onFinish = (values) => {
      console.log(values);
    };

    return {
      formState,
      onFinish,
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
  top: 95px;
  left: 25px;
  width: 335px;
  height: 730px;
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
          width: 239px;
        }
      }
    }
  }
}
</style>
