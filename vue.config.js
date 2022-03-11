const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  // 打包优化
  optimization: {
    // 最小化代码
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  // 配置 webpack-dev-server
  configureWebpack: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            // 不输出 console.log
            pure_funcs: ["console.log"],
          },
        },
      }),
    ],
  },
};
