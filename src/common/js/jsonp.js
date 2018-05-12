import originJsonp from 'jsonp'

//jsonp的请求
export default function jsonp(url,data,option){
	url += `${url.indexOf('?')<0?'?':"$"}${param(data)}`;
	//封装异步请求方法
	return new Promise((resolve,reject)=>{
		originJsonp(url,option,(err,result)=>{
			//发送请求 带有配置参数
			if(result){
				resolve(result);
			}
			else
			{
				reject(err);
			}
		})
	})
}


//拼接URL尾部参数的方法
function param(data){
	let url="";
	for(var i in data){
		let value=data[i]!==undefined?data[i]:"";
		//转码
		url+=`&${i}=${encodeURIComponent(data[i])}`;
		
	}
	return url?url.substring(1):"";
	
}

