/**
 * 高级对象
 */
/**
 * 对象的构造
 *每个属性 都会有对应的操作 
 * 
 * writable 	对象是否是只读状态
 * enumerable 	是否可以枚举	for in 
 * configurable 	是否可以配置
 * value 		值为什么
 * get/set		对象的写 和 读
 * 
 *[[class]] 哪一个种类的
 *[[extendible]] 对象是否允许增加新的属性
 * 
 */
var obj = new Object();

console.log(obj);


{
//	let person = {
//		name:"张三",
//		pwd:123455,
//		set name:function(val){},
//		get name:function(){return;}
//	}
//	console.log(person.name);
//	delete person.name;
//	console.log(person.name);
	/**
	 * JS的数据类型
	 * String Number null boolean undefined Object Function
	 */
	
}

{
	//属性检测
	//第一个参数:判断对象是谁
	//第二个参数:判断对象里面哪个属性
	let des = Object.getOwnPropertyDescriptor(Object,"prototype");
	console.log(des);
	let person = {
		name:"张三",
		pwd:123456
	}
	let des2 = Object.getOwnPropertyDescriptor(person,"name");
	console.log(des2);
	//底层:为什么创建对象可以更改对象的属性 以及 方法 ？为什么可以删除对象的属性以及方法？
}

{
	//全局定义 用var 定义 和 不用var定义的变量  有什么区别？
	var a = 1;
	console.log(window.a);
	b = 2;
	console.log(window.b);
	
	let descriptora = Object.getOwnPropertyDescriptor(window,"a");
	let descriptorb = Object.getOwnPropertyDescriptor(window,"b");
	console.log(descriptora);
	console.log(descriptorb);
	
	delete window.a;
	delete window.b;
	console.log(`更改之后的a值:${window.a}`);
	console.log(`更改之后的b值:${window.b}`);
}

{
	let dog = {
		name:"圣诞",
		age:3
	}
	/**
	 * 第一个参数 给哪个对象添加属性
	 * 第二个添加什么属性?
	 * 第三个参数为对象 里面包含
	 * 	writable 	对象是否是只读状态
	 * 	enumerable 	是否可以枚举	for in 
	 * 	configurable 	是否可以配置
	 * 	value 		值为什么
	 * 	get/set		对象的写 和 读
	 * 
	 * 用defineProperty创建对象属性 
	 * writable enumerable configurable的默认值 都为false
	 * 
	 * 公共配置项 里面 可以配置 
	 * 属性冻结
	 */
	Object.defineProperty(dog,"price",{value:"2000",enumerable:true,writable:true});
	console.log(dog.price);
	let descriptor = Object.getOwnPropertyDescriptor(dog,"price");
	console.log(descriptor);
	for(let i in dog){
		console.log(i);
	}
}

{
	/**
	 * get 读取 set 写入 方法 
	 * 
	 * 通过set get方法写的话 需要给 属性加一个$
	 */
	let dog = {
		name:"花花",
		age:1,
		$price:null,
		set price(val){
			this.$price = val;
		},
		get price(){
			if(this.$price<3000){
				this.name = "旺旺";
				return "您给的价格太低了 卖不了";
			}else if(this.$price>=3000&&this.$price<5000){
				this.name = "躲躲";
				return "我这只狗可是名犬";
			}else{
				return "卖了"
			}
		}
	}
	
	dog.price = 2000;
	console.log(dog.price);
	console.log(dog);
	
//	let descriptor = Object.getOwnPropertyDescriptor(dog,"price");
//	console.log(descriptor);
	
}

{
	//通过defineProperty 创建对象 也可以通过get来写入
	let dog = {
		name:"花花",
		age:1
	}
	Object.defineProperty(dog,"price",{
		get:()=>{return 2000}
	})
	
	console.log(dog.price);
	
	let descriptor = Object.getOwnPropertyDescriptor(dog,"price");
	console.log(descriptor);
}


{
	/**
	 * 如何给对象写多个属性呢？
	 */
	let dog = {};
	
	Object.defineProperties(dog,{
		name:{value:"圣诞"},
		age:{value:2,enumerable:true,writable:true},
		price:{value:2000}
	})
	let descriptor = Object.getOwnPropertyDescriptor(dog,"price");
	console.log(descriptor);
	console.log(dog);
}

{
	/**
	 * [[class]] 对象中的指的是 某一个类型
	 */
	let ToString = Object.prototype.toString;
	var toType = o => ToString.call(o).slice(8,-1);
	
	console.log(toType(new Date()));
	console.log(toType(null));
	console.log(toType(undefined));
	console.log(toType(new Image));
	
}

{
	//对象的冻结
	//isExtensible 判断对象是否可以添加新的属性
	let dog = {
		name:"圣诞"
	};
	let flag = Object.isExtensible(dog);
	console.log(flag?"能添加新的属性":"不能添加新的属性")
	
	//preventExtensions设置对象不可扩展
	Object.preventExtensions(dog);					//对象冻结
	let flags = Object.isExtensible(dog);
	console.log(flags?"能添加新的属性":"不能添加新的属性")
	dog.name = "花花";
	console.log(dog.name);
	
	//seal 冻结对象里面的所有属性 改为不可以删除 不过可以修改
//	Object.seal(dog);
//	let descriptor = Object.getOwnPropertyDescriptor(dog,"name");
//	console.log(descriptor);
//	dog.name = "旺旺";
//	console.log(dog.name)
	
	//freeze 既不可以删除 也不可以修改 完全冻结
	Object.freeze(dog);								//属性冻结
	let descriptor = Object.getOwnPropertyDescriptor(dog,"name");
	console.log(descriptor);
	dog.name = "旺旺";
	console.log(dog.name)
	
	//如何让自定义的对象不可扩展？
	//如何让对象所有属性不能修改 也不能删除？
	//如何完全冻结对象？
	//什么是对象冻结？对象冻结有哪些常用方法？
}
