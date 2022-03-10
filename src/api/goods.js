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
/**
 * 根据商品名搜索商品列表(商品出库)
 * @param name 商品名
 * @returns {Promise}
 */
export const searchDeliveryNameApi = (name) => {
  return requestWithToken("/store/search_goods", "get", { name });
};
/**
 * 根据商品id移除商品(商品出库)
 * @param id 商品id
 * @param takeout_time 移除时间
 * @returns {Promise}
 */
export const removeGoodsByIdApi = ({ ids, takeout_time }) => {
  return requestWithToken("/store/remove_goods", "post", { ids, takeout_time });
};
