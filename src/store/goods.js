const goods = {
  namespaced: true,
  state() {
    return {
      // 货物数据
      goodsList: [
        {
          name: "box",
          shelf_id: 1,
          shelf_base_id: 1,
          position: { x: 0, y: 0, z: 0 },
        },
        {
          name: "box1",
          shelf_id: 1,
          shelf_base_id: 2,
          position: { x: 1, y: 0, z: 1 },
        },
        {
          name: "box2",
          shelf_id: 1,
          shelf_base_id: 3,
          position: { x: 0, y: 0, z: 2 },
        },
        {
          name: "box3",
          shelf_id: 1,
          shelf_base_id: 4,
          position: { x: 1, y: 0, z: 2 },
        },
        {
          name: "box4",
          shelf_id: 1,
          shelf_base_id: 6,
          position: { x: 0, y: 0, z: 4 },
        },
        {
          name: "box5",
          shelf_id: 1,
          shelf_base_id: 12,
          position: { x: 0, y: 0, z: 5 },
        },
        {
          name: "box",
          shelf_id: 1,
          shelf_base_id: 19,
          position: { x: 0, y: 1, z: 0 },
        },
        {
          name: "box",
          shelf_id: 1,
          shelf_base_id: 21,
          position: { x: 0, y: 1, z: 2 },
        },
        {
          name: "box",
          shelf_id: 2,
          shelf_base_id: 22,
          position: { x: 0, y: 1, z: 6 },
        },
        {
          name: "box",
          shelf_id: 1,
          shelf_base_id: 25,
          position: { x: 0, y: 1, z: 3 },
        },
        {
          name: "box",
          shelf_id: 1,
          shelf_base_id: 39,
          position: { x: 0, y: 1, z: 5 },
        },
        {
          name: "box",
          shelf_id: 4,
          shelf_base_id: 66,
          position: { x: 0, y: 2, z: 2 },
        },
        {
          name: "box",
          shelf_id: 2,
          shelf_base_id: 20,
          position: { x: 0, y: 3, z: 3 },
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
};

export default goods;
