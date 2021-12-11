import { defineAsyncComponent } from 'vue'

export default {
    title: '行情列表111',
    tag: 'quoteList',
    hideUserRole: true,
    tagIcon: 'el-icon-star-on',
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    config: [
        {
            name: 'styleConfig',
            type: 'Array',
            label: '样式选择',
            max: 1,
            config: [
                {
                    type: 'custom',
                    component: defineAsyncComponent(() => import('./components/styleForm.vue')),
                }
            ],
        },
        {
            type: 'Array',
            name: 'items',
            label: '板块',
            max: 50,
            config: [
                {
                    name: 'title',
                    label: '板块标题',
                    type: 'Input',
                    default: ''
                },
                // {
                //     name: 'tagDiplay',
                //     label: '排版类型',
                //     type: 'Radio',
                //     options: [
                //         { value: '1', label: '分组' },
                //         { value: '2', label: '分类' },
                //         { value: '3', label: '板块' }
                //     ],
                //     default: '3'
                // },
                {
                    name: 'code_ids_all',
                    filterName: 'tagDiplay',
                    include: ['3'],
                    label: '产品',
                    type: 'Product',
                    default: {}
                },
            ]
        }
    ]
}
