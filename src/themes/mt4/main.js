import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VantBase from '@/utils/vantBase'
const app = createApp(App)
app.use(VantBase).use(store).use(router);
store.dispatch('_base/getCompanyInfo').then(()=>{
    app.mount('#app')
});

