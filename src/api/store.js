import { requestWithToken } from "@/utils/request";

/**
 * 获取仓库信息
 * @returns {Promise}
 */
export const getStoreListApi = () => {
  return requestWithToken("/store", "get");
};
