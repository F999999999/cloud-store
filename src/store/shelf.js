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
    getShelfList({ commit }, storeId) {
      getShelfListApi(storeId).then((res) => {
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
  getters: {
    // 获取已使用的货架格子
    getUseShelfGridList(state) {
      // 如果货架列表为空 则返回空数组
      if (state.shelfList.length === 0) return [];
      // 计算已使用的货架格子
      const UseShelfGridList = [];
      state.shelfList.forEach((shelf) => {
        const obj = {
          value: shelf.id,
          label: shelf.name,
          children: [],
        };
        shelf.shelf_grid.forEach((grid) => {
          if (grid.goods_id !== null) {
            obj.children.push({
              value: grid.shelf_grid_id,
              label: `${grid.position.y + 1}层 ${grid.position.x + 1}行 ${
                grid.position.z + 1
              }列(${grid.shelf_grid_id})`,
              goods_id: grid.goods_id,
            });
          }
        });
        if (obj.children.length > 0) UseShelfGridList.push(obj);
      });
      return UseShelfGridList;
    },
    // 获取未使用的货架格子
    getEmptyShelfGridList(state) {
      // 如果货架列表为空 则返回空数组
      if (state.shelfList.length === 0) return [];
      // 计算未使用的货架格子
      const emptyShelfGridList = [];
      state.shelfList.forEach((shelf) => {
        const obj = {
          value: shelf.id,
          label: shelf.name,
          children: [],
        };
        shelf.shelf_grid.forEach((grid) => {
          if (grid.goods_id == null) {
            obj.children.push({
              value: grid.shelf_grid_id,
              label: `${grid.position.y + 1}层 ${grid.position.x + 1}行 ${
                grid.position.z + 1
              }列(${grid.shelf_grid_id})`,
            });
          }
        });
        if (obj.children.length > 0) emptyShelfGridList.push(obj);
      });
      return emptyShelfGridList;
    },
  },
};

export default shelf;
