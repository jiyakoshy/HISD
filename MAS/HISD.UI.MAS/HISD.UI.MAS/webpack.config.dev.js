import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin  from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const GLOBALS = {
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
                'REST_URL': JSON.stringify('https://apistg.houstonisd.org/'),/* //https://apiint.houstonisd.org/,https://apidev.houstonisd.org/  ,https://apistg.houstonisd.org/common/*/
                'SITE_COLLECTION': JSON.stringify('https://connectstgapps.houstonisd.org/'),//https://connectstgapps.houstonisd.org/   https://connectqaapps.houstonisd.org/
                'RELATIONSHIPS_LIST': JSON.stringify('Relationships Requests'),
                'MENTOR_ACTIVITY_LOG': JSON.stringify('MentorActivityLog')
            }
        };

export default {
  devtool: 'inline-source-map',
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client?reload=true', //note that it reloads the page if hot module reloading fails.
    path.resolve(__dirname, 'src/index')
  ],
  target: 'web',
  output: {
    path: __dirname + '/app', // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/MAS/app/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'src')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new ExtractTextPlugin({ filename: '[name].css' })
  ],
  module: {
    rules: [
      { test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel-loader']},
      { test: /(\.css)$/, loaders: ['style-loader', 'css-loader']},
      { test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=images/[name].[ext]?' }
    ]
  }
};
