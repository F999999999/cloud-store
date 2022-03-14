import { ContainerMobile } from "@/utils/three/loadModel/containerMobile";
import { shelfLocation } from "@/utils/modelLocation/shelfModelLocation";
import { shelfSpacing } from "@/hooks/useShelf";

const useGoodsModel = async ({ shelfList, goods, groupScale = 100 }) => {
  let newGroup = null;

  await ContainerMobile.then((group) => {
    // 复制模型
    newGroup = group.scene.children[0].clone();
    newGroup.material = group.scene.children[0].material.clone();
    // 设置名称
    newGroup.name = "goods";
    // 保存货物数据
    newGroup.data = goods;
    // 查找货架
    const shelf = shelfList.find((shelf) => shelf.id === goods.shelf_id);
    // 设置货物的位置
    newGroup.position.set(
      shelf.position.x * shelfSpacing.x +
        shelfLocation[goods.shelf_grid_id - 1].x,
      shelf.position.y * shelfSpacing.y +
        shelfLocation[goods.shelf_grid_id - 1].y,
      shelf.position.z * shelfSpacing.z +
        shelfLocation[goods.shelf_grid_id - 1].z
    );

    // 设置缩放比例
    newGroup.scale.set(
      goods?.scale?.x ? goods.scale.x * groupScale : groupScale,
      goods?.scale?.y ? goods.scale.y * groupScale : groupScale,
      goods?.scale?.z ? goods.scale.z * groupScale : groupScale
    );
  });

  // 返回模型
  return newGroup;
};

// 更新货物模型位置
const updateGoodsModelPosition = (scene, shelfList) => {
  scene.children.forEach((item) => {
    if (item.type === "Mesh" && item.name === "goods") {
      // 查找货架
      const shelf = shelfList.find((shelf) => shelf.id === item.data.shelf_id);
      // 设置货物的位置
      item.position.set(
        shelf.position.x * shelfSpacing.x +
          shelfLocation[item.data.shelf_grid_id - 1].x,
        shelf.position.y * shelfSpacing.y +
          shelfLocation[item.data.shelf_grid_id - 1].y,
        shelf.position.z * shelfSpacing.z +
          shelfLocation[item.data.shelf_grid_id - 1].z
      );
    }
  });
};

export { useGoodsModel, updateGoodsModelPosition };
