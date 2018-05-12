// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

//可以使用es6的高级api
//import 'babel-polyfill'
import Vue from 'vue'
//引入vue的index
import store from './store'

import App from './App'

import 'common/stylus/index.styl'
import router from './router'
import vueLazyLoad from 'vue-lazyload'

//import fastclick from 'fastclick'

Vue.config.productionTip = false

//fastclick.attach(document.body)

Vue.use(vueLazyLoad,{
	preLoad:1.3,
	//网络状态不好de时候会出现这张图片
	loading:require('common/img/lazy/lazy-2.gif'),
	attempt:1
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router, 
  store,
  template: '<App/>',
  components: { App }
})
