<template>
  <div class="home">
    <div class="header">云仓</div>
    <div class="home_left">
      <ul>
        <!-- 动态环形图 -->
        <store-tag
          v-for="i in 3"
          :key="i"
          :id="i"
          :storeTotal="100 * i"
          :useGoods="50 + i"
        />
      </ul>
    </div>
    <div class="home_right">
      <ul>
        <li>
          <div class="home_right_warn">
            <span>
              <img src="@/assets/image/warn.png" alt="" />
            </span>
            <p class="warn_tt">故障信息</p>
            <img src="~@/assets/image/box1_bg.png" alt="" />
            <div class="context">
              <!--信息滚动-->
              <TextTag></TextTag>
            </div>
          </div>
        </li>
        <li>
          <div class="home_right_status">
            <!-- 标题 -->
            <span>
              <img src="~@/assets/image/run.png" alt="" />
            </span>
            <p class="status_tt">运行状态</p>
            <!-- 背景 -->
            <div class="home_right_status_img">
              <img src="~@/assets/image/box3_bg.png" alt="" />
              <div class="home_right_status_img_context">
                <!-- 柱状图组件 -->
                <ul>
                  <li v-for="i in 3" :key="i">
                    <p class="home_right_status_img_context_title">
                      <i></i>仓库A
                    </p>
                    <histogram :histogramId="'histogram' + i" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="home_bottom">
      <ul>
        <li
          class="button button_1"
          :style="{ '--transform': 'rotate(' + Math.random() * 360 + 'deg)' }"
          v-for="store in storeList"
          :key="store.id"
        >
          <router-link :to="'/store?id=' + store.id">
            {{ store.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import StoreTag from "@/views/home/components/storeTag";
import TextTag from "@/views/home/components/textScrolling";
import histogram from "@/views/home/components/histogram";
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  components: { StoreTag, TextTag, histogram },
  setup() {
    const store = useStore();
    // 获取仓库列表
    store.dispatch("store/getStoreList");

    const storeList = computed(() => store.state.store.storeList);

    return { storeList };
  },
};
</script>

<style lang="less" scoped>
.home {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url("~@/assets/image/bg.jpg");
  background-size: 100% 100%;
  overflow: hidden;
}

.header {
  position: absolute;
  width: 100%;
  height: 60px;
  line-height: 68px;
  text-align: center;
  color: #fff;
  font-size: 28px;
}

.home_left {
  float: left;
  margin-top: 8%;
  margin-left: 5%;
  width: 20%;
  height: 80%;
  ul {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center; /* 垂直居中 */
    flex-direction: column;
    justify-content: space-between; /* 子元素在横轴上两端对齐 */
  }
}
.home_right {
  float: right;
  margin-top: 8%;
  margin-right: 5%;
  width: 20%;
  height: 80%;
  ul {
    height: 100%;
    display: flex;
    align-items: center; /* 垂直居中 */
    flex-direction: column;
    justify-content: space-between; /* 子元素在横轴上两端对齐 */

    li {
      width: 100%;
    }
  }

  .home_right_warn {
    position: relative;
    width: 100%;
    > span {
      position: absolute;
      top: 10%;
      left: 35%;
      width: 20px;
      height: 18px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .warn_tt {
      position: absolute;
      top: 10%;
      left: 44%;
      color: #00ffff;
    }
  }
}

// 图片的处理
.home img {
  border-radius: 7%;
  width: 100%;
}
.context {
  position: absolute;
  top: 60px;
  left: 8%;
  width: 84%;
  height: 60%;
  li {
    padding: 5px 0;
    color: #fff;
    font-size: 14px;
    line-height: 16px;
  }
}

// 运行状态
.home_right_status {
  position: relative;
  width: 100%;
  > span {
    position: absolute;
    top: 3%;
    left: 35%;
    width: 20px;
    height: 18px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .status_tt {
    position: absolute;
    top: 3%;
    left: 44%;
    color: #00ffff;
  }
}

.home_right_status_img_context {
  position: absolute;
  top: 16%;
  left: 30px;
  width: 100%;
}

.home_right_status_img_context_title {
  //margin:0 0 0 -70%
  text-align: left;
  color: #fff;
  ::before {
    content: " ";
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    color: #00fbff;
    z-index: 1;
  }
}

.home_bottom {
  width: 800px;
  height: 80px;
  //background-color:red;
  position: absolute;
  left: 50%;
  bottom: 6%;
  transform: translate(-50%, -50%);
  color: #fff;
  li {
    float: left;
    margin: 0 10%;
    text-align: center;
    padding-left: 10px;
  }
  .button {
    position: relative;
    width: 100px;
    height: 100px;
    ::before {
      content: "";
      width: 100px;
      height: 100px;
      background-image: url("~@/assets/image/circle.png");
      background-size: 100px 100px;
      position: absolute;
      top: 0;
      left: 0;
      transform: var(--transform);
    }
    a {
      display: inline-block;
      padding: 45% 0;
      margin-left: -10px;
      color: #fff;
    }
  }
}

// 运行状态
.home_right_status {
  position: relative;
}
.home_right_status_p {
  position: absolute;
  top: 10px;
  left: 38%;
  color: #00ffff;
  .home_right_status_p i {
    display: inline-block;
    width: 21px;
    height: 25px;
    margin: 0 0 0 -10px;
    img {
      width: 100%;
      margin: 3px 0 0 0;
    }
  }
}
</style>
