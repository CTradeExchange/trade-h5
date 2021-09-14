const path = require('path')
const dayjs = require('dayjs')
const { queryBuildConfig } = require('./build/buildConfig.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
var plugins = []
const pages = {}
function resolve (dir) {
    return path.join(__dirname, dir)
}
process.env.VUE_APP_build = dayjs().format('YYYY-MM-DD HH:mm')
const NODE_ENV = process.env.NODE_ENV
const isAdminMode = process.env.VUE_APP_isAdmin === 'true' // WordPress后台插件的开发模式
console.log(NODE_ENV, process.env.VUE_APP_isAdmin)
// console.log(process.env)
const { buildType = 'cats-upload-all', theme = 'plans' } = queryBuildConfig()
console.log(buildType, theme)

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
    '@h5': resolve(`src/themes/${theme}`),
    '@w': resolve('src/themes/webview'),
}

if (process.env.NODE_ENV === 'production') {
    const pathStr = buildType
    const pathName = isAdminMode ? 'admin' : 'dist'
    const outputDirDestination = `/build_folder/${pathStr}/${pathStr}/${pathName}`
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
                        destination: resolve(outputDirDestination)
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
    // 编译前清空旧的编译文件
    plugins.push(new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [resolve(`${outputDirDestination}/**`)],
    }))
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
            entry: `src/themes/${theme}/main.js`,
            template: 'public/index.html',
            filename: process.env.NODE_ENV === 'production' ? 'index_template.html' : 'index.html',
        }
        // index: 'src/themes/mt4/main.js'
        // index: 'src/themes/ctrader/main.js'
    })
}

const config = {
    productionSourceMap: false,
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
                target: 'http://prewpadmin_3.cats-trade.com', // http://prewpadmin.cats-trade.com/
                // changeOrigin: false,
                disableHostCheck: true,
                onProxyReq: function (proxyReq, req, res, options) { // 由于vue中使用了body-parser 导致http中的body被序列化两次，从而使得配置代理后后端无法获取body中的数据
                    if (req.body) {
                        const reg = new RegExp('application/json')
                        if (reg.test(proxyReq.getHeader('Content-Type'))) {
                            const bodyData = JSON.stringify(req.body)
                            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
                            // stream the content
                            proxyReq.write(bodyData)
                        }
                    }
                }
            },
            '/cats-manage-api': {
                target: 'http://prewph5_3.cats-trade.com', // prewph5公司id为2 prewph5_1公司id为60
                disableHostCheck: true,
                onProxyReq: function (proxyReq, req, res, options) { // 由于vue中使用了body-parser 导致http中的body被序列化两次，从而使得配置代理后后端无法获取body中的数据
                    if (req.body) {
                        const reg = new RegExp('application/json')
                        if (reg.test(proxyReq.getHeader('Content-Type'))) {
                            const bodyData = JSON.stringify(req.body)
                            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
                            // stream the content
                            proxyReq.write(bodyData)
                        }
                    }
                }
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

// uniapp图表详情页面插件打包功能
const argv = require('minimist')(process.argv.slice(2))
if (argv && argv.type === 'webview') {
    Object.assign(config, {
        publicPath: './',
        productionSourceMap: false,
        pages: {
            webview: {
                entry: 'src/themes/webview/main.js',
                template: 'public/webview.html',
                filename: 'webview.html',
            }
        }
    })
}

module.exports = config
