import { getGoodsListApi } from "@/api/goods";
import { updateGoodsModelPosition } from "@/hooks/useGoods";

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
    moveGoods(state, { id, shelfId, shelfGridId, scene, shelfList }) {
      state.goodsList = state.goodsList.map((item) => {
        if (item.id === id) {
          item.shelf_id = shelfId || item.shelf_id;
          item.shelf_grid_id = shelfGridId || item.shelf_grid_id;
        }
        return item;
      });
      // 刷新货架位置
      if (scene && shelfList) updateGoodsModelPosition(scene, shelfList);
    },
    // 删除货物
    removeGoods(state, id) {
      state.goodsList = state.goodsList.filter((item) => item.id !== id);
    },
  },
  actions: {
    // 获取商品数据
    getGoodsList({ commit }) {
      getGoodsListApi().then((res) => {
        console.log(res);
        if (res.status === 200) {
          // 更新数据
          commit("changeGoods", res.data);
        }
      });
    },
  },
};

export default goods;
