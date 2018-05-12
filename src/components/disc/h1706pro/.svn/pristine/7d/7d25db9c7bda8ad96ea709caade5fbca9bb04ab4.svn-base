/**
 * VUE开发客户端代码 步骤
 * 第一步 包引入
 * 第二步 创建一个DIV 包含所有 并且给一个标识符ID
 * 第三步 创建VUE的实例
 * 第四步 搭架构
 * 第五步 项目开发
 * 		需求 功能点
 * //1.vue如何去读取数据 以及请求？
 * //2.vue在何时读数据？  ==>VUE的声明周期 
 * created	VUE的数据还没有进行加载 	插入节点
 * mounted	VUE的数据已经完全加载		请求数据
 * 
 *
 * 		获取数据  ----> 放入页面中 --->一点点完成业务逻辑
 * 
 * 		
 */
new Vue({
	el:"#app",
	//VUE的数据是进行动态刷新的
	data:{
		items:[]		//获取后台购物车数据
	},
	methods:{
		//改变商品数量
		changeProduceNum:function(id,type){
			//控制数量增减  0 -  1 +
			if(type ==0){
				//遍历商品数组
				this.items.forEach(data=>{
					//判断 从页面获取的此商品 和 数组中的某个商品的匹配
					if(data.productId == id){
						//让商品进行减少
						data.productNumber--;
						//发送后台请求 更改数据库里面的数据
						//商品减少不能小于0
						if(data.productNumber<0){
							data.productNumber = 0;
						}
					}
				})
			}else{
				//遍历商品数组
				this.items.forEach(data=>{
					//判断 从页面获取的此商品 和 数组中的某个商品的匹配
					if(data.productId == id){
						//让商品数量进行累加
						data.productNumber++;
						//当前选择商品个数 是否大于你的库存
						if(data.productNumber>data.productQuantity){
							alert(`${data.productName}目前剩余库存为${data.productQuantity} 您已经买爆炸了!!!!`)
							data.productNumber= data.productQuantity;
						}
					}
				})
			}
		}
	},
	mounted:function(){
		//vue-resource
		//当页面渲染之后 我来进行请求数据
		this.$http.get("http://127.0.0.1:8020/h1706study/data/cartData.json",{}).then(req=>{
			this.items = req.data.result.list;
		})
	}
});
