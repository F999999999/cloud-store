// 辅助工具
import {
  AxesHelper,
  GridHelper,
  PointLightHelper,
  SpotLightHelper,
} from "three";
import { pointLight, spotLight } from "@/utils/three/TLinghts";

export const helperList = [];

// 三维坐标系辅助
const axisHelper = new AxesHelper(500);

// 网格辅助
const gridHelper = new GridHelper(10000, 100, 0x999999, 0xcccccc);

// 灯光辅助(光源,大小,颜色)
// 点光源
const pointLightHelper = new PointLightHelper(
  pointLight,
  pointLight.distance,
  pointLight.color
);

// 聚光灯
const spotLightHelper = new SpotLightHelper(
  spotLight,
  spotLight.distance,
  spotLight.color
);

helperList.push(axisHelper, gridHelper, pointLightHelper, spotLightHelper);
