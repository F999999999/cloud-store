<template>
  <div class="home">
    <!--    <router-link to="/store">进入</router-link>-->

    <div id="main"></div>
  </div>
</template>

<script setup>
// 基于准备好的dom，初始化echarts实例
import * as echarts from "echarts";
import { onMounted } from "vue";
import echartsData from "../../utils/echarts/echartsData";
onMounted(() => {
  const myChart = echarts.init(document.getElementById("main"));
  // const canvas = document.getElementsByTagName("canvas");
  // // canvas.mouseover();
  // console.log(canvas);
  // console.log(echartsData);
  // 绘制图表
  if (echartsData) {
    myChart.setOption(echartsData());
  }
});
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  // background-image: "../../../src/assets/image/bg.png";
  background-image: url(../../../src/assets/image/bg.png);
  background-size: 100% 100%;
}
#main {
  margin: 100px auto;
  width: 200px;
  height: 200px;
  background: #093347;
}
</style>
