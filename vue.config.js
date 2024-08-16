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

// seo配置文件路径
process.env.VUE_APP_META_KEYWORDS = '<!--# include virtual="/seo/${seo_file}_keywords.html" stub="file_not_found" -->'
process.env.VUE_APP_META_DESC = '<!--# include virtual="/seo/${seo_file}_description.html" stub="file_not_found" -->'

const NODE_ENV = process.env.NODE_ENV
const isAdminMode = process.env.VUE_APP_isAdmin === 'true' // WordPress后台插件的开发模式
console.log(NODE_ENV, isAdminMode ? 'wp编辑器' : 'C端')
// console.log(process.env)
const { buildType = 'cats-upload-all', theme = 'plans', h5URL, sourceMap } = queryBuildConfig()
console.log(buildType, theme, h5URL)
process.env.VUE_APP_theme = theme
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
    '@planspc': resolve('src/themes/plans_PCUI'),
    '@admin': resolve('src_admin'),
    '@utils': resolve('src_admin/utils'),
    '@index': resolve('src_admin/pages/index'),
    '@h5': resolve(`src/themes/${theme}`),
    '@w': resolve('src/themes/webview'),
}

if (process.env.NODE_ENV === 'production') {
    const pluginName = isAdminMode ? 'editor' : 'h5'
    const packageName = isAdminMode ? 'cats-upload-admin' : 'cats-upload-h5' // zip包名字
    const outputDirDestination = `/build_folder/${packageName}/${packageName}/dist/skin_${theme}_2`
    const wp_init_file = isAdminMode ? 'init_editor.ini' : 'init_h5.ini'
    plugins.push(
        new FileManagerPlugin({
            events: {
                onEnd: {
                    // delete: [
                    //     `./build_folder/${pathStr}/${pathStr}/dist`,
                    //     `./build_folder/${pathStr}.zip`
                    // ],
                    copy: [{
                        source: resolve('/build_folder/dist'),
                        destination: resolve(outputDirDestination) + `/${pluginName}`
                    }, {
                        source: resolve(`/src/themes/${theme}/${wp_init_file}`),
                        destination: resolve(outputDirDestination) + `/${wp_init_file}`
                    }],
                    archive: [
                        // { source: resolve(`${pathName}`), destination: resolve(`zip/${pathName}${dayjs().format('YYYYMMDDHHmm')}.zip`) },
                        {
                            source: resolve(`./build_folder/${packageName}`),
                            destination: `./build_folder/${packageName}.zip`,
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
    // H5开发模式
    Object.assign(pages, {
        index: {
            entry: `src/themes/${theme}/main.js`,
            template: 'public/index.html',
            filename: process.env.NODE_ENV === 'production' ? 'index_template.html' : 'index.html',
        },
        upgrading: {
            entry: 'src/themes/upgrading/main.js',
            template: 'public/index.html',
            filename: process.env.NODE_ENV === 'production' ? 'upgrading.html' : 'upgrading.html',
        }
        // index: 'src/themes/mt4/main.js'
        // index: 'src/themes/ctrader/main.js'
    })
}

const config = {
    productionSourceMap: sourceMap === 'true',
    publicPath: process.env.NODE_ENV === 'production' && isAdminMode ? `/wp-content/plugins/cats-manage/skin/skin_${theme}_2/editor/` : '/', // static/
    // indexPath: isAdminMode ? 'index.html' : 'index_template.html', // 就是这条
    lintOnSave: false,
    outputDir: isAdminMode ? './build_folder/dist' : './build_folder/dist',
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
    css: {
        loaderOptions: { // 自动注入全局变量样式
            sass: {
                // 注意: 在 sass-loader v8 中，这个选项是 prependData
                prependData: '@import "~@/sass/mixin.scss";',
            },
        },
    },
    devServer: {
        port: isAdminMode ? 8090 : 8080,
        open: false,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/wp-content/uploads': {
                target: h5URL || 'https://prewpadmin_10.cmfbl.com',
            },
            '/news_item_api': {
                target: 'https://news-test.headline.net',
                // target: 'https://news.mcgrp.com',
                pathRewrite: { '/news_item_api': '' },
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
            '/wp-json/wp': {
                target: 'http://prewpadmin_9.cmfbl.com', // http://prewpadmin.cmfbl.com/
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
            '/api_demo_domain': {
                // target: 'https://pc-demo.mc900.com',
                // target: 'https://h5-demo.mc900.com',
                target: 'https://preh5-demo.mc900.com',
                // target: 'https://pc-demo.mc900.com',
                pathRewrite: { '/api_demo_domain': '' },
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
            '/api_demo_url': {
                // target: 'https://pc-demo.mc900.com',
                // target: 'https://h5-demo.mc900.com',
                target: 'https://preh5-demo.mc900.com',
                // target: 'https://pc-demo.mc900.com',
                pathRewrite: { '/api_demo_url': '' },
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
            '/th-TH/cats-manage-api': {
                target: h5URL,
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
                target: h5URL || 'https://uatwph5-5.cmfbl.com', // prewph5公司id为2 prewph5_1公司id为60  'http://prewph5_9.cmfbl.com'  // h5URL
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
                target: 'https://uatcom-03b1ee05fa3b4fcbe21e9da72e5516cd-prebo.cmfbl.com/cats-gateway/upload'
            },
            '/api/wwwmc900.com': {
                target: h5URL || 'https://prewap.mc900.com',
                pathRewrite: { '^/api/wwwmc900.com': '/api' },
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
            '/PostbackCloudFunciton': {
                target: 'https://us-central1-madrid-investing.cloudfunctions.net',
            },
            '/cats-gateway-auth2': {
                // auth2 代理
                target: h5URL || 'https://prewpadmin_10.cmfbl.com',
                onProxyReq: function (proxyReq, req, res, options) { // 由于vue中使用了body-parser 导致http中的body被序列化两次，从而使得配置代理后后端无法获取body中的数据
                    if (req.body) {
                        const reg = new RegExp('application/json')
                        if (reg.test(proxyReq.getHeader('Content-Type'))) {
                            const bodyData = JSON.stringify(req.body)
                            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
                            proxyReq.write(bodyData)
                        }
                    }
                }
            }
        },
        before: require('./mock/mock-server.js')
    },
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('preload-index').delete('prefetch-index').delete('optimize-css')
        config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js')
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
