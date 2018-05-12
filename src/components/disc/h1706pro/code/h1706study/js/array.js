
//[1,2,6,7,2,9]  3 后面加一个 5
function sub(arry,index,add){
	let ary = arry.slice();
	ary.splice(index,0,add);
	return ary
}
console.log(sub([1,2,6,7,2,9],3,5));
