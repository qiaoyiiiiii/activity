import './assets/main.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router/index.js'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)

app.mount('#app')