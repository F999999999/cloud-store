import { requestWithToken } from "@/utils/request";

/**
 * 获取商品列表
 * @returns {Promise}
 */
export const getGoodsListApi = () => {
  return requestWithToken("/store/goods", "get");
};
/**
 * 添加商品(入库)
 * @param params 商品参数
 * @returns {Promise}
 */
export const addGoodsApi = (params) => {
  return requestWithToken("/store/add_goods", "post", params);
};
