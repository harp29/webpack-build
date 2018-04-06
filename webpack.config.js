const path = require('path');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// const ASSET_PATH = process.env.ASSET_PATH || '/'; ,
//publicPath: '/dist'

var isProd = process.env.NODE_ENV === 'production';
var cssDev = ['style-loader', 'css-loader', 'sass-loader'];

const VENDOR_LIBS =['gsap'];

var cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
        'css-loader', 'sass-loader'
    ],
    publicPath: '/dist'
});

var cssConfig = isProd ? cssProd : cssDev;

module.exports = {
    entry: {
        index: './src/app.js',
        about: './src/about.js',
        vendor: VENDOR_LIBS
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js'
    },
    devServer: {
        //contentBase: path.join(__dirname, "/dist"),
        compress: true,
        port: 3000,
        hot: true,
        stats: "errors-only",
        open: true
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },
    module:{
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use:[
                     "style-loader" , "css-loader"
                    ]
            },
            {
                test: /\.scss$/,
                use: cssConfig
            },
            {
                test: /\.pug$/,
                use: ['html-loader', 'pug-html-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: ['file-loader?name=[name].[ext]&outputPath=images/&publicPath=images/',
                        'image-webpack-loader'
                     ]
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            title: 'Webpack template html only',
            template: './src/index.pug',
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            inject: true,
            excludeChunks: ['about']
        }),
        new htmlWebpackPlugin({
            title: 'about',
            template: './src/about.html',
            filename: 'about.html',
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            chunks: ['about']
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new ExtractTextPlugin({
            filename: 'app.css',
            disable: !isProd,
            allChunks: true
        }),
        new webpack.DefinePlugin({

            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)

        })
    ]

};