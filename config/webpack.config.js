// 获取绝对路径
const path = require("path");
// 生成html  文档地址https://github.com/jantimon/html-webpack-plugin
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 开发模式
  mode: "development",
  // 入口文件
  entry: ["./src/index.tsx"],
  // 启用sourcemap追踪编译错误，能够定位到具体出错的代码行
  devtool: "inline-source-map",
  // 开发服务配置 依赖于外部的 webpack-dev-server  文档地址https://webpack.docschina.org/configuration/dev-server
  devServer: {
    static: "./dist",
    port: 5467,
    host: "0.0.0.0",
    // 启用热更新
    hot: true,
    // 路由刷新404处理
    historyApiFallback: true,
  },
  optimization: {
    // 提取引导模板，为所有的模块创建一个runtime bundle
    runtimeChunk: "single",
    // 打包优化，分离模块，防止不同入口多次引用   n*x--->1*x
    splitChunks: {
      chunks: "all",
    },
  },
  // 输出文件
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "../dist"),
    // 清空目标位置的文件
    clean: true,
    // 多级路由刷新浏览器报错处理
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "uex-panel",
      template: "src/index.html",
    }),
  ],
  module: {
    rules: [
      // 解析css 依赖于外部style-loader和css-loader
      {
        test: /\.(css|scss)$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
          },
          "sass-loader",
        ],
      },
      // 解析图像 webpack内置模块
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      // 解析字体 webpack内置模块
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      // 解析React文件
      {
        // 对项目中.js结尾的文件，使用babel-loader进行转义处理
        test: /\.(js|jsx)$/i,
        loader: "babel-loader", // 排除node_modules
        exclude: /node_modules/,
      },
      // 解析ts文件
      {
        test: /\.(ts|tsx)?$/i,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".svg"],
    // 别名
    alias: {
      "@": path.resolve(__dirname, "../src"),
      Layout: path.resolve(__dirname, "../src/Layout/index.tsx"),
      Router: path.resolve(__dirname, "../src/Router/index.ts"),
      pages: path.resolve(__dirname, "../src/pages"),
      utils: path.resolve(__dirname, "../src/utils"),
    },
    modules: ["node_modules"],
  },
};
