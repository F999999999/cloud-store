import { getShelfListApi } from "@/api/shelf";

const shelf = {
  namespaced: true,
  state() {
    return {
      // 货物数据
      shelfList: [],
    };
  },
  mutations: {
    // 修改货架数据
    changeShelf(state, shelf) {
      state.shelfList = shelf;
    },
  },
  actions: {
    // 获取货架列表数据
    getShelfList({ commit }) {
      getShelfListApi().then((res) => {
        console.log(res);
        if (res.status === 200) {
          // 更新数据
          commit("changeShelf", res.data);
        }
      });
    },
  },
};

export default shelf;
