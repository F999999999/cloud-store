module.exports = {
  chainWebpack: (config) => {
    // 将小于 20kb 的图片打包为 base64 编码格式
    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap((options) => Object.assign(options, { limit: 20 * 1024 }));
  },
};
