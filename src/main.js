import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as echarts from 'echarts'
import ElementPlus from 'element-plus'
import './assets/style/common.css'
import 'element-plus/dist/index.css'
const app = createApp(App)
app.provide('$echarts', echarts)
app
  .use(router)
  .use(store)
  .use(ElementPlus)
  .mount('#app')