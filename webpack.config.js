const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
const webpack = require("webpack");

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
        "style-loader",  // Вставляет стили в <style> в DOM
        "css-loader",    // Преобразует CSS в CommonJS
        "sass-loader"    // Компилирует SCSS в CSS
      ]
    },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],

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
