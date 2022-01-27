import { BoxBufferGeometry, Mesh, MeshStandardMaterial } from "three";

export const basicObjectList = [];

// 地面
const stage = new Mesh(
  // 几何对象
  new BoxBufferGeometry(10000, 10, 10000),
  // 网格标准材质
  new MeshStandardMaterial({ color: 0x00dddd, metalness: 1 })
);
stage.name = "stage";
// 地面位置
stage.position.y = -5;
// 是否接收阴影
stage.receiveShadow = true;

basicObjectList.push(stage);
