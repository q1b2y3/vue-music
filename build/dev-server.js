require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

//引入axios包---生成代理服务器
var axios=require('axios')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
//中间插件接口
//第一、创建router
var apiRouter=express.Router()
//第二、创建get请求路径
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
//集成到服务器中
apiRouter.get("/lyric",(req,res)=>{
 	let url="https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg";
 	axios.get(url,{
		headers:{
			host:'c.y.qq.com',
			referer:'https://c.y.qq.com/'
		},
		params:req.query
	}).then(response=>{
		//转换为JSON返回给前台

		let ret=response.data;
		let json;
		if(typeof ret==="string"){
			/*
			 * /^   开始
			 * \w+ 任意字母开始
			 * \(  左括号
			 * \)  右括号
			 * $/  结束
			 * ()  小括号内
			 */
			var reg = /^\w+\(({[^()]+})\)$/
			var matches=ret.match(reg)
			if(matches){
				json=JSON.parse(matches[1])
			}
		}
		res.json(json)
	})
})

apiRouter.get("/disc",(req,rep)=>{
	let url='https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
	axios.get(url,{
		headers:{
			host:'c.y.qq.com',
			referer:'https://y.qq.com/'
		},
		params:req.query
	}).then(response=>{
		
		rep.json(response.data);
	})
})

app.use("/api",apiRouter);

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}