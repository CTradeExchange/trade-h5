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
                '@m': resolve('src/pages/mobile'),
            }
        }
    },
    pages: {
        index: 'src/pages/mobile/main.js'
    }
}
