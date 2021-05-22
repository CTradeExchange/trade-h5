const path = require('path')
const dayjs = require('dayjs')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const plugins = []
const pages = {}
function resolve (dir) {
    return path.join(__dirname, dir)
}

const NODE_ENV = process.env.NODE_ENV
const isAdminMode = process.env.VUE_APP_isAdmin === 'true' // WordPress后台插件的开发模式
console.log(NODE_ENV, process.env.VUE_APP_isAdmin)
if (process.env.NODE_ENV === 'production') {
    plugins.push(
        new FileManagerPlugin({
            events: {
                onEnd: {
                    // archive: [{ source: resolve('dist'), destination: resolve(`zip/dist_${dayjs().format('MMDDHHmm')}.zip`) }]
                    archive: [{ source: resolve('dist'), destination: resolve(`zip/dist${dayjs().format('YYYYMMDDHHmm')}.zip`) }]
                }
            }
        })
    )
}

if (isAdminMode) {
    // WordPress后台插件的开发模式
    Object.assign(pages, {
        index: {
            entry: 'src_admin/pages/index/main.js',
            template: 'public/admin.html',
            filename: NODE_ENV === 'development' ? 'index.html' : 'admin.html',
        },
        // preview: {
        //     entry: 'src_admin/pages/preview/main.js',
        //     template: 'public/preview.html',
        //     filename: 'preview.html',
        // }
    })
} else {
    // H5开发模式
    Object.assign(pages, {
        index: 'src/themes/mt4/main.js'
        // index: 'src/themes/ctrader/main.js'
    })
}

const config = {
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production' && isAdminMode ? '/wp-content/plugins/cats-manage/wp-admin-static/' : '/', // static/
    indexPath: isAdminMode ? 'index.html' : 'index_template.html', // 就是这条
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
                '@admin': resolve('src_admin'),
                '@utils': resolve('src_admin/utils'),
                '@index': resolve('src_admin/pages/index'),
            }
        }
    },
    devServer: {
        port: isAdminMode ? 8080 : 8090,
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
                target: 'http://prewph5.cats-trade.com' // uat http://uatwpview.cats-trade.com  // pre http://prewph5.cats-trade.com/
            },
            '/upload': {
                target: 'http://uatcatsapi.cats-trade.com/upload'
            },
        }
    },
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('preload-index').delete('prefetch-index')
    },
    pages
}

module.exports = config
