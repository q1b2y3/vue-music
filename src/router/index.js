import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

import rank from 'components/rank/rank'
import recommend from 'components/recommend/recommend'
import search from 'components/search/search'
import singer from 'components/singer/singer'
import singerDetail from 'components/singer-detail/singer-detail'
import disc from 'components/disc/disc'
import rankList from 'components/rank-list/rank-list'
import user from 'components/user-center/user-center'


Vue.use(Router)

export default new Router({
  routes: [
  {
  	path:'/',
  	redirect:'/recommend'
  },
	{
		path:'/rank',
		component:rank,
		children:[
		{
			path:':id',
			component:rankList
		}]
	},
	{
		path:'/recommend',
		component:recommend,
		children:[
		{
			path:':id',
			component:disc
		}]
	},
	{
		path:'/singer',
		component:singer,
		children:[
		{
			path:':id',
			component:singerDetail
		}
		]
	},
	{
		path:'/search',
		component:search,
		children:[
		{
			path:":id",
			component:singerDetail
		}]
	},
	{
		path:'/user',
		component:user
	}
	]
})
