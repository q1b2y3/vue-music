/**
 * Symbol 对象  一定不相等的两个对象
 * JS一共有几种数据类型 
 * 
 */
{
	let s = Symbol();
	console.log(typeof s);
}

{
	let a = Symbol("abc");
	let b = Symbol("abc");
	console.log( typeof a.toString() + "  " + a.toString());
	console.log(b);
	console.log(a===b);
	//用的最多的地方 是对象防止重名属性
}

{
	
	let mytype = Symbol('name');
	let name = Symbol();
	let paymoney = Symbol();
	
	let a = {};
	a['paymoney'] = 123456;
	a['name'] = "张三";
	a.age = 15;
	Object.defineProperty(a,'sex',{value:'男'});
	console.log(a);
	
	a[name] = "张三";
	a[paymoney] = 213123;
	console.log(a[name]);
}


{
	let a = Symbol.for("abc");
	let b = Symbol.for("abc");
	
	console.log(a===b);
}
