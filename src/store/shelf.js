import { getShelfListApi } from "@/api/shelf";

const shelf = {
  namespaced: true,
  state() {
    return {
      // 货物数据
      shelfList: [],
      // 统计信息
      shelfTotal: {},
    };
  },
  mutations: {
    // 修改货架数据
    changeShelf(state, shelf) {
      state.shelfList = shelf;
    },
    // 修改统计信息
    changeTotal(state, total) {
      state.shelfTotal = total;
    },
    // 修改货架 Tag 显示状态
    changeShelfTagShow(state, { id, tagShow }) {
      state.shelfList = state.shelfList.map((item) => {
        if (item.id === id) {
          item.tagShow = tagShow;
        }
        return item;
      });
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
          // 更新统计信息
          commit("changeTotal", res.total);
        }
      });
    },
  },
};

export default shelf;
