import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin  from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const GLOBALS = {
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                'REST_URL': JSON.stringify('https://apidev.houstonisd.org/'),
                'SITE_COLLECTION': JSON.stringify('https://connectdevapps.houstonisd.org/'),
                //'SITE_COLLECTION': JSON.stringify('https://connectqaapps.houstonisd.org/appdev/'),
                'RELATIONSHIPS_LIST': JSON.stringify('Relationships Requests')
            }
        };

export default {
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/index'),
  target: 'web',
  output: {
    path: __dirname + '/app', // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/MSHP/app/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'src')
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new ExtractTextPlugin({ filename: 'styles.css' }),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
  ],
  module: {
    rules: [
      { test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel-loader']},
      { test: /(\.css)$/, use: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader"})},
      { test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=images/[name].[ext]?' }
    ]
  }
};
