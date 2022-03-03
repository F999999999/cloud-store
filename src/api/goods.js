import { requestWithToken } from "@/utils/request";

/**
 * 获取商品列表
 * @returns {Promise}
 */
export const getGoodsListApi = () => {
  return requestWithToken("/store/goods", "get");
};
