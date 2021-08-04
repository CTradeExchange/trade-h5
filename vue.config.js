const path = require('path')
const dayjs = require('dayjs')
const FileManagerPlugin = require('filemanager-webpack-plugin')
var plugins = []
const pages = {}
function resolve (dir) {
    return path.join(__dirname, dir)
}
process.env.VUE_APP_build = dayjs().format('YYYY-MM-DD HH:mm')
const NODE_ENV = process.env.NODE_ENV
const alias = {
    'vue$': 'vue/dist/vue.esm-bundler.js',
    '@public': resolve('public'),
    '@': resolve('src'),
    '@api': resolve('src/api'),
    '@m': resolve('src/themes/mt4'),
    '@c': resolve('src/themes/cats'),
    '@ct': resolve('src/themes/ctrader'),
    '@abcc': resolve('src/themes/abcc'),
    '@plans': resolve('src/themes/plans'),
    '@admin': resolve('src_admin'),
    '@utils': resolve('src_admin/utils'),
    '@index': resolve('src_admin/pages/index'),
}
const isAdminMode = process.env.VUE_APP_isAdmin === 'true' // WordPress后台插件的开发模式
console.log(NODE_ENV, process.env.VUE_APP_isAdmin)
if (process.env.NODE_ENV === 'production') {
    const pathStr = isAdminMode ? 'cats-upload-admin' : 'cats-upload-all'
    const pathName = isAdminMode ? 'admin' : 'dist'
    plugins.push(
        new FileManagerPlugin({
            events: {
                onEnd: {
                    // delete: [
                    //     `./build_folder/${pathStr}/${pathStr}/dist`,
                    //     `./build_folder/${pathStr}.zip`
                    // ],
                    copy: [{
                        source: resolve(`/build_folder/${pathName}`),
                        destination: resolve(`/build_folder/${pathStr}/${pathStr}/${pathName}`)
                    }],
                    archive: [
                        // { source: resolve(`${pathName}`), destination: resolve(`zip/${pathName}${dayjs().format('YYYYMMDDHHmm')}.zip`) },
                        {
                            source: resolve(`./build_folder/${pathStr}`),
                            destination: `./build_folder/${pathStr}.zip`,
                            options: {
                                gzipOptions: {
                                    level: 1
                                }
                            }
                        }
                    ],

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
            filename: 'index.html',
        },
        // preview: {
        //     entry: 'src_admin/pages/preview/main.js',
        //     template: 'public/preview.html',
        //     filename: 'preview.html',
        // }
    })
} else {
    Object.assign(alias, {
        'dayjs': resolve('src/utils/dayjs.js')
    })
    // H5开发模式
    Object.assign(pages, {
        index: {
            entry: 'src/themes/plans/main.js',
            template: 'public/index.html',
            filename: process.env.NODE_ENV === 'production' ? 'index_template.html' : 'index.html',
        }
        // index: 'src/themes/mt4/main.js'
        // index: 'src/themes/ctrader/main.js'
    })
}

const config = {
    productionSourceMap: true,
    publicPath: process.env.NODE_ENV === 'production' && isAdminMode ? '/wp-content/plugins/cats-manage/wp-admin-static/' : '/', // static/
    // indexPath: isAdminMode ? 'index.html' : 'index_template.html', // 就是这条
    lintOnSave: false,
    outputDir: isAdminMode ? './build_folder/admin' : './build_folder/dist',
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
            alias
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
                target: 'http://prewpadmin.cats-trade.com' // http://prewpadmin.cats-trade.com/
            },
            '/cats-manage-api': {
                target: 'http://prewph5_3.cats-trade.com' // prewph5公司id为2 prewph5_1公司id为60
            },
            '/upload': {
                target: 'http://precatsapi.cats-trade.com/upload'
            },
        },
        before: require('./mock/mock-server.js')
    },
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('preload-index').delete('prefetch-index')
    },
    pages
}

module.exports = config
