// 货架模型间距
import { ShelfMobile } from "@/utils/three/loadModel/shelfMobile";
import store from "@/store";
import { computed } from "vue";
import { shelfLocation } from "@/utils/modelLocation/shelfModelLocation";

const shelfSpacing = { x: 240 + 260, y: 466, z: -1000 };

const useShelfModel = async ({ shelf, groupScale = 100 }) => {
  // 加载模型
  const group = await ShelfMobile;
  // 复制模型
  const newGroup = group.scene.children[0].clone();
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

  // 返回模型
  return newGroup;
};

// 获取货架位置
const getShelfPosition = (shelfId) => {
  // 货架列表数据
  const shelfList = computed(() => store.state.shelf.shelfList);
  // 查找货架
  const shelf = shelfList.value.find((shelf) => shelf.id === shelfId);
  // 设置货物的位置
  return {
    x: shelf.position.x * shelfSpacing.x,
    y: shelf.position.y * shelfSpacing.y,
    z: shelf.position.z * shelfSpacing.z,
  };
};

// 获取货架格子位置
const getGridPosition = (shelfId, shelfGridId) => {
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

const toggleShelfBaseEmissive = (oldMesh, newMesh, color, addColor) => {
  // 清除之前被选中的货架格子的自发光属性
  oldMesh?.material?.emissive.set(0x000000);

  // 判断是否要添加颜色并且有捕获到货架格子
  if (addColor && newMesh.length > 0) {
    // 修改货架格子的自发光属性让其高亮 只渲染第一个货架格子
    newMesh[0].object.material.emissive.set(color);
    // 返回被选中的货架格子
    return newMesh[0].object;
  } else {
    return {};
  }
};

export {
  shelfSpacing,
  useShelfModel,
  getShelfPosition,
  getGridPosition,
  toggleShelfBaseEmissive,
};
