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
    expired: {
      type: Number,
      default: 0,
    },
    normal: {
      type: Number,
      default: 0,
    },
    will_expire: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    onMounted(() => {
      const myChart = echarts.init(
        document.getElementById("histogram" + props.histogramId)
      );
      const passengerOccupancy = {
        xData: ["未过期", "临期", "已过期"],
        yData: [props.normal, props.will_expire, props.expired],
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
                fontSize: 13,
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
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function (params) {
                  var colorList = [
                    ["#1c65ef", "#06d9fb"],
                    ["#ffba5d", "#fdee55"],
                    ["#c1000f", "#5e000c"],
                  ];
                  var index = params.dataIndex;
                  if (params.dataIndex >= colorList.length) {
                    index = params.dataIndex - colorList.length;
                  }
                  return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    {
                      offset: 0,
                      color: colorList[index][0],
                    },
                    {
                      offset: 1,
                      color: colorList[index][1],
                    },
                  ]);
                },
              },
              // normal: {
              //   barBorderRadius: 1,
              //   //渐变的颜色
              //   color: new echarts.graphic.LinearGradient(0, 0, 0.9, 0, [
              //     {
              //       offset: 0,
              //       color: "#1c65ef",
              //     },
              //     {
              //       offset: 1,
              //       color: "#06d9fb",
              //     },
              //   ]),
              // },
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
  height: 6.2rem;
}
</style>
