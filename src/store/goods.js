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
