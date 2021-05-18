import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import Layout from '@index/views/Layout/Index.vue'

const routes = [
    {
        path: '',
        component: Layout,
        redirect: 'pages',
        children: [
            {
                path: 'pages',
                name: 'Pages',
                component: () =>
                    import(/* webpackChunkName: "Pages" */ '@index/views/Pages/Index.vue')
            },
            {
                path: 'editor',
                name: 'Editor',
                component: () =>
                    import(/* webpackChunkName: "Editor" */ '@index/views/Editor/Index.vue')
            },
            {
                path: 'setting',
                name: 'Setting',
                component: () =>
                    import(/* webpackChunkName: "Editor" */ '@index/views/Setting/Index.vue')
            },
            {
                path: 'install',
                name: 'Install',
                component: () =>
                    import(/* webpackChunkName: "Editor" */ '@index/views/Install.vue')
            },
            {
                path: 'publishlist',
                name: 'PublishList',
                component: () =>
                    import(/* webpackChunkName: "Editor" */ '@index/views/PublishList.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
