import { getGoodsListApi, moveGoodsByIdApi } from "@/api/goods";
import { updateGoodsModelPosition } from "@/hooks/useGoods";
import store from "@/store";
import { ThreeJS } from "@/hooks/useTEngine";

const goods = {
  namespaced: true,
  state() {
    return {
      // 货物数据
      goodsList: [],
    };
  },
  mutations: {
    // 修改货物数据
    changeGoods(state, goods) {
      state.goodsList = goods;
    },
    // 修改货物 Tag 显示状态
    changeGoodsTagShow(state, { id, tagShow, all = false }) {
      state.goodsList = state.goodsList.map((item) => {
        if (item.id === id || all) {
          item.tagShow = tagShow;
        }
        return item;
      });
    },
    // 移动货物
    moveGoods(state, { id, shelfId, shelfGridId }) {
      state.goodsList = state.goodsList.map((item) => {
        if (item.id === id) {
          item.shelf_id = shelfId || item.shelf_id;
          item.shelf_grid_id = shelfGridId || item.shelf_grid_id;
        }
        return item;
      });
      // 刷新货架位置
      updateGoodsModelPosition(ThreeJS.scene, store.state.shelf.shelfList);
    },
    // 删除货物
    removeGoods(state, id) {
      state.goodsList = state.goodsList.filter((item) => item.id !== id);
    },
  },
  actions: {
    // 获取商品数据
    getGoodsList({ commit }, storeId) {
      getGoodsListApi(storeId).then((res) => {
        console.log(res);
        if (res.status === 200) {
          // 更新数据
          commit("changeGoods", res.data);
        }
      });
    },
    // 移动货物
    moveGoods({ commit }, { id, storeId, shelfId, shelfGridId }) {
      // 发送请求更新货架位置
      moveGoodsByIdApi({
        id,
        store_id: storeId,
        shelf_id: shelfId,
        shelf_grid_id: shelfGridId,
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          // 更新数据
          commit("moveGoods", {
            id,
            shelfId,
            shelfGridId,
          });
        }
      });
    },
  },
};

export default goods;
