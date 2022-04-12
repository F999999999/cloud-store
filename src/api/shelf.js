import { requestWithToken } from "@/utils/request";

/**
 * 获取货架列表
 * @returns {Promise}
 */
export const getShelfListApi = (store_id) => {
  return requestWithToken("/store/shelf", "get", { store_id });
};
/**
 * 获取货架统计数据
 * @returns {Promise}
 */
export const getStoreShelfTotalApi = () => {
  return requestWithToken("/store/shelf_total", "get");
};
