export default class singer{
	constructor({id,name,imgid}) {
	    this.id=id;
	    this.name=name;
	    this.avatar=`//y.gtimg.cn/music/photo_new/T001R300x300M000${imgid}.jpg?max_age=2592000`,
	    this.singermid=imgid
	}
}

