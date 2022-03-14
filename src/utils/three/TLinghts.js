// 设置光源
import { AmbientLight, PointLight, SpotLight } from "three";

export const lightsList = [];

// 环境光(颜色,强度,范围,衰减)
const ambientLight = new AmbientLight(0xffffff, 1.2);
// 点光源
export const pointLight = new PointLight(0xffffff, 1, 10000, 0.1);
// 设置点光源位置
pointLight.position.set(2000, 3000, -1000);

// 点光源
export const pointLight2 = new PointLight(0xffffff, 1, 8000, 0.1);
// 设置点光源位置
pointLight2.position.set(0, 2000, -3000);

// 聚光灯(颜色,强度,距离,散射角度,半影衰减,距离衰减)
export const spotLight = new SpotLight(
  0xffffff,
  1,
  2000,
  (Math.PI / 180) * 45,
  0,
  0
);
// 设置聚光灯位置
spotLight.position.set(0, 5000, -3000);
// 是否产生阴影
spotLight.castShadow = true;

lightsList.push(ambientLight, pointLight, pointLight2);
