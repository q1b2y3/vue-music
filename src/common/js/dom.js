//判断当前class是否含有样式
export function hasClass(el,className){
	//判断是否有class
	let reg=new RegExp('(^|\\s)'+className+'(\\s|$)')
	return reg.test(el.className)
}

export function addClass(el,className){
	if(hasClass(el,className)){
		return
	}
	//将每个class分成数组
	let newClass=el.className.split(' ')
	
	//添加class
	newClass.push(className)
	//转化为class
	el.className=newClass.join(' ')
}
//节点属性  及 获取节点属性的方式
export function getData(el,name,val){
	let prefix="data-"
	let prefixname=prefix+name
	//若val存在  则给节点某个属性并返回
	if(val){
		return el.setAttribute(prefixname,val);
	}
	//若val不存在  则获取某个属性
	return el.getAttribute(prefixname);
}
//判断   登陆使用的浏览器类型  及加入厂商的的前缀
let elementCreateStyle=document.createElement('div').style;

let ventor=(()=>{
	let transformName={
		webkit:'webkitTransform',
		o:'OTransform',
		ms:'msTransform',
		Moz:'MozTransform',
		standard:'transform'
		
	}

	for(let key in transformName){
		//判断在哪个浏览器中运行
		if(elementCreateStyle[transformName[key]]!=="undefined"){
			return key;
		}
		return false;
	}
})();

//拼接transform
export function prefixStyle(style){
	//console.log(ventor)
	if(ventor===false){
		//浏览器有问题  兼容不到  相关浏览器
		return
	}
	if(ventor==="standrad"){
		return style
	}
	return ventor+style.charAt(0).toUpperCase()+style.substr(1);
}


