import { requestWithOutToken } from "@/utils/request";

/**
 * 账号密码登录
 * @param username 用户名
 * @param password 密码
 * @returns {Promise}
 */
export const loginByAccountAndPasswordApi = ({ username, password }) => {
  return requestWithOutToken("/users/login", "post", { username, password });
};

/**
 * 检测用户名是否唯一
 * @param username 用户名
 * @returns {Promise}
 */
export const checkUsernameIsUniqueApi = (username) => {
  return requestWithOutToken("/register/check", "get", { username });
};
