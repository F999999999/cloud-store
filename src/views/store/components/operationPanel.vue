<template>
  <div class="operationPanel">
    <a-row class="container">
      <a-col :span="4" class="operationPanel-left">
        <div class="operationPanel-left-item">
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
        <div class="operationPanel-right-inventory">
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
export default {
  name: "operationPanel",
  components: { HomeOutlined, ArrowRightOutlined, ArrowUpOutlined },
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
    }
  }
}
</style>
