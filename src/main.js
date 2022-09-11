import Vue from 'vue'
import VueRouter from 'vue-router'
import Antd from 'ant-design-vue'
import App from './App.vue'
import Dashboard from './views/Dashboard.vue'
import Program from './views/Program.vue'
import store from './store'
import 'ant-design-vue/dist/antd.css';
import './helpers/notificationCustomStyle.css';

 

Vue.use(VueRouter);
Vue.use(Antd);


export const router = new VueRouter({
  mode: "history",
  fallback: true,
  routes: [
    {path: "/", component: Dashboard},
    {path: "/program/:id",component: Program},
  ]
})


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
