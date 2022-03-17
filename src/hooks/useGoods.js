import { ContainerMobile } from "@/utils/three/loadModel/containerMobile";
import { shelfLocation } from "@/utils/modelLocation/shelfModelLocation";
import { shelfSpacing } from "@/hooks/useShelf";
import { goodsTag } from "@/utils/three/CSS2DObject";
import { computed } from "vue";
import store from "@/store";

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

// 渲染货物模型
const addGoodsModel = async (goods, goodsTagRef, show = false) => {
  // 货架列表数据
  const shelfList = computed(() => store.state.shelf.shelfList);

  const goodsModel = await useGoodsModel({
    shelfList: shelfList.value,
    goods,
    groupScale: 80,
  });

  // 添加货物 Tag 标签显示状态
  store.commit("goods/changeGoodsTagShow", {
    id: goods.id,
    tagShow: show,
  });

  // 添加 CSS2DObject 标签
  Promise.resolve(goodsModel).then((goods) => {
    // 查找货物的 domElement 元素
    for (let domElement of goodsTagRef.children) {
      if (Number(domElement.getAttribute("data-id")) === goods.data.id) {
        // 生成货架的 Tag 标签
        const tag = goodsTag(domElement, goods.data.name, goods.data.position);
        // 添加货架的 Tag 标签
        goods.add(tag);
      }
    }
  });

  return goodsModel;
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

export { useGoodsModel, addGoodsModel, updateGoodsModelPosition };
