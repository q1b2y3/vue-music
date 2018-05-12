import jsonp from 'common/js/jsonp'
import {commonParams,options} from 'common/js/config'
import axios from 'axios'

export function getSearchHotList(){
	let url='https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
	let data=Object.assign({},commonParams,{
		uin:0,
		platform:'h5',
		needNewCode:1
	})
	return jsonp(url,data,options)
}

/**
 * @param w   搜索的内容
 * @param p   当前的页数
 * @param perpage 当前搜索出来的个数
 */
export function getSearch({w,p,perpage}){
	const url='https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
	const data=Object.assign({},commonParams,{
		uin:0,
		notice:0,
		platform:'h5',
		needNewCode:1,
		w,
		zhidaqu:1,
		catZhida:1,
		t:0,
		flag:1,
		ie:'utf-8',
		sem:1,
		aggr:0,
		perpage,
		n:perpage,
		p,
		remoteplace:'txt.mqq.all'
	})
	return jsonp(url,data,options)
}
