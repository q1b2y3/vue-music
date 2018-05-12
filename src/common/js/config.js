//jsonp配置对象及公共参数

//请求参数的配置项
export const commonParams={
	g_tk:5381,
	inCharset:'utf8',
	outCharset:'utf-8',
	format:'jsonp',
	notice:0,
	loginUin:0
}
//jsonp的配置项
export const options={
	param:'jsonpCallback',
	prefix:'recom53296096724512321',
}
//如果请求成功 那么返回0
export const ERR_OK = 0;

export const LIKE_STATE = 0;

//音乐播放形式
export const Mode = {
    sequence:0,       //顺序播放
    loop:1,           //循环播放
    random:2          //随机播放
}
