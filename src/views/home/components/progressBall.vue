<template>
  <div :id="ballId" class="ball"></div>
</template>

<script>
// 去除公共样式
import "@/assets/reset.css";
// 基于准备好的dom，初始化echarts实例
import * as echarts from "echarts";
import { onMounted } from "vue";

export default {
  name: "progressBall",
  props: {
    ballId: {
      type: String,
      default: () => "ball" + new Date().valueOf(),
    },
    storeTotal: {
      type: Number,
      default: 0,
    },
    useGoods: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    onMounted(() => {
      // const roseCharts = document.getElementsByClassName("ball");
      const myChart = echarts.init(document.getElementById(props.ballId));
      let angle = 0; //角度，用来做简单的动画效果的
      const value = ((props.useGoods / props.storeTotal) * 100).toFixed(2);
      const option = {
        //backgroundColor:"#061740",
        title: [
          {
            text: "{a|" + value + "}{c|%}",
            x: "center",
            y: "42%",
            textStyle: {
              // 圈里面字的匹配
              rich: {
                a: {
                  fontSize: 14,
                  color: "#29EEF3",
                },
                c: {
                  fontSize: 14,
                  color: "#29EEF3",
                },
              },
            },
          },
        ],

        series: [
          {
            name: "ring5",
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              return {
                type: "arc",
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6,
                  startAngle: ((0 + angle) * Math.PI) / 180,
                  endAngle: ((90 + angle) * Math.PI) / 180,
                },
                style: {
                  stroke: "#0CD3DB",
                  fill: "transparent",
                  lineWidth: 1.5,
                },
                silent: true,
              };
            },
            data: [0],
          },
          {
            name: "ring5",
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              return {
                type: "arc",
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6,
                  startAngle: ((180 + angle) * Math.PI) / 180,
                  endAngle: ((270 + angle) * Math.PI) / 180,
                },
                style: {
                  shadowColor: "#4FADFD",
                  shadowBlur: 10,
                  stroke: "#0CD3DB",
                  fill: "transparent",
                  lineWidth: 1.5,
                },
                silent: true,
              };
            },
            data: [0],
          },
          {
            name: "ring5",
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              return {
                type: "arc",
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65,
                  startAngle: ((270 + -angle) * Math.PI) / 180,
                  endAngle: ((40 + -angle) * Math.PI) / 180,
                },
                style: {
                  shadowColor: "#4FADFD",
                  shadowBlur: 10,
                  stroke: "#0CD3DB",
                  fill: "transparent",
                  lineWidth: 1.5,
                },
                silent: true,
              };
            },
            data: [0],
          },
          {
            name: "ring5",
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              return {
                type: "arc",
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65,
                  startAngle: ((90 + -angle) * Math.PI) / 180,
                  endAngle: ((220 + -angle) * Math.PI) / 180,
                },
                style: {
                  shadowColor: "#4FADFD",
                  shadowBlur: 10,
                  stroke: "#0CD3DB",
                  fill: "transparent",
                  lineWidth: 1.5,
                },
                silent: true,
              };
            },
            data: [0],
          },
          {
            name: "ring5",
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              let x0 = api.getWidth() / 2;
              let y0 = api.getHeight() / 2;
              let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65;
              let point = getCirlPoint(x0, y0, r, 90 + -angle);
              return {
                type: "circle",
                shape: {
                  cx: point.x,
                  cy: point.y,
                  r: 4,
                },
                style: {
                  shadowColor: "#08eeff",
                  shadowBlur: 10,
                  stroke: "#0CD3DB", //粉
                  fill: "#0CD3DB",
                },
                silent: true,
              };
            },
            data: [0],
          },
          {
            name: "ring5", //绿点
            type: "custom",
            coordinateSystem: "none",
            renderItem: function (params, api) {
              let x0 = api.getWidth() / 2;
              let y0 = api.getHeight() / 2;
              let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65;
              let point = getCirlPoint(x0, y0, r, 270 + -angle);
              return {
                type: "circle",
                shape: {
                  cx: point.x,
                  cy: point.y,
                  r: 4,
                },
                style: {
                  shadowColor: "#4FADFD",
                  shadowBlur: 10,
                  stroke: "#0CD3DB", //绿
                  fill: "#0CD3DB",
                },
                silent: true,
              };
            },
            data: [0],
          },
          {
            name: "吃猪肉频率",
            type: "pie",
            radius: ["35%", "45%"],
            silent: true,
            clockwise: true,
            startAngle: 90,
            z: 0,
            zlevel: 0,
            label: {
              normal: {
                position: "center",
              },
            },
            data: [
              {
                value: value,
                name: "",
                itemStyle: {
                  normal: {
                    shadowColor: "#4FADFD",
                    shadowBlur: 10,
                    color: {
                      // 完成的圆环的颜色
                      colorStops: [
                        {
                          offset: 0,
                          color: "#00feff", // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#00feff", // 100% 处的颜色
                        },
                      ],
                    },
                  },
                },
              },
              {
                value: 100 - value,
                name: "",
                label: {
                  normal: {
                    show: false,
                  },
                },
                itemStyle: {
                  normal: {
                    color: "#4FADFD33",
                  },
                },
              },
            ],
          },
        ],
      };
      // }

      //获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
      function getCirlPoint(x0, y0, r, angle) {
        let x1 = x0 + r * Math.cos((angle * Math.PI) / 180);
        let y1 = y0 + r * Math.sin((angle * Math.PI) / 180);
        return {
          x: x1,
          y: y1,
        };
      }

      function draw() {
        angle = angle + 5;
        myChart.setOption(option, true);
        //window.requestAnimationFrame(draw);
      }

      setInterval(function () {
        //用setInterval做动画感觉有问题
        draw();
      }, 100);
    });
  },
};
</script>

<style lang="less" scoped>
.ball {
  position: absolute;
  top: 22%;
  right: 4%;
  width: 10rem;
  height: 10rem;
}
</style>
