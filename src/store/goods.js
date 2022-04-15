import {
  addGoodsApi,
  expireGoodsApi,
  getGoodsListApi,
  getGoodsLogApi,
  moveGoodsByIdApi,
  removeGoodsByIdApi,
} from "@/api/goods";
import { updateAllGoodsModelPosition, useGoodsModel } from "@/hooks/useGoods";
import store from "@/store";
import { ThreeJS } from "@/hooks/useTEngine";
import { message } from "ant-design-vue";
import { getGridPositionIndex } from "@/hooks/useShelf";

const goods = {
  namespaced: true,
  state() {
    return {
      // 商品数据
      goodsList: [],
      // 临期商品数据
      expireGoodsList: [],
      // 商品日志
      goodsLog: [],
    };
  },
  mutations: {
    // 修改商品 Tag 显示状态
    changeGoodsTagShow(state, { id, tagShow, all = false }) {
      state.goodsList = state.goodsList.map((item) => {
        if (item.id === id || all) {
          item.tagShow = tagShow;
        }
        return item;
      });
    },
    // 清空商品
    clearGoods(state) {
      state.goodsList = [];
      // 遍历 children 释放网格模型绑定几何体占用内存
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
    // 添加商品
    addGoods(state, goods) {
      state.goodsList.push(goods);
      // 渲染商品模型
      useGoodsModel({ goods, groupScale: 80 }).then((goodsModel) => {
        // 添加商品到场景中
        ThreeJS.addObject(goodsModel);
      });
      // 更新商品位置
      store.commit("shelf/changeShelfPosition", {
        goodsId: goods.id,
        shelfId: goods.shelf_id,
        shelfGridId: goods.shelf_grid_id,
      });
      // 判断是否需要更新统计数据
      if (!goods.notTotal) {
        store.commit("shelf/changeTotal", {
          storeId: goods.store_id,
          emptyGrid: -1,
          useGrid: 1,
        });
      }
    },
    // 移动商品
    moveGoods(state, { goodsId, shelfId, shelfGridId }) {
      state.goodsList = state.goodsList.map((item) => {
        if (item.id === goodsId) {
          item.shelf_id = shelfId || item.shelf_id;
          item.shelf_grid_id = shelfGridId || item.shelf_grid_id;
        }
        return item;
      });
      // 更新商品位置
      store.commit("shelf/changeShelfPosition", {
        goodsId,
        shelfId,
        shelfGridId,
      });
      // 刷新货架模型位置
      updateAllGoodsModelPosition(ThreeJS.scene);
    },
    // 移除商品
    removeGoods(state, { goodsId }) {
      // 删除以前的商品列表
      const oldGoodsList = state.goodsList;
      // 新的商品列表
      state.goodsList = state.goodsList.filter(
        (oldGoods) => oldGoods.id !== goodsId
      );
      // 被移除的商品
      const removeGoods = oldGoodsList.filter(
        (oldGoods) =>
          !state.goodsList.find((newGoods) => newGoods.id === oldGoods.id)
      );
      // 更新商品位置
      store.commit("shelf/changeShelfPosition", {
        goodsId,
      });
      // 遍历 children 释放网格模型绑定几何体占用内存
      ThreeJS.scene.children.forEach((obj) => {
        if (obj.type === "Mesh" && obj.name === "goods") {
          // 判断当前商品是否是被删除的商品
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
    // 清空临期商品
    clearExpireGoods(state) {
      state.expireGoodsList = [];
    },
    // 设置临期商品
    setExpiredGoods(state, expireGoods) {
      state.expireGoodsList = expireGoods.map((goods) => ({
        ...goods,
        grid_position: getGridPositionIndex({
          shelfId: goods.shelf_id,
          shelfGridId: goods.shelf_grid_id,
        }),
      }));
    },
    // 清空商品日志
    clearGoodsLog(state) {
      state.goodsLogList = [];
    },
    // 设置商品日志
    setGoodsLog(state, goodsLog) {
      state.goodsLog = goodsLog;
    },
  },
  actions: {
    // 获取商品数据
    async getGoodsList({ commit }, storeId) {
      const result = await getGoodsListApi(storeId);
      console.log(result);
      if (result.status === 200) {
        // 清空商品数据
        commit("clearGoods");
        result.data.forEach((goods) => {
          // 添加商品
          commit("addGoods", { ...goods, notTotal: true });
        });
      }
    },
    // 添加商品
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
        // 提示信息
        message.success(result.message);
        return result;
      }
    },
    // 移动商品
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
      // 提示信息
      message.success(result.message);
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
        // 删除商品列表中移除的商品
        result.data.forEach((goods) => {
          commit("removeGoods", { goodsId: goods.goods_id });
          // 判断是否需要更新统计数据
          if (!goods.notTotal) {
            store.commit("shelf/changeTotal", {
              storeId: storeId,
              emptyGrid: 1,
              useGrid: -1,
            });
          }
        });
      }
      // 提示信息
      message.success(result.message);
      return result;
    },
    // 获取临期商品数据
    async getExpireGoodsList({ commit }, { storeId, pageNum, pageSize }) {
      const result = await expireGoodsApi({
        store_id: storeId,
        page_num: pageNum,
        page_size: pageSize,
      });
      console.log(result);
      if (result.status === 200) {
        commit("clearExpireGoods");
        commit("setExpiredGoods", result.data);
      }
    },
    // 获取商品操作日志
    async getGoodsLog({ commit }, { storeId, pageNum, pageSize }) {
      const result = await getGoodsLogApi({
        store_id: storeId,
        page_num: pageNum,
        page_size: pageSize,
      });
      console.log(result);
      if (result.status === 200) {
        // 清空日志
        commit("clearGoodsLog");
        // 添加日志
        commit("setGoodsLog", result.data);
      }
    },
  },
};

export default goods;
