const path = require('path')
// const dayjs = require('dayjs')
const FileManagerPlugin = require('filemanager-webpack-plugin')
function resolve (dir) {
    return path.join(__dirname, dir)
}

const plugins = []

if (process.env.NODE_ENV === 'production') {
    plugins.push(
        new FileManagerPlugin({
            events: {
                onEnd: {
                    // archive: [{ source: resolve('dist'), destination: resolve(`zip/dist_${dayjs().format('MMDDHHmm')}.zip`) }]
                    archive: [{ source: resolve('dist'), destination: resolve('zip/dist.zip') }]
                }
            }
        })
    )
}

module.exports = {
    lintOnSave: false,
    configureWebpack: {
        plugins,
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
