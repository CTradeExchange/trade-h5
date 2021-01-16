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
            }
        }
    },
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('preload-index').delete('prefetch-index')
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer('js').use(TerserPlugin, [
                {
                    terserOptions: {
                        compress: {
                            pure_funcs: ['console.table', 'console.log'] // 配置发布时，不被打包的函数
                            // drop_console: true
                        }
                    }
                }
            ])
        }
    },
    pages: {
        index: 'src/themes/mobile/main.js'
    }
}
