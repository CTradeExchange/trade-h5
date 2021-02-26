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
                'vue$': 'vue/dist/vue.esm-bundler.js',
                '@public': resolve('public'),
                '@': resolve('src'),
                '@api': resolve('src/api'),
                '@m': resolve('src/themes/mt4'),
                '@ct': resolve('src/themes/ctrader'),
            }
        }
    },
    devServer:{
        port:8090,
        open: false,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/wp-json/wp': {
                target: 'http://uatwpadmin.ixmiddle.site'
            },
            '/cats-manage-api': {
                target: 'http://uatwph5.ixmiddle.site'
            },
        }
    },
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('preload-index').delete('prefetch-index')
    },
    pages: {
        index: 'src/themes/mt4/main.js'
        // index: 'src/themes/ctrader/main.js'
    }
}
