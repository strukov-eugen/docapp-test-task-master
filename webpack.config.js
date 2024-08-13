const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'data', to: 'data' }
      ],
    }),
  ],
  resolve: {
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@controllers': path.resolve(__dirname, 'src/controllers'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
    extensions: ['.ts', '.js', '.css', '.html'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.template\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  devServer: {
    static: [
      {
          directory: path.join(__dirname, 'dist'),
      },
      {
          directory: path.join(__dirname, 'data'),
          publicPath: '/data',
      },
    ],
    compress: true,
    port: 8080,
    historyApiFallback: true // for SPA
  },
  mode: 'development',
  devtool: 'source-map',
};
