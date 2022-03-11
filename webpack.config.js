const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  // 打包优化
  optimization: {
    // 最小化代码
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  configureWebpack: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            // 删除所有的 `console` 语句
            pure_funcs: ["console.log"],
          },
        },
      }),
    ],
  },
};
