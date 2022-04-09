<template>
  <div class="home">
    <div class="header">云仓 - 智能仓储</div>
    <div class="home_left">
      <ul>
        <!-- 动态环形图 -->
        <store-tag
          v-for="item in getStoreListDate"
          :key="item.store_id"
          :id="item.store_id"
          :storeTotal="item.total_grid"
          :useGoods="item.use_grid"
          :store_name="item.store_name"
        />
      </ul>
    </div>
    <div class="home_right">
      <ul>
        <li>
          <div class="home_right_warn">
            <span>
              <img src="@/assets/image/run.png" alt="" />
            </span>
            <p class="warn_tt">仓库日志</p>
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
              <img src="~@/assets/image/warn.png" alt="" />
            </span>
            <p class="status_tt">商品保质期</p>
            <!-- 背景 -->
            <div class="home_right_status_img">
              <img src="~@/assets/image/box3_bg.png" alt="" />
              <div class="home_right_status_img_context">
                <!-- 柱状图组件 -->
                <ul>
                  <li
                    v-for="item in getGoodsLogDateTimeDate"
                    :key="item.store_id"
                  >
                    <p class="home_right_status_img_context_title">
                      <i></i>{{ item.store_name }}
                    </p>
                    <histogram
                      :histogramId="'histogram' + item.store_id"
                      :expired="item.expired"
                      :normal="item.normal"
                      :will_expire="item.will_expire"
                    />
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
import { ref } from "vue";
// import { useStore } from "vuex";
import {
  getGoodsLogDateTimeApi,
  getStoreListApi,
  getStoreListDateApi,
  getStoreShelfDateApi,
} from "@/api/store";
export default {
  components: { StoreTag, TextTag, histogram },
  setup() {
    const getStoreListDate = ref([]);
    const getStoreShelfDate = ref([]);
    const getGoodsLogDate = ref("");
    const getGoodsLogDateTimeDate = ref([]);
    const storeList = ref([]);
    // const store = useStore();
    //获取仓库使用数据信息
    getStoreListDateApi().then((res) => {
      console.log(res);
      if (res.status === 200) {
        getStoreListDate.value = res.data.list;
      }
    });
    //获取仓库运行状态
    getStoreShelfDateApi().then((res) => {
      console.log(res);
      if (res.status === 200) {
        getStoreShelfDate.value = res.data.list;
      }
    });
    //获取仓库商品统计
    getGoodsLogDateTimeApi().then((res) => {
      if (res.status == 200) {
        getGoodsLogDateTimeDate.value = res.data.list;
        console.log(getGoodsLogDateTimeDate.value);
      }
    });
    // 获取仓库列表
    // store.dispatch("store/getStoreList");
    getStoreListApi().then((res) => {
      console.log(res);
      if (res.status == 200) {
        storeList.value = res.data;
      }
    });
    // const storeList = computed(() => store.state.store.storeList);

    return {
      getStoreListDate,
      getStoreShelfDate,
      getGoodsLogDate,
      getGoodsLogDateTimeDate,
      storeList,
    };
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
  height: 7%;
  line-height: 4rem;
  text-align: center;
  color: #fff;
  font-size: 1.4rem;
  span {
    float: right;
    font-size: 1.4rem;
  }
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
      width: 1rem;
      height: 1rem;
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
      font-size: 1rem;
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
  top: 3.5rem;
  left: 8%;
  width: 84%;
  height: 60%;
}

// 运行状态
.home_right_status {
  position: relative;
  width: 100%;
  > span {
    position: absolute;
    top: 4%;
    left: 35%;
    width: 1rem;
    height: 1rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .status_tt {
    position: absolute;
    top: 4%;
    left: 44%;
    color: #00ffff;
    font-size: 1rem;
  }
}

.home_right_status_img_context {
  position: absolute;
  top: 16%;
  left: 2rem;
  width: 100%;
  li {
    height: 30%;
  }
}

.home_right_status_img_context_title {
  //margin:0 0 0 -70%
  text-align: left;
  color: #fff;
  ::before {
    content: " ";
    display: inline-block;
    width: 0.5rem;
    height: 0.3rem;
    border-radius: 50%;
  }
}

.home_bottom {
  width: 50rem;
  height: 5rem;
  //background-color:red;
  position: absolute;
  left: 50%;
  bottom: 3%;
  transform: translate(-50%, -50%);
  color: #fff;
  li {
    float: left;
    margin: 0 10%;
    text-align: center;
    padding-left: 1rem;
  }
  .button {
    position: relative;
    width: 6rem;
    height: 6rem;
    ::before {
      content: "";
      width: 6rem;
      height: 6rem;
      background-image: url("~@/assets/image/circle.png");
      background-size: 6rem;
      position: absolute;
      top: 0;
      left: 0;
      transform: var(--transform);
    }
    a {
      display: inline-block;
      padding: 50% 0;
      margin-left: -1rem;
      color: #fff;
    }
  }
}
</style>
