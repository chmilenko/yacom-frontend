const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const webpack = require("webpack");
const path = require('path');

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist",
  },

  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        use: [
          "style-loader", // Вставляет стили в <style> в DOM
          "css-loader", // Преобразует CSS в CommonJS
          "sass-loader", // Компилирует SCSS в CSS
        ],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript", // ВАЖНО!
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    //  alias: {
    //   // Добавь алиасы как в tsconfig.json
    //   '@core': path.resolve(__dirname, 'src/Core'),
    //   '@components': path.resolve(__dirname, 'src/Components'),
    //   '@pages': path.resolve(__dirname, 'src/Pages'),
    //   '@utils': path.resolve(__dirname, 'src/Utils'),
    //   '@styles': path.resolve(__dirname, 'src/Styles'),
    // },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: true,
    }),
    new HtmlInlineScriptPlugin(HtmlWebpackPlugin),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_DEVELOPER": JSON.stringify("false"),
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /mock\.js$/,
    }),
  ],
};
