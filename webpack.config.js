const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  target: "web",
  mode: "development",
  context: __dirname,
  devtool: "source-map",
  mode: 'development',
  entry: './src/js/index.js',
  target : 'node',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // Convert images < 8kb to base64 strings
              name: 'src/[hash]-[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|png|svg|jpg|gif|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'src/[hash]-[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": [["@babel/env", { "modules": "commonjs" }]],
            "plugins": ["add-module-exports"]
          }
        }
      }]
  },
  
  plugins: [
    new ExtractTextPlugin("style.css")
  ],
  devServer: {
    publicPath: '/dist/',
    contentBase: './public',
    // stats: 'errors-only'
  }
};
