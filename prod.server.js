var express = require('express')
var axios = require('axios')

var app = express()

var apiRouter = express.Router();

apiRouter.get("/youkum",(req,rep)=>{
	//第三、写入要侵入的路径
	let url='http://ykrec.youku.com/find/packed/list.json';
	//第四、发送请求
	axios.get(url,{
		Headers:{
			Host:'ykrec.youku.com',
			Referer:'http://www.youku.com/'
		},
		params:req.query
	}).then(response=>{
		
		rep.json(response.data);
		
		})
})
apiRouter.get("/lyric",(req,res)=>{
  let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
  axios.get(url,{
    //设置请求信息 以及 加密信息
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response=>{
    //asdfsadfsadf()
    //  /^ 开始
    //   \w+  任意字母开始
    //   \(    左括号
    //   \)  右括号
    //   $/  正则完毕
    //  () 小括号内
    let ret = response.data;
    let json;
    if(typeof ret === "string"){
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg);
      if(matches){
        json = JSON.parse(matches[1]);
      }
    }
    //转换成JSON返回给前台
    res.json(json);
  })
})
apiRouter.get("/disc",(req,rep)=>{
  //第三步  写入你要侵入的请求路径
  let url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';

  //第四步 发送请求
  axios.get(url,{
    //设置请求信息 以及 加密信息
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params:req.query
  }).then(response=>{
    //转换成JSON返回给前台
    rep.json(response.data);
  })
})
apiRouter.get("/rank",(req,rep)=>{
  //第三步  写入你要侵入的请求路径
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';

  //第四步 发送请求
  axios.get(url,{
    //设置请求信息 以及 加密信息
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params:req.query
  }).then(response=>{
    //转换成JSON返回给前台
    rep.json(response.data);
  })
})
apiRouter.get("/ranksong",(req,rep)=>{
  //第三步  写入你要侵入的请求路径
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';

  //第四步 发送请求
  axios.get(url,{
    //设置请求信息 以及 加密信息
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params:req.query
  }).then(response=>{
    //转换成JSON返回给前台
    rep.json(response.data);
  })
})

app.use("/api",apiRouter);

app.use(express.static('./dist'))

module.exports = app.listen(9999)

console.log("服务器运行成功");