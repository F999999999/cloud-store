import { ContainerMobile } from "@/utils/three/loadModel/containerMobile";
import { shelfLocation } from "@/utils/modelLocation/shelfModelLocation";
import { shelfSpacing } from "@/hooks/useShelf";
import { computed } from "vue";
import store from "@/store";

const useGoodsModel = async ({ shelfList, goods, groupScale = 100 }) => {
  shelfList = shelfList || computed(() => store.state.shelf.shelfList).value;
  // 加载模型
  const group = await ContainerMobile;
  // 复制模型
  const newGroup = group.scene.children[0].clone();
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
    shelf.position.z * shelfSpacing.z + shelfLocation[goods.shelf_grid_id - 1].z
  );

  // 设置缩放比例
  newGroup.scale.set(
    goods?.scale?.x ? goods.scale.x * groupScale : groupScale,
    goods?.scale?.y ? goods.scale.y * groupScale : groupScale,
    goods?.scale?.z ? goods.scale.z * groupScale : groupScale
  );
  // 返回模型
  return newGroup;
};

// 更新货物模型位置
const updateGoodsModelPosition = (scene) => {
  // 货架列表数据
  const shelfList = computed(() => store.state.shelf.shelfList);
  scene.children.forEach((item) => {
    if (item.type === "Mesh" && item.name === "goods") {
      // 查找货架
      const shelf = shelfList.value.find(
        (shelf) => shelf.id === item.data.shelf_id
      );
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

// 获取货物位置
const getGoodsPosition = (goodsId, shelfId, shelfGridId) => {
  // 货架列表数据
  const shelfList = computed(() => store.state.shelf.shelfList);
  // 查找货架
  const shelf = shelfList.value.find((shelf) => shelf.id === shelfId);
  // 设置货物的位置
  return {
    x: shelf.position.x * shelfSpacing.x + shelfLocation[shelfGridId - 1].x,
    y: shelf.position.y * shelfSpacing.y + shelfLocation[shelfGridId - 1].y,
    z: shelf.position.z * shelfSpacing.z + shelfLocation[shelfGridId - 1].z,
  };
};

export { useGoodsModel, updateGoodsModelPosition, getGoodsPosition };
