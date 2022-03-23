import {
  addGoodsApi,
  getGoodsListApi,
  moveGoodsByIdApi,
  removeGoodsByIdApi,
} from "@/api/goods";
import { updateGoodsModelPosition, useGoodsModel } from "@/hooks/useGoods";
import store from "@/store";
import { ThreeJS } from "@/hooks/useTEngine";
import { message } from "ant-design-vue";

const goods = {
  namespaced: true,
  state() {
    return {
      // 货物数据
      goodsList: [],
    };
  },
  mutations: {
    // 修改货物 Tag 显示状态
    changeGoodsTagShow(state, { id, tagShow, all = false }) {
      state.goodsList = state.goodsList.map((item) => {
        if (item.id === id || all) {
          item.tagShow = tagShow;
        }
        return item;
      });
    },
    // 清空货物
    clearGoods(state) {
      state.goodsList = [];
      // 递归遍历 children 释放网格模型绑定几何体占用内存
      ThreeJS.scene.children.forEach((obj) => {
        if (obj.type === "Mesh" && obj.name === "goods") {
          // 从内存中删除对象
          obj.geometry.dispose();
          obj.material.dispose();
          // 删除场景对象scene的子对象group
          ThreeJS.scene.remove(obj);
        }
      });
    },
    // 添加货物
    addGoods(state, goods) {
      state.goodsList.push(goods);
      // 渲染货物模型
      useGoodsModel({ goods, groupScale: 80 }).then((goodsModel) => {
        // 添加货物到场景中
        ThreeJS.addObject(goodsModel);
      });
      // 更新货物位置
      store.commit("shelf/changeShelfPosition", {
        goodsId: goods.id,
        shelfId: goods.shelf_id,
        shelfGridId: goods.shelf_grid_id,
      });
      // 判断是否需要更新统计数据
      if (!goods.notTotal) {
        store.commit("shelf/changeTotal", {
          emptyGrid: -1,
          useGrid: 1,
        });
      }
    },
    // 移动货物
    moveGoods(state, { goodsId, shelfId, shelfGridId }) {
      state.goodsList = state.goodsList.map((item) => {
        if (item.id === goodsId) {
          item.shelf_id = shelfId || item.shelf_id;
          item.shelf_grid_id = shelfGridId || item.shelf_grid_id;
        }
        return item;
      });
      // 更新货物位置
      store.commit("shelf/changeShelfPosition", {
        goodsId,
        shelfId,
        shelfGridId,
      });
      // 刷新货架模型位置
      updateGoodsModelPosition(ThreeJS.scene, store.state.shelf.shelfList);
    },
    // 移除货物
    removeGoods(state, { goodsId }) {
      // 删除以前的货物列表
      const oldGoodsList = state.goodsList;
      // 新的货物列表
      state.goodsList = state.goodsList.filter(
        (oldGoods) => oldGoods.id !== goodsId
      );
      // 被移除的货物
      const removeGoods = oldGoodsList.filter(
        (oldGoods) =>
          !state.goodsList.find((newGoods) => newGoods.id === oldGoods.id)
      );
      // 更新货物位置
      store.commit("shelf/changeShelfPosition", {
        goodsId,
      });
      // 递归遍历 children 释放网格模型绑定几何体占用内存
      ThreeJS.scene.children.forEach((obj) => {
        if (obj.type === "Mesh" && obj.name === "goods") {
          // 判断当前货物是否是被删除的货物
          if (removeGoods.findIndex((goods) => goods.id === obj.data.id) >= 0) {
            // 从内存中删除对象
            obj.geometry.dispose();
            obj.material.dispose();
            // 删除场景对象scene的子对象group
            ThreeJS.scene.remove(obj);
          }
        }
      });
    },
  },
  actions: {
    // 获取商品数据
    async getGoodsList({ commit }, storeId) {
      const result = await getGoodsListApi(storeId);
      console.log(result);
      if (result.status === 200) {
        // 清空货物数据
        commit("clearGoods");
        result.data.forEach((goods) => {
          // 添加货物
          commit("addGoods", { ...goods, notTotal: true });
        });
      }
    },
    // 添加货物
    async addGoods(
      { commit },
      {
        storeId,
        name,
        weight,
        shelflife,
        productionDate,
        storageTime,
        shelfId,
        shelfGridId,
      }
    ) {
      // 商品入库
      const result = await addGoodsApi({
        store_id: storeId,
        name,
        weight,
        shelflife,
        production_date: productionDate,
        storage_time: storageTime,
        shelf_id: shelfId,
        shelf_grid_id: shelfGridId,
      });
      if (result.status === 200) {
        commit("addGoods", {
          id: result.data.goods_id,
          name: result.data.name,
          weight: result.data.weight,
          shelflife: result.data.shelflife,
          production_date: result.data.production_date,
          storage_time: result.data.storage_time,
          shelf_id: result.data.shelf_id,
          shelf_grid_id: result.data.shelf_grid_id,
        });
      }
    },
    // 移动货物
    async moveGoods({ commit }, { goodsId, storeId, shelfId, shelfGridId }) {
      // 发送请求更新货架位置
      const result = await moveGoodsByIdApi({
        id: goodsId,
        store_id: storeId,
        shelf_id: shelfId,
        shelf_grid_id: shelfGridId,
      });
      console.log(result);
      if (result.status === 200) {
        // 更新数据
        commit("moveGoods", {
          goodsId,
          shelfId,
          shelfGridId,
        });
      }
    },
    // 移除商品
    async removeGoods({ commit }, { storeId, ids }) {
      // 根据商品id移除商品
      const result = await removeGoodsByIdApi({
        store_id: storeId,
        ids,
        takeout_time: new Date().toLocaleString() / 1000,
      });
      if (result.status === 200) {
        // 提示信息
        message.success(result.message);

        // 删除货物列表中移除的商品
        result.data.forEach((goods) => {
          commit("removeGoods", { goodsId: goods.goods_id });
          // 判断是否需要更新统计数据
          if (!goods.notTotal) {
            store.commit("shelf/changeTotal", {
              emptyGrid: 1,
              useGrid: -1,
            });
          }
        });
      }
      return result;
    },
  },
};

export default goods;
