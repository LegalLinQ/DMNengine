const webpack = require('webpack');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');
const currentYear = new Date().getFullYear();
const path = require("path");


module.exports = {
  entry: './src/index',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {  loader:'babel-loader' },
          {  loader:'ts-loader' }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
    ]
  },
  resolve: {
    extensions: ['.ts','.tsx','.js','.jsx']
  },
  output: {
    path: path.resolve(__dirname, "lib"),
    filename: 'llqEngine.js',
    library: "llqEngine", // Desired name for the global variable when using as a drop-in script-tag.
    libraryTarget: "umd",
    globalObject: "this"
  },
  plugins: [
    // load `moment/locale/ja.js` and `moment/locale/it.js`
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /nl|en-gb/),
    new MomentTimezoneDataPlugin({
      matchZones: 'Etc/UTC',
      startYear: currentYear - 2,
      endYear: currentYear + 10,

    }),
    new FileManagerPlugin({ //https://www.npmjs.com/package/filemanager-webpack-plugin = veel opties, ook zip etc.
      onEnd: {
        copy: [
          { source: path.resolve(__dirname, "lib")+'/llqEngine.js', destination: path.resolve(__dirname, "lib")+'/llqEngine.txt' },
        ],
      }
    }),
  ],
};
