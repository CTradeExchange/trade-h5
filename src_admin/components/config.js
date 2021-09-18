import img from '@h5/modules/img/config.js'
import swipe from '@h5/modules/swipe/config.js'
import notice from '@h5/modules/notice/config.js'
import layout from '@h5/modules/layout/config.js'
// import quote from '@h5/modules/quote/config.js'
// // import infoflow from '@h5/modules/infoflow/config.js';
// import infoflow2 from '@h5/modules/infoflow2/config.js'
import menulist from '@h5/modules/menulist/config.js'
// import position from '@h5/modules/position/config.js'
import selfSymbol from '@h5/modules/selfSymbol/config.js'
import text from '@h5/modules/text/config.js'
// import tinymce from '@h5/modules/tinymce/config.js'
import redpacket from '@h5/modules/redpacket/config.js'
import template from '@h5/modules/template/config.js'
import minePerson from '@h5/modules/minePerson/config.js'
// import mineTop from '@h5/modules/mineTop/config.js'
import quoteList from '@h5/modules/quoteList/config.js'
// import nav from '@h5/modules/nav/config.js'
import registerForm from '@h5/modules/registerForm/config.js'
import news from '@h5/modules/news/config.js'
import ad from '@h5/modules/ad/config.js'
import luckyWheel from '@h5/modules/luckyWheel/config.js'
import productsSwipe from '@h5/modules/productsSwipe/config.js'

export const mobileComponentsConfig = async () => {
    return [
        img,
        swipe,
        notice,
        layout,
        // quote,
        // infoflow2,
        menulist,
        // position,
        selfSymbol,
        // nav,
        text,
        // tinymce,
        quoteList,
        redpacket,
        template,
        minePerson,
        // mineTop,
        await registerForm(),
        news,
        ad,
        luckyWheel,
        productsSwipe
    ]
}
export const pcComponentsConfig = []
export const example = [
    {
        title: '轮播【废弃】',
        tag: 'swipe1',
        tagIcon: 'el-icon-star-on',
        include: ['home'], // 包含的页面code
        exclude: ['home'], // 排除的页面code
        hidden: true, // 左侧隐藏
        document: 'https://element.eleme.cn/#/zh-CN/component/input',
        config: [
            {
                name: 'autoplay',
                label: '轮播间隔',
                type: 'Select',
                default: 0,
                options: [
                    { value: 0, label: '0s' },
                    { value: 1000, label: '1s' },
                    { value: 5000, label: '5s' }
                ]
            },
            {
                name: 'width',
                label: '轮播宽度',
                type: 'Input',
                default: 'auto'
            },
            {
                name: 'info',
                label: '轮播宽度',
                type: 'Radio',
                default: true,
                options: [
                    { value: true, label: '是' },
                    { value: false, label: '否' }
                ]
            },
            {
                name: 'height',
                label: '轮播高度',
                type: 'Input',
                default: 'auto'
            },
            {
                name: 'items',
                type: 'Array',
                label: '轮播项',
                max: 5,
                config: [
                    {
                        name: 'title',
                        label: '标题',
                        type: 'Input',
                        default: '我是标题'
                    },
                    {
                        name: 'href',
                        label: '跳转地址',
                        type: 'Select',
                        default: 0,
                        options: [
                            { value: 0, label: '0s' },
                            { value: 1000, label: '1s' },
                            { value: 5000, label: '5s' }
                        ]
                    },
                    {
                        name: 'imgUrl',
                        label: '图片地址',
                        type: 'Input',
                        default: '图片地址'
                    },
                    {
                        name: 'describe',
                        label: '描述文字',
                        type: 'Input',
                        default: '描述文字'
                    }
                ]
            },
            {
                name: 'content',
                label: '内容',
                type: 'Tinymce'
            },
            {
                name: 'config',
                type: 'Object',
                label: '基础配置',
                config: [
                    {
                        label: '配置项1',
                        name: 'abc',
                        type: 'Select',
                        options: [
                            { value: 0, label: '0s' },
                            { value: 1000, label: '1s' },
                            { value: 5000, label: '5s' }
                        ],
                        default: 0
                    },
                    { name: 'efg', label: '配置项2', type: 'Input', default: 2 }
                ]
            }
        ]
    }
]
