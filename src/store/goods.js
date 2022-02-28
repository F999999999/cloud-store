const goods = {
  namespaced: true,
  state() {
    return {
      // 货物数据
      goodsList: [
        {
          id: 1,
          name: "box",
          shelf_id: 1,
          shelf_grid_id: 1,
        },
        {
          id: 2,
          name: "box1",
          shelf_id: 1,
          shelf_grid_id: 2,
        },
        {
          id: 3,
          name: "box2",
          shelf_id: 1,
          shelf_grid_id: 3,
        },
        {
          id: 4,
          name: "box3",
          shelf_id: 1,
          shelf_grid_id: 4,
        },
        {
          id: 5,
          name: "box4",
          shelf_id: 1,
          shelf_grid_id: 6,
        },
        {
          id: 6,
          name: "box5",
          shelf_id: 1,
          shelf_grid_id: 12,
        },
        {
          id: 7,
          name: "box",
          shelf_id: 1,
          shelf_grid_id: 19,
        },
        {
          id: 8,
          name: "box",
          shelf_id: 1,
          shelf_grid_id: 21,
        },
        {
          id: 9,
          name: "box",
          shelf_id: 2,
          shelf_grid_id: 22,
        },
        {
          id: 10,
          name: "box",
          shelf_id: 1,
          shelf_grid_id: 25,
        },
        {
          id: 11,
          name: "box",
          shelf_id: 1,
          shelf_grid_id: 39,
        },
        {
          id: 12,
          name: "box",
          shelf_id: 4,
          shelf_grid_id: 66,
        },
        {
          id: 13,
          name: "box",
          shelf_id: 2,
          shelf_grid_id: 20,
        },
      ],
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
    // getGoods({ commit }) {
    //   getGoodsApi().then((res) => {
    //     if (res.status === 200) {
    //       commit("changeGoods", res.data);
    //     }
    //   });
    // },
  },
};

export default goods;
