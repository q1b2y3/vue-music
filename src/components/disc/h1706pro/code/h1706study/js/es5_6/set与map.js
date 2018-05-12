/**
 * SET与MAP
 * 
 * set实际上就是 里面的数据 自动去重复
 */
const s = new Set([1,2,3,7,7,4,4,5,5,3]);

const arry = new Array(1,2,3,7,7,4,4,5,5,3);
console.log(arry);
//如何实现数组去重复？
console.log([...s]);

const s1 = new Set([null,null]);
//null也可以进行去重
console.log([...s1]);

const s2 = new Set([undefined,undefined]);
//undefined也可以进行去重
console.log([...s2]);

const obj = {
	uname :"张三",
	pwd:123456
}
const s3 = new Set([obj,obj]);
//如果两个相同的对象 也会进行去重
console.log([...s3]);
//如果传入两个空对象 那么不会进行去重 因为在内存中 分配两个地址
const s4 = new Set([{},{}]);
console.log(s4);


const s5 = new Set();
//动态给set来进行赋值
[1,2,3,7,7,4,4,5,5,3].forEach(function(f){
	s5.add(f);
})
console.log(s5);


var a2 = [1,2,3,4,5,6,6,7];
//const s6 = new Set([...arry]);
const s7 = [...new Set(a2)];
console.log(s7);


//[...]
const s8 = new Set([1,2,3,4,5,6,6,9,10]);

{
	//set转化为数组的方法 并且去重
	let arry = Array.from(s8);
	console.log(arry);
}

{
	//封装一个去重的方法
	var quchong = arry =>{
		return [...new Set(arry)];
	}
}


{
	//set对象数组的方法
	//size	属性
	//add 添加
	//delete 删除
	//has 查看数据中 是否有某个值
	//clear 清除数组
	let s = new Set([2,3,4,5,6,6,6,6,6,8]);
	console.log(s.size);	//去重之后的长度
}
{
	//遍历出来的方法
	//forEach  for-of 
//	keys()：返回键名的遍历器
//	values()：返回键值的遍历器
//	entries()：返回键值对的遍历器
	//遍历方法
//	forEach()：使用回调函数遍历每个成员
	let s = new Set([2,3,4,5,6,6,6,6,6,8]);
	//set 的键名 
	for(let i of s.keys()){
		console.log(i);
	}
	console.log("--------------------------------")
	for(let i of s.values()){
		console.log(i);
	}
	//set数组 包含的键名的作用是什么？
}

{
	//map 与 filter
	let s1 = new Set([1,2,3,4,4,4,5,6,7]);
	//map里面的X 遍历出 数组中每一个值
	//s2等于s1的所有数都进行+1
	//map 返回值 为一个新的数组
	let s2 = new Set([...s1].map(x=>x*2));
	console.log([...s2]);
	
	let s3 = new Set([...s1].filter(x=>x%2==0));
	console.log([...s3]);
	//map 和 filter的区别
}
{
	
	//交集
	//并集
	//差集
	let s1 = new Set([2,3,4,5]);
	let s2 = new Set([4,5,6,7]);
	//并集
	let s3 = new Set([...s1,...s2]);
	console.log([...s3]);
	
	//交集 
	//[...s1].filter(x=>s2.has(x)) 将s1进行过滤 包含s2的值 就过滤出来 这样可以取交集
	let s4 = new Set([...s1].filter(x=>s2.has(x)));
	console.log([...s4])
	
	//差集
	let s5 = new Set([...s1].filter(x=>!s2.has(x)));
	console.log([...s5]);
	
	//算法:求两个集合的交集/并集/差集
	let cont = (arry1=[],arry2=[],type=0)=>{
		let s1 = new Set(arry1);	//集合1
		let s2 = new Set(arry2);	//集合2
		//并集
		if(type==0){
			return [...new Set([...s1,...s2])];
		//交集
		}else if(type==1){
			return [...new Set([...s1].filter(x=>s2.has(x)))];
		//差集
		}else{
			return [...new Set([...s1].filter(x=>!s2.has(x)))];
		}
	}
	let co1 = cont([1,3,5,6,7],[5,6,1,9,0],0);
	console.log("两个数组 取交集为:" + co1);
	
}

{
	//WeakSet
	//WeakSet 数组中 只能包含对象
	//不记录垃圾箱 存放的临时的对象
	//不侵占内存  不稳定
	//同一个页面传递 对象时候 可以看情况使用
	//如果是一个 经常操作的对象 那就不要放在 WeakSet里面
	let ws = new WeakSet();
	
	//数据结构
	//时间复杂度 空间复杂度
	//次幂的增长
//	时间复杂度  :  o*o*o/2
	let a1 = [];
	for(let i=0;i<10;i++){
		a1.push(i);
	}		

	let t1 = new Date().getTime();
	
	let a2 = [];
	let flag = true;
	for(let i=0;i<a1.length;i++){
		for(let j=i+1;j<a1.length;j++){
			if(a1[i]==a1[j]){
				flag = false;
			}
		}
		if(flag){
			a2.push(a1[i]);
		}else{
			flag = true;
		}
	}
	let t2 = new Date().getTime();
	console.log(`此算法共经过${t2-t1} ms`);
	
	let t3 = new Date().getTime();
	
	let a3 = [...new Set(a1)];
	
	let t4 = new Date().getTime();
	console.log(`此算法共经过${t4-t3} ms`);
}
/**
 * 对象冻结 对象
 * 
 * MAP
 * 
 */

{
	let maps = new Map();
	//Map的添加方式 
	maps.set("a","b")
	//Map的获取方式
	console.log(maps.get("a"));
	//通过[...map] 可以将Map 转化为数组
	console.log([...maps]);
	
}
{
	let maps = new Map([["uname","王五"],["pwd",12345]]);
	console.log(maps.get("uname"));
	//json --->转 map
	//map --->转json
}

{
	let maps = new Map();
	const k1 = ["a"];
	const k2 = ["a"];
	//maps 的键 是根据地址有关 和内容是无关
	maps.set(k1,1);
	maps.set(k2,2);
	console.log(maps.get(k2));
}

{
	let maps = new Map().set(1,"张三").set(2,"王五").set(3,"马六");
	//map和过滤器的结合
	let maps2 = [...maps].filter(([k,v])=>k<3);
	console.log(maps2)
}

{	
	//MAP数组 如何 转化为 对象？
	let maps = new Map().set("username","张三").set("pwd",123456).set('sex',0);
	console.log([...maps]);
	
	/**
	 * 数组转对象的方法
	 */
	let createMapofObject = m =>{
		let o = Object.create(null);	//创建对象
		for(let [k,v] of m){			//遍历map
			o[k] = v;					//给对象赋值
		}
		return o;						//返回对象
	}
	let user = createMapofObject(maps);
	console.log(user);
	
	//对象 ===>JSON
	let createMapToJson = m =>{
		return JSON.stringify(createMapofObject(m));		
	}
	
	console.log(createMapToJson(maps));	
	
	//对象转数组
	let createObjectOfMap = o =>{
		let m = new Map();
		for(let k of Object.keys(o)){
			m.set(k,o[k]);	
		}
		return m;
	}
}

