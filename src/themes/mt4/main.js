import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VantBase from './vantBase'
import Socket from '@/plugins/socket/socket'
import Colors,{setRootVariable} from './colorVariables'
import { Collapse, CollapseItem, Toast } from 'vant'

setRootVariable(Colors)
const app = createApp(App)
app.use(Collapse)
app.use(CollapseItem)
app.use(Toast)
app.use(NavBar)
app.use(VantBase).use(store).use(router).use(Socket, { $store: store })
store.dispatch('_base/getCompanyInfo').then(() => {
    app.mount('#app')
})
