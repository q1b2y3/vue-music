/**
 * Promise 对象 处理同步和异步
 * 同步 和 异步 
 *对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、 
  fulfilled（已成功）和rejected（已失败）。
 *一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，
     只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，
    状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。
    
     如何使用promise对象呢？以及如何在项目中 使用呢？
 */
//{
//	let pro = new Promise((resolve,reject)=>{
//		//在这里 可以做一些业务逻辑 获取到 某个data
//		let jso = "{username:'张三'}";
//		let err = "失败";
//		
//		if(true){
//			resolve(jso);
//		}else{
//			reject(err);
//		}
//	});
//	console.log(pro);
//	pro.then((data)=>{
//		console.log(data);
//	});
//	console.log(1);
//}

{
	//Promise 新建后立即执行，所以首先输出的是Promise。
	//然后，then方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以resolved最后输出。
	
	//then可以用链式开发 并且可以调用方法
	let fun1 = type =>{
		return new Promise((res,rej)=>{
			if(type){
				res("hello  ");
			}
		})
	}
	let fun2 =()=>{
		console.log("world");
	}
	let fun3 =()=>{
		console.log("!");
	}
	fun1(true).then(message=>{
		console.log(message);
	}).then(fun2).then(fun3);
}

{
	//如果拥有两个Promise 对象 如何让他们 共同执行完毕之后 回调？
	let p1 = new Promise((res,rej)=>{
		//用户名 密码
		setTimeout(()=>{
			res("hello");
		},3000);
	})
	
	let p2 = new Promise((res,rej)=>{
		//人物头像
		setTimeout(()=>{
			res(" world!");
		},1000);
	});
	
	Promise.all([p1,p2]).then(message=>{
		//做得逻辑 需要两个ajax或者两个 更多个 请求后的结果集 那么我通过all来进行操作
		console.log(message);
	});
}
