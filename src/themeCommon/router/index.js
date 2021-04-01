// import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: '/withdraw',
        name: 'withdraw',
        component: () => import(/* webpackChunkName: "withdraw" */ '../user/withdraw.vue'),
        meta: {
            title: '取款',
            footerMenu: false
        }
    },
    {
        path: '/withdrawRecord',
        name: 'withdrawRecord',
        component: () => import(/* webpackChunkName: "withdraw" */ '../user/withdrawRecord.vue'),
        meta: {
            title: '取款记录',
            footerMenu: false
        }
    }
]
// const router = createRouter({
//     history: createWebHistory(process.env.BASE_URL),
//     routes
// })
export default routes
