import { requestWithToken } from "@/utils/request";

/**
 * 获取商品列表
 * @returns {Promise}
 */
export const getGoodsListApi = (store_id) => {
  return requestWithToken("/store/goods", "get", { store_id });
};
/**
 * 添加商品(入库)
 * @param params 商品参数
 * @returns {Promise}
 */
export const addGoodsApi = (params) => {
  // 添加操作员ID到请求参数中
  return requestWithToken("/store/add_goods", "post", {
    ...params,
    // 添加操作员ID到请求参数中
    operate_id: JSON.parse(window.localStorage.getItem("userInfo")).id,
  });
};
/**
 * 根据商品名搜索商品列表(商品出库)
 * @param store_id 仓库id
 * @param name 商品名
 * @returns {Promise}
 */
export const searchDeliveryNameApi = ({ store_id, name }) => {
  return requestWithToken("/store/search_goods", "get", { store_id, name });
};
/**
 * 根据商品id移除商品(商品出库)
 * @param store_id 仓库id
 * @param ids 商品id列表
 * @param takeout_time 移除时间
 * @returns {Promise}
 */
export const removeGoodsByIdApi = ({ store_id, ids, takeout_time }) => {
  return requestWithToken("/store/remove_goods", "post", {
    store_id,
    ids,
    takeout_time,
    // 添加操作员ID到请求参数中
    operate_id: JSON.parse(window.localStorage.getItem("userInfo")).id,
  });
};

/**
 * 移动商品(商品出库)
 * @param id 商品id
 * @param store_id 仓库id
 * @param shelf_id 货架id
 * @param shelf_grid_id 货架格子id
 * @returns {Promise}
 */
export const moveGoodsByIdApi = ({ id, store_id, shelf_id, shelf_grid_id }) => {
  return requestWithToken("/store/move_goods", "post", {
    id,
    store_id,
    shelf_id,
    shelf_grid_id,
    // 添加操作员ID到请求参数中
    operate_id: JSON.parse(window.localStorage.getItem("userInfo")).id,
  });
};

export const expireGoodsApi = ({ store_id, page_num, page_size }) => {
  console.log("store_id", store_id);
  return requestWithToken("/store/expire_goods", "get", {
    store_id,
    page_num,
    page_size,
  });
};
