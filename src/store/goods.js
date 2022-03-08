import { getGoodsListApi } from "@/api/goods";

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
