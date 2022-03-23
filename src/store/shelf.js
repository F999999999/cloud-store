import { getShelfListApi } from "@/api/shelf";
import { ThreeJS } from "@/hooks/useTEngine";
import { useShelfModel } from "@/hooks/useShelf";

const shelf = {
  namespaced: true,
  state() {
    return {
      // 货物数据
      shelfList: [],
      // 统计信息
      shelfTotal: {
        emptyGrid: 0,
        useGrid: 0,
        shelf: 0,
      },
    };
  },
  mutations: {
    // 修改统计信息
    changeTotal(state, { emptyGrid = 0, useGrid = 0, shelf = 0 }) {
      state.shelfTotal = {
        emptyGrid: state.shelfTotal.emptyGrid + emptyGrid,
        useGrid: state.shelfTotal.useGrid + useGrid,
        shelf: state.shelfTotal.shelf + shelf,
      };
    },
    // 修改货架 Tag 显示状态
    changeShelfTagShow(state, { id, tagShow, all = false }) {
      state.shelfList = state.shelfList.map((item) => {
        if (item.id === id || all) {
          item.tagShow = tagShow;
        }
        return item;
      });
    },
    // 清空货架
    clearShelf(state) {
      state.shelfList = [];
      // 递归遍历 children 释放网格模型绑定几何体占用内存
      ThreeJS.scene.children.forEach((obj) => {
        if (obj.type === "Mesh" && obj.name === "shelf") {
          // 从内存中删除对象
          obj.geometry.dispose();
          obj.material.dispose();
          // 删除场景对象scene的子对象group
          ThreeJS.scene.remove(obj);
        }
      });
    },
    // 添加货架
    addShelf(state, shelf) {
      state.shelfList.push(shelf);
      // 渲染货架模型
      useShelfModel({ shelf, groupScale: 100 }).then((shelfModel) => {
        // 添加货架到场景中
        ThreeJS.addObject(shelfModel);
      });
    },
    // 修改货架格子的货物ID
    changeShelfPosition(state, { goodsId, shelfId, shelfGridId }) {
      // 遍历货架列表
      state.shelfList = state.shelfList.map((shelf) => {
        return {
          ...shelf,
          // 遍历货架格子列表
          shelf_grid: shelf.shelf_grid.map((shelfGrid) => {
            // 移除货架原有货架格子上的货物
            if (shelfGrid.goods_id === goodsId) {
              shelfGrid.goods_id = null;
            }
            // 在新的货架格子上添加货物
            if (
              shelf.id === shelfId &&
              shelfGrid.shelf_grid_id === shelfGridId
            ) {
              shelfGrid.goods_id = goodsId;
            }
            return shelfGrid;
          }),
        };
      });
    },
  },
  actions: {
    // 获取货架列表数据
    async getShelfList({ commit }, storeId) {
      const result = await getShelfListApi(storeId);
      console.log(result);
      if (result.status === 200) {
        // 更新统计信息
        commit("changeTotal", result.total);
        // 清空货架数据
        commit("clearShelf");
        result.data.forEach((shelf) => {
          // 添加货架
          commit("addShelf", shelf);
        });
      }
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
