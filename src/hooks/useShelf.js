// 货架模型间距
import { ShelfMobile } from "@/utils/three/loadModel/shelfMobile";

const shelfSpacing = { x: 240 + 260, y: 466, z: -1000 };

const useShelfModel = async ({ shelf, groupScale = 100 }) => {
  let newGroup = null;

  await ShelfMobile.then((group) => {
    // 复制模型
    newGroup = group.scene.children[0].clone();
    // 遍历每个位置
    newGroup.children.forEach((child, i) => {
      // 给货架的每个位置都添加自定义属性
      newGroup.children[i].data = {
        id: Number(child.name.slice(-3)),
        shelf_id: shelf.id,
      };
      // 让货架每个位置的材质都变成独立的
      newGroup.children[i].material = child.material.clone();
    });
    // 设置名称
    newGroup.name = "shelf";
    // 保存货架数据
    newGroup.data = shelf;
    // 设置模型的位置
    newGroup.position.set(
      shelf.position.x * shelfSpacing.x,
      shelf.position.y * shelfSpacing.y,
      shelf.position.z * shelfSpacing.z
    );
    // 设置缩放比例
    newGroup.scale.set(
      shelf?.scale?.x ? shelf.scale.x * groupScale : groupScale,
      shelf?.scale?.y ? shelf.scale.y * groupScale : groupScale,
      shelf?.scale?.z ? shelf.scale.z * groupScale : groupScale
    );
  });

  // 返回模型
  return newGroup;
};

export { shelfSpacing, useShelfModel };