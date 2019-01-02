const path = require("path")
const glob = require('glob');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require("purifycss-webpack");

var website = {
    publicPath: "http://localhost:8888/"
}

module.exports = {
    mode: 'development',
    entry: {
        main: path.join(__dirname, '../src/main.js'),
        main2: path.join(__dirname, '../src/main2.js')
    },
    output: {
        //打包的路径
        path: path.resolve(__dirname, '../dist'),
        //打包的文件名称
        filename: '[name].js', //这里[name] 是告诉我们入口进去的文件是什么名字，打包出来也同样是什么名字
        publicPath: website.publicPath //publicPath：主要作用就是处理静态文件路径的。
    },
    //模块： 解读css 图片如何转换 压缩
    module: {
        rules: [
            // css loader
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                            loader: "css-loader"
                        },
                        {
                            loader: "postcss-loader",
                        },
                    ]
                }),
                // use: [{
                //         loader: 'style-loader'
                //     },
                //     {
                //         loader: 'css-loader',
                //         options: {
                //             modules: true
                //         }
                //     }
                // ]
            },
            //图片 loader
            {
                test: /\.(png|jpg|gif|jpeg)/, //是匹配图片文件后缀名称
                use: [{
                    loader: 'url-loader', //是指定使用的loader和loader的配置参数
                    options: {
                        limit: 500, //是把小于500B的文件打成Base64的格式，写入JS
                        outputPath: 'images/',
                    }
                }]
            },
            {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            },
            //less loader
            {
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })

                // use: [{
                //         loader: "style-loader" // creates style nodes from JS strings
                //     },
                //     {
                //         loader: "css-loader" // translates CSS into CommonJS
                //     },
                //     {
                //         loader: "less-loader" // compiles Less to CSS
                //     }
                // ]
            },
            {
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            //babel 配置
            // {
            //     test: /\.(jsx|js)$/,
            //     use: {
            //         loader: 'babel-loader',
            //     },
            //     exclude: /node_modules/
            // },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    //插件
    plugins: [
        new uglify(),
        new htmlPlugin({
            minify: { //是对html文件进行压缩
                removeAttributeQuotes: true //removeAttrubuteQuotes是却掉属性的双引号。
            },
            hash: true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
            template: './src/index.html' //是要打包的html模版路径和文件名称。
        }),
        new PurifyCSSPlugin({
            //这里配置了一个paths，主要是需找html模板，purifycss根据这个配置会遍历你的文件，查找哪些css被使用了。
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        new extractTextPlugin("css/index.css"), //这里的/css/index.css 是分离后的路径

    ],
    //配置webpack开发服务功能
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        host: 'localhost',
        compress: true,
        port: 8888,
        open: true,
    }


}