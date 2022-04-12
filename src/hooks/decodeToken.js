// 解密 Token 包含的数据并返回
export const decodeToken = (token) =>
  JSON.parse(
    Buffer.from(
      token
        ? token.split(".")[1]
        : window.localStorage.getItem("token").split(".")[1],
      "base64"
    ).toString("utf-8")
  );
