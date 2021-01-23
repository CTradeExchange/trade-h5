const path = require('path')
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave: false,
    configureWebpack: {
        optimization: {
            splitChunks: {
                cacheGroups: {
                    default: false
                }
            }
        },
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        resolve: {
            alias: {
                '@public': resolve('public'),
                '@': resolve('src'),
                '@m': resolve('src/themes/mobile'),
                '@ct': resolve('src/themes/ctrader'),
            }
        }
    },
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('preload-index').delete('prefetch-index')
    },
    pages: {
        // index: 'src/themes/mobile/main.js'
        index: 'src/themes/ctrader/main.js'
    }
}
