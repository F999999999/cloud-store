import { getStoreListApi } from "@/api/store";

const store = {
  namespaced: true,
  state() {
    return {
      // 仓库数据
      storeList: [],
      // 统计信息
      storeTotal: {},
    };
  },
  mutations: {
    // 修改仓库数据
    changeStore(state, store) {
      state.storeList = store;
    },
    // 修改统计信息
    changeTotal(state, total) {
      state.storeTotal = total;
    },
  },
  actions: {
    // 获取仓库列表数据
    getStoreList({ commit }) {
      getStoreListApi().then((res) => {
        console.log(res);
        if (res.status === 200) {
          // 更新数据
          commit("changeStore", res.data);
        }
      });
    },
  },
};

export default store;
