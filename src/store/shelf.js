const shelf = {
  namespaced: true,
  state() {
    return {
      // 货物数据
      shelfList: [
        {
          id: 1,
          name: "shelf1",
          position: { x: 0, y: 0, z: 0 },
        },
        {
          id: 2,
          name: "shelf2",
          position: { x: 1, y: 0, z: 0 },
        },
        {
          id: 3,
          name: "shelf3",
          position: { x: 2, y: 0, z: 0 },
        },
        {
          id: 4,
          name: "shelf4",
          position: { x: 1, y: 0, z: 1 },
        },
      ],
    };
  },
  mutations: {
    // 修改货架数据
    changeShelf(state, shelf) {
      state.shelfList = shelf;
    },
  },
  actions: {
    // 获取货物数据
    // getShelf({ commit }) {
    //   getShelfApi().then((res) => {
    //     if (res.status === 200) {
    //       commit("changeShelf", res.data);
    //     }
    //   });
    // },
  },
};

export default shelf;
