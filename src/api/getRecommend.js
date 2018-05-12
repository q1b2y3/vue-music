//请求recommend的接口数据
import jsonp from 'common/js/jsonp'
import {commonParams,options} from 'common/js/config'
import axios from 'axios'

export function getRecommend(){
	let url='https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
	//把参数及需要添加的参数  共同赋值到 另一个空对象中
	let data=Object.assign({},commonParams,{
		platform:'h5',
		uin:0,
		needNewCode:1,
	});
	//jsonp请求发送数据
	return jsonp(url,data,options);
}
//获取推荐列表
export function getDiscList(){
	let url='https://u.y.qq.com/cgi-bin/musicu.fcg';
	 let data=Object.assign({},commonParams,{
	 	callback:'recom5329609672451231',
		g_tk:5381,
		loginUin:0,
		hostUin:0,
		format:'jsonp',
		inCharset:'utf8',
		outCharset:'utf-8',
		notice:0,
		platform:'yqq',
		needNewCode:0,
		data:'{"comm":{"ct":24},"category":{"method":"get_hot_category","param":{"qq":""},"module":"music.web_category_svr"},"recomPlaylist":{"method":"get_hot_recommend","param":{"async":1,"cmd":2},"module":"playlist.HotRecommendServer"},"playlist":{"method":"get_playlist_by_category","param":{"id":8,"curPage":1,"size":40,"order":5,"titleid":8},"module":"playlist.PlayListPlazaServer"},"new_song":{"module":"QQMusic.MusichallServer","method":"GetNewSong","param":{"type":0}},"new_album":{"module":"QQMusic.MusichallServer","method":"GetNewAlbum","param":{"type":0,"category":"-1","genre":0,"year":1,"company":-1,"sort":1,"start":0,"end":39}},"toplist":{"module":"music.web_toplist_svr","method":"get_toplist_index","param":{}},"focus":{"module":"QQMusic.MusichallServer","method":"GetFocus","param":{}}}',
		
	 });
	 return jsonp(url,data,{
	 	param:'jsonpCallback',
		prefix:'recom532960967245123',
	 })
}

export function getDiscAxios(disstid){
	let url='/api/disc';
	let data=Object.assign({},commonParams,{
		type:1,
		json:1,
		utf8:1,
		onlysong:0,
		disstid:disstid,
		g_tk:5381,
		loginUin:0,
		hostUin:0,
		format:'json',
		notice:0,
		platform:'yqq',
		needNewCode:0
	})
	return axios.get(url,{
		params:data
	}).then((res)=>{
		return Promise.resolve(res.data);
	})
}
//没有使用代理服务器
export function getMovieList(){
	let url='http://ykrec.youku.com/find/packed/list.json';
	let data=Object.assign({},{
		apptype:1,
		pg:23,
		module:10,
		pl:14,
		picSize:1,
		session:'1507556890399u0x',
		stime:0,
		guid:'1502804690812J33',
		
	})
	return jsonp(url,data,{
		callback:'tuijsonp3'
	})
}
//使用axios代理服务器
export function getMovieListAxios(){
	let url='/youku/youkum';
	let data=Object.assign({},{
		apptype:1,
		pg:23,
		module:10,
		pl:14,
		picSize:1,
		format:"json",
		session:'1507562788929aq9',
		stime:0,
		guid:'1502804690812J33'
	})
	return new Promise((resolve,reject)=>{
		axios.get(url,{
			params:data
		}).then(res=>{
		//resolve即快捷的异步
		if(res){
			resolve(res);
		}
		else{
			reject(err);
		}
	})
		
	});
}
