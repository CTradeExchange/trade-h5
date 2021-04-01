import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VantBase from './vantBase'
import Socket from '@/plugins/socket/socket'
import { Collapse, CollapseItem, Toast } from 'vant'

const app = createApp(App)
app.use(Collapse)
app.use(CollapseItem)
app.use(Toast)
app.use(VantBase).use(store).use(router).use(Socket, { $store: store })
store.dispatch('_base/getCompanyInfo').then(() => {
    app.mount('#app')
})
