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
  return requestWithToken("/store/add_goods", "post", params);
};
/**
 * 根据商品名搜索商品列表(商品出库)
 * @param store_id 仓库id
 * @param name 商品名
 * @returns {Promise}
 */
export const searchGoodsNameApi = ({ store_id, name }) => {
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
  });
};
/**
 * 获取商品日志
 * @param store_id 仓库id
 * @param page_num 页码
 * @param page_size 每页数量
 * @returns {Promise}
 */
export const getGoodsLogApi = ({ store_id, page_num = 1, page_size = 10 }) => {
  return requestWithToken("/store/goods_log", "get", {
    store_id,
    page_num,
    page_size,
  });
};
/**
 * 根据商品id获取商品日志
 * @param goods_id 商品id
 * @returns {Promise}
 */
export const getGoodsLogByIdApi = ({ goods_id }) => {
  return requestWithToken("/store/goods_log_by_id", "get", { goods_id });
};
/**
 * 获取临期商品列表
 * @param id 商品id
 * @returns {Promise}
 */
export const expireGoodsApi = ({ store_id, page_num, page_size }) => {
  return requestWithToken("/store/expire_goods", "get", {
    store_id,
    page_num,
    page_size,
  });
};
/**
 * 获取临期商品统计
 * @returns {Promise}
 */
export const getGoodsLogTotalApi = () => {
  return requestWithToken("/store/expire_goods_total", "get");
};
/**
 * 获取待处理商品
 * @returns {Promise}
 */
export const getPendingGoodsApi = () => {
  return requestWithToken("/store/pending_goods", "get");
};
/**
 * 确认商品移动
 * @param log_id 日志id
 * @param execute_id 操作员id
 * @returns {Promise}
 */
export const confirmMoveGoodsApi = ({ log_id }) => {
  return requestWithToken("/store/confirm_move_goods", "post", {
    log_id,
  });
};
