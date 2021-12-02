const fs = require('fs')
const path = require('path')
const ftp = require('./ftp')

const md = fs.readFileSync(path.resolve(__dirname, './PCUI配置.md'), 'utf8')
const html = fs.readFileSync(path.resolve(__dirname, '../build_folder/dist/index_template.html'), 'utf8')
const newHtml = html.replace(/\/\*\s##wp_imsService\sstart##\s\*\/[\s\S]*wp_tradeService end##\s\*\//, md)
fs.writeFileSync(path.resolve(__dirname, '../build_folder/dist/index.html'), newHtml)

ftp({
    srcDir: '../build_folder/dist',
    destDir: '/web2',
    connectOptions: {
        host: '172.31.0.100',
        port: 21,
        user: 'moore',
        password: 'DqkxjZp2oTrfiiRM'
    }
})
