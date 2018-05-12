
import {getLyric} from '../../api/song'
import {Base64} from 'js-base64'
import {ERR_OK} from 'common/js/config'

export default class Song{
	constructor({id,mid,name,singer,album,duration,image,url}){
		this.id=id;
		this.mid=mid;
		this.name=name;
		this.singer=singer;
		this.album=album;
		this.duration=duration;
		this.image=image;
		this.url=url;
	}
	//获取歌词
	getLyric(){
		return new Promise((resolve,rejrct)=>{
			getLyric(this.mid).then(req=>{
			
				if(req.code===ERR_OK){
					//若歌词不为空
					if(req.lyric){
						//解析
						this.lyric=Base64.decode(req.lyric)
						resolve(this.lyric);
					}
					else{
						reject("这首歌没有歌词");
					}
				}
				
			})
		})
		
	}
	
}

export function creatSong(musicData){
	return new Song({
		id:musicData.songid,
		mid:musicData.songmid,
		name:musicData.songname,
		singer:filterSinger(musicData.singer),
		album:musicData.albumname,
		duration:musicData.interval,
		image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
		url:`http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`

		
	})
}



function filterSinger(singer){
	let ret=[];
	if(!singer){
		return ''
	}
	singer.forEach(s=>{
		ret.push(s.name)
	})
	return ret.join('/')
}



