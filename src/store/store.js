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
    // 添加仓库
    addStore(state, store) {
      state.storeList.push(store);
    },
    // 修改统计信息
    changeTotal(state, total) {
      state.storeTotal = total;
    },
  },
  actions: {
    // 获取仓库列表数据
    async getStoreList({ commit }) {
      const result = await getStoreListApi();
      console.log(result);
      if (result.status === 200) {
        result.data.forEach((store) => {
          commit("addStore", store);
        });
      }
    },
  },
};

export default store;
