<template>
  <div :id="'histogram' + histogramId" class="histogram"></div>
</template>

<script>
// 基于准备好的dom，初始化echarts实例
import * as echarts from "echarts";
import { onMounted } from "vue";
export default {
  name: "histogram",
  props: {
    histogramId: {
      type: String,
      default: "histogram" + new Date().valueOf(),
    },
  },
  setup(props) {
    onMounted(() => {
      const myChart = echarts.init(
        document.getElementById("histogram" + props.histogramId)
      );
      const passengerOccupancy = {
        xData: ["运行中", "已故障", "已停机"],
        yData: [8, 2, 1],
      };
      const option = {
        grid: {
          left: "-10px",
          right: "0%",
          bottom: "1%",
          top: "5%",
          containLabel: true,
        },
        xAxis: {
          show: false,
          type: "value",
        },
        yAxis: [
          {
            type: "category",
            inverse: true,
            axisLabel: {
              align: "left",
              margin: 50,
              show: true,
              textStyle: {
                color: "#60ACF7",
                fontSize: 14,
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            data: passengerOccupancy.xData,
          },
          {
            type: "category",
            inverse: true,
            axisTick: "none",
            axisLine: "none",
            show: true,
            axisLabel: {
              margin: 10,
              textStyle: {
                color: "#60ACF7",
                fontSize: 14,
              },
              formatter: function (value) {
                return "{a|" + value.toLocaleString() + "}{b|}";
              },
              rich: {
                a: {
                  fontSize: 14,
                  color: "#60ACF7",
                },
                b: {
                  fontSize: 14,
                  color: "#60ACF7",
                },
              },
            },
            data: passengerOccupancy.yData,
          },
        ],
        series: [
          {
            name: "数值",
            type: "bar",
            zlevel: 1,
            itemStyle: {
              normal: {
                barBorderRadius: 1,
                //渐变的颜色
                color: new echarts.graphic.LinearGradient(0, 0, 0.9, 0, [
                  {
                    offset: 0,
                    color: "#1c65ef",
                  },
                  {
                    offset: 1,
                    color: "#06d9fb",
                  },
                ]),
              },
            },
            barWidth: 5,
            data: passengerOccupancy.yData,
          },
        ],
      };
      myChart.setOption(option);
    });
  },
};
</script>

<style scoped>
.histogram {
  width: 80%;
  height: 100px;
}
</style>
