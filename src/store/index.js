//

import Vue from 'vue'
import Vuex from 'vuex'
import  mutations from './mutations'
import  state from './state'
import * as getters from './getters'
import * as actions from './action'
//把debug的结果  输出到控制台页面中
//创建日志
import createLogger from 'vuex/dist/logger'
//vue集成vuex
Vue.use(Vuex);

//创建debug
//上线的话   不需要创建debug  因为影响性能
//debug可以检测到对象中的各个属性的变化
//strict  开启debug
//若不配置  则为不开启
const debug=process.env.NODE_ENY !=='production'


//创建vuex的实例
export default new Vuex.Store({
	mutations,
	getters,
	state,
	actions,
	strict:'debug',   //开启debug
	plugins:debug?[createLogger()]:[]
})
