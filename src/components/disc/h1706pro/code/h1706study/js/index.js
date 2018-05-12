
//让返回值可以处理JSON
Vue.http.options.emulateJSON = true;

new Vue({
	el:"#index",
	data:{
		items:[],
		imgurl:"./img/food-png1.png",
		index:"",
		flag:true
	},
	methods:{
		//无法动态更新页面 需要页面渲染的参数 才能刷新页面
		lifunEnter:function(item){
			this.flag = false;	
			if(item.imgflag){
				item.imgflag = !item.imgflag;
			}
		},
		lifunLeave:function(item){
			this.flag = true;	
			if(!item.imgflag){
				item.imgflag = !item.imgflag;
			}
			
		}
	},
	mounted:function(){

		this.$http.post("http://localhost:8888/main/index",{}).then(req=>{
			this.items = req.data.tjlist;
			this.items.forEach(item=>{
				item.imgflag = true;
//				Object.defineProperty(item,"imgflag",{value:true,})

			})
		});
	}
})
