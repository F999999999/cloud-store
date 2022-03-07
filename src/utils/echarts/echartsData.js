export default function echartsData() {
  return {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    color: ["#282f45", "#07e9fe"],
    series: [
      {
        name: "XX仓库的使用量",
        type: "pie",
        center: ["50%", "50%"], // 饼图的圆心坐标
        radius: ["28%", "35%"],
        //是否启用防止标签重叠策略
        avoidLabelOverlap: false,
        // //取消悬浮的放大效果
        // hoverAnimation: false,
        label: {
          //  饼图图形上的文本标签
          // normal 是图形在默认状态下的样式
          show: true,
          position: "center",
          fontWeight: "bold",
          formatter: " {a|{d}%}", // {b}:数据名； {c}：数据值； {d}：百分比，可以自定义显示内容，
          rich: {
            a: {
              show: true,
              color: "#03a9f4",
              padding: [10, 0, 0, 0],
              fontSize: 18,
            },
          },
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "18",
            fontWeight: "bold",
          },
        },
        data: [
          {
            value: 40,
            name: "未使用",
          },
          {
            value: 60,
            name: "已使用",
          },
        ],
      },
    ],
  };
}
