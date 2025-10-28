import 'amfe-flexible';
// Vant 函数式组件样式（Dialog/Toast）需手动引入
import 'vant/es/dialog/style'
import 'vant/es/toast/style'
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
