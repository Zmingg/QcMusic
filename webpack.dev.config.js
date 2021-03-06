const path = require('path');
const webpack = require('webpack');
const myPubPath = '/';
const config = {
    entry: {
        app: './src/main.js',
        vendor: ['vue','vuex','vue-router']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: myPubPath
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.common.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.(scss|sass)$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader",
                    options: {
                        includePaths: ["assets"]
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: '[name]_[local]_[hash:base64:5]',
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'assets/images/[name]_[hash:base64:10].[ext]',
                            publicPath: myPubPath
                        }
                    }
                ]
            },
            {
                test: /\.(mp3|lrc)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'assets/media/[name]_[hash:base64:10].[ext]',
                            publicPath: myPubPath
                        }
                    }
                ]
            }
        ]
    },
    plugins:[
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         NODE_ENV: JSON.stringify('production'),
        //     }
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     names: ['vendor'],
        //     minChunks: Infinity,
        // }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        // publicPath: 'http://127.0.0.1:8725/music/',
        compress: true,
        port: 8725,
        host:  '0.0.0.0',
        hot: true,
        hotOnly: true
    }
};

module.exports = config;