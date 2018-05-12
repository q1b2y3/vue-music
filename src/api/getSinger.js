
import jsonp from 'common/js/jsonp'
import {commonParams,options} from 'common/js/config'

export function getSinger(){
	let url='https://shc.y.qq.com/v8/fcg-bin/v8.fcg';
	let data=Object.assign({},commonParams,{
		channel:'singer',
		page:'list',
		key:'all_all_all',
		pagesize:100,
		pagenum:1,
		loginUin:0,
		hostUin:0,
		notice:0,
		platform:'yqq'
	})
	return jsonp(url,data,options)
}

export function getSingerDetail(singermid){
	let url="https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg";
	let data = Object.assign({},commonParams,{
    loginUin:0,
    hostUin:0,
    platform:'yqq',
    needNewCode:0,
    singermid:singermid,
    order:'listen',
    begin:0,
    num:30,
    songstatus:1
  });
    return jsonp(url,data,options);
}
