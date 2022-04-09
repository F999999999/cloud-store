import { ContainerMobile } from "@/utils/three/loadModel/containerMobile";
import { shelfLocation } from "@/utils/modelLocation/shelfModelLocation";
import { shelfSpacing } from "@/hooks/useShelf";
import { computed } from "vue";
import store from "@/store";
import { ThreeJS } from "@/hooks/useTEngine";

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

// 更新单个货物模型位置
const updateOneGoodsModelPosition = (mesh) => {
  // 货架列表数据
  const shelfList = computed(() => store.state.shelf.shelfList);
  // 查找货架
  const shelf = shelfList.value.find(
    (shelf) => shelf.id === mesh.data.shelf_id
  );
  // 设置货物的位置
  mesh.position.set(
    shelf.position.x * shelfSpacing.x +
      shelfLocation[mesh.data.shelf_grid_id - 1].x,
    shelf.position.y * shelfSpacing.y +
      shelfLocation[mesh.data.shelf_grid_id - 1].y,
    shelf.position.z * shelfSpacing.z +
      shelfLocation[mesh.data.shelf_grid_id - 1].z
  );
};

// 更新货物模型位置
const updateAllGoodsModelPosition = (scene) => {
  scene.children.forEach((item) => {
    if (item.type === "Mesh" && item.name === "goods") {
      // 更新货物位置
      updateOneGoodsModelPosition(item);
    }
  });
};

// 判断货物是否移动
const isShelfMove = (oldGoodsMesh, newGoodsMesh, shelfMesh) => {
  if (
    shelfMesh.data.id === newGoodsMesh.data.shelf_grid_id &&
    shelfMesh.data.shelf_id === newGoodsMesh.data.shelf_id
  ) {
    // 货物位置还原
    updateOneGoodsModelPosition(oldGoodsMesh);
    return false;
  } else {
    return true;
  }
};

// 判断货物是否重叠
const isShelfOverlap = (goodsMesh, shelfBaseMesh) => {
  // 货物列表数据
  const goodsList = computed(() => store.state.goods.goodsList);
  if (
    goodsList.value.filter(
      (item) =>
        item.shelf_id === shelfBaseMesh.data.shelf_id &&
        item.shelf_grid_id === shelfBaseMesh.data.id
    ).length >= 1
  ) {
    // 物体闪烁
    twinkleMesh(goodsMesh, 0xff0000, "color").then((mesh) => {
      // 货物位置还原
      updateOneGoodsModelPosition(mesh);
    });
    return true;
  } else {
    return false;
  }
};

// 物体闪烁
const twinkleMesh = (mesh, value, attribute = "emissive") => {
  const rawValue = mesh.material[attribute].clone();
  return new Promise((resolve) => {
    mesh.material[attribute].set(value);
    setTimeout(() => {
      mesh.material[attribute].set(rawValue);
      setTimeout(() => {
        mesh.material[attribute].set(value);
        setTimeout(() => {
          mesh.material[attribute].set(rawValue);
          resolve(mesh);
        }, 200);
      }, 200);
    }, 200);
  });
};

// 设置货物属性
const setGoodsAttribute = (goodsIdList, value, attribute = "emissive") => {
  const goodsMesh = [];
  // 递归遍历 children 给选中的商品添加或者还原自发光效果
  ThreeJS.scene.children.forEach((obj) => {
    // 判断是否是货物
    if (obj.type === "Mesh" && obj.name === "goods") {
      // 判断传入的货物列表是否是数组
      if (Array.isArray(goodsIdList)) {
        // 判断该货物ID是否在传入的列表中
        if (goodsIdList.find((goodsId) => goodsId === obj.data.id)) {
          obj.material[attribute].set(value);
          goodsMesh.push(obj);
        }
      } else if (obj.data.id === goodsIdList) {
        obj.material[attribute].set(value);
        goodsMesh.push(obj);
      }
    }
  });
  return goodsMesh;
};

export {
  useGoodsModel,
  updateOneGoodsModelPosition,
  updateAllGoodsModelPosition,
  isShelfMove,
  isShelfOverlap,
  twinkleMesh,
  setGoodsAttribute,
};
