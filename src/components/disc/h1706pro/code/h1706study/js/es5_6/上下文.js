/**
 * JS上下文
 * DATA在哪里引入的？常用的函数 String Image这一些对象是在哪里来的呢？
 * 为什么函数表达式 无法通过_e 来进行调用呢
 */
var content_$_util = function _e(){
	console.log("杀杀杀");
}
//_e();

console.log("es0")
function es1(){	
	console.log("es1")
	function es2(){
		console.log("es2")
		function es3(){
			console.log("es3")
		}
		es3()
	}
	es2()
}
es1();

//当我们定义js文件的时候 
//js解析器 帮助我们 解析到 这个文件是一个JS
//解析对象
//GlobalContextVo 
//(GlobalContextVo===window===VO)

//系统先发现这个解析器==>activeExecutionContext（执行上下文）===>GlobalContextVo
//理论面试题   var 哪里来的 ？ let哪里来的？ function 哪里来的？

var a = 10;
function test(x){
	var b = 20;
}
test(30);

//VO(context){
//	a:10,
//	test:<ref test fun>
//}
//
//AO(test fun){
//	x:30,
//	b:20
//}

//为什么  方法内定义的变量 方法外部 用不了？
//方法外部 如何 实用内部定义的变量

//nodejs 叫做global
//global === window === Vo
//[[global]] = {
//	Math:<ref math fun>,
//	
//}
//Math String 哪里来的？


//块状作用域 在一个区域内 有自己的上下文的作用域 叫做块状作用域
if(true){
	var x = 10;
}else{
	var y = 20;
}
console.log(x,y);//为什么是 undefined而不是 defined?


//AO对象 指的是 一个方法内的上下文
//AO(fun){
//	arguments:
//}
//function c(a,b){
//}
//AO 比VO多了一个参数 叫做arguments

function test(a,b){
	var c= 10;
	function d(){}
	var e = function _e(){};
	(function x(){});
	b = 20;
	console.log(a,b,c,d,e);
}
test(10);

//VO(context){
//	test:<ref test fun>
//}
////定义 跟 赋值 是两个过程
////定义 
//AO(test fun){
//	a:10,
//	b:20,
//	c:10,
//	d:<ref d fun>,
//	e:<ref _e fun>
//}

/**
 * 1.函数参数 最先被定义(如果没传值 则为undefined)
 * 2.函数声明 第二被定义(如果重复 则进行覆盖)
 * 3.变量声明(初始化变量值为undefined 若发生命名冲突 忽略)
 */

function foo(x,y,z){
	function x(){}
	console.log(x);
}

foo();

function foo(x,y,x){
	function func(){};
	var func;
	console.log(func)
	
//	var foo2 = function _foo(){};
}
foo();

alert(x);			//fun
var x = 10;
alert(x);			//10
x = 20;	
function x(a) {
	function a(){
		console.log(x);		//20
	}
	a();
	console.log(a);			//fun
};
x(x);
alert(x);			//20
if(true) {
	var a = 1;
} else {
	var b = true;
}
alert(a);			//1
alert(b);			//undefined

//Vo(context){
//	x:20,
//	a:1,
//	b:undefined
//}
//
//AO(x){
//	a:<ref a fun>,
//}
//
//AO(a){
//	
//}


//1.var 哪里来的 ？ let哪里来的？ function 哪里来的？
//2.
//if(true){
//	var x = 10;
//}else{
//	var y = 20;
//}
//console.log(x,y);
//以上代码输出结果是什么？
//3.为什么  方法内定义的变量 方法外部 用不了？
//4.Math String 是哪里来的？为什么可以直接进行定义?
//5.执行上下文的执行顺序是什么？