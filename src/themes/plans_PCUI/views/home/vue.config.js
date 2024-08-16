module.exports = {
    devServer: {
        proxy: {
            '/C/Item/GetItems': {
                target: 'https://news-prd.headline.net',
                changeOrigin: true
            }
        }
    }
}
