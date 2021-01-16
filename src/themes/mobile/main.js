import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VantBase from '@/utils/vantBase'

createApp(App).use(VantBase).use(store).use(router).mount('#app')
