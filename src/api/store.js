import { requestWithToken } from "@/utils/request";

/**
 * 获取仓库信息
 * @returns {Promise}
 */
export const getStoreListApi = () => {
  return requestWithToken("/store", "get");
};

/**
 * 获取仓库使用数据信息
 * @returns {Promise}
 */
export const getStoreListDateApi = () => {
  return requestWithToken("/store/store_total", "get");
};
/**
 * 获取仓库使用运行数据信息
 * @returns {Promise}
 */
export const getStoreShelfDateApi = () => {
  return requestWithToken("/store/shelf_total", "get");
};
/**
 * 获取商品日志
 * @returns {Promise}
 */
export const getGoodsLogDateApi = () => {
  return requestWithToken("/store/goods_log", "get");
};
