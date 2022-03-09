/* eslint-disable prettier/prettier */
<template>
  <div class="home">
    <!--    <router-link to="/store">进入</router-link>-->
    <!-- <div id="main"></div> -->
    <div class="header">云仓</div>
    <div class="home_left">
      <ul>
        <store-tag
          v-for="i in 3"
          :key="i"
          :id="i"
          :storeTotal="100 * i"
          :useGoods="50 + i"
        />
        <!-- <li>
          <div><img src="../../assets/image/02.jpg" alt="" /></div>
        </li>
        <li>
          <div><img src="../../assets/image/02.jpg" alt="" /></div>
        </li> -->
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
            <img src="../../assets/image/01.jpg" alt="" />
          </div>
        </li>
        <div class="context">
          <TextTag></TextTag>
        </div>
        <li>
          <div class="home_right_status">
            <!-- 标题 -->
            <div class="home_right_status_p">
              <i><img src="../../assets/image/run.png" alt="" /></i>
              运行状态
            </div>
            <!-- 背景 -->
            <div class="home_right_status_img">
              <img src="../../assets/image/03.jpg" alt="" />
            </div>
            <!-- echarts -->
            <div></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import StoreTag from "@/views/home/components/storeTag";
import TextTag from "@/views/home/components/textScrolling";
export default {
  components: { StoreTag, TextTag },
  setup() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.home {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../../src/assets/image/bg.jpg);
  background-size: 100% 100%;
  overflow: hidden;
}

.header {
  width: 100%;
  height: 60px;
  line-height: 68px;
  text-align: center;
  color: #fff;
  font-size: 28px;
}

.home_left {
  position: absolute;
  top: 11%;
  left: 5%;
}
.home_left li {
  padding: 20px 0;
}
.home_right {
  position: absolute;
  top: 13%;
  right: 5%;
}
.home_right li {
  padding: 5px 0 68px 0;
}

/*// 图片的处理*/
.home img {
  border-radius: 7%;
}

.home_right .home_right_warn {
  position: relative;
}
.home_right .home_right_warn > span {
  position: absolute;
  top: 10%;
  left: 35%;
  width: 20px;
  height: 18px;
}
.home_right .home_right_warn span img {
  width: 100%;
  height: 100%;
}
.home_right .home_right_warn .warn_tt {
  position: absolute;
  top: 10%;
  left: 44%;
  color: #00ffff;
}
.context {
  position: absolute;
  top: 9%;
  left: 7%;
}

.context li {
  padding: 5px 0;
  color: #fff;
  font-size: 14px;
  line-height: 16px;
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
}
.home_right_status_p i {
  display: inline-block;
  width: 21px;
  height: 25px;
  margin: 0 0 0 -10px;
}
.home_right_status_p i img {
  width: 100%;
  margin: 3px 0 0 0px;
}
</style>
