// module.exports = {
//     plugins: [
//         require('autoprefixer') //自动添加前缀插件
//     ]
// }


module.exports = {
    plugins: [
        require('autoprefixer')({
            browsers: ["last 2 versions"]
        }),
    ]
}