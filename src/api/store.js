import { requestWithToken } from "@/utils/request";

/**
 * 获取仓库信息
 * @returns {Promise}
 */
export const getStoreListApi = () => {
  return requestWithToken("/store", "get");
};

/**
 * 获取仓库统计数据
 * @returns {Promise}
 */
export const getStoreTotalApi = () => {
  return requestWithToken("/store/store_total", "get");
};
