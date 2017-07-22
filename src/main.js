// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
// import router from './router';2.0
import VueRouter from 'vue-router';
// 引进三个路由
import Goods from './components/goods/goods.vue';
import Ratings from './components/ratings/ratings';
import Seller from './components/seller/seller';
// 引入style  公共使用样式
import './common/stylus/index.styl';

// 引入axios和vue-axios
// import axios from 'axios';
// import VueAxios from 'vue-axios';

Vue.use(VueRouter);
// Vue.use(axios);
// Vue.use(VueAxios);
// Vue.prototype.$http = axios;

// routes路由配置项
const routes = [
  // 第一个语句的意思是指 页面加载之后直接跳转到goods路由内容
  {path: '/', redirect: '/goods'},
  {path: '/goods', component: Goods},
  {path: '/ratings', component: Ratings},
  {path: '/seller', component: Seller}
];

const router = new VueRouter({
  linkActiveClass: 'active',
  routes: routes
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});

// router.go('/goods');
