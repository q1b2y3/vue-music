<template>
	<transition name="slide">
		<!--
			bgImg、title、songs由music-list中的props中的值传过来
		-->
		<music-list :bgImg="getBgImg" :title="getTitle" :songs="discItems"></music-list>
	</transition>
</template>

<script>
	import MusicList from 'components/music-list/music-list'
	import {getDiscAxios} from 'api/getRecommend'
	import {mapGetters} from 'vuex'
	import {ERR_OK} from 'common/js/config'
	import {creatSong} from 'common/js/song'
	
	export default {
		data(){
			return{
				discItems:[]
			}
		},
		created(){
			this._getDiscAxios();
		},
		computed:{
			getTitle(){
				return this.disc.title
			},
			getBgImg(){
				return this.disc.cover
			},
			...mapGetters([
				'disc'
			])
		},
		methods:{
			_getDiscAxios(){
				
				getDiscAxios(this.disc.content_id).then(req=>{
					//console.log(this.disc.content_id);
					
					if(req.code===ERR_OK){
						//this.discItems = this._normalizeSongs(req.cdlist[0].songlist)
						req.cdlist[0].songlist.forEach(song=>{
							this.discItems.push(creatSong(song))
						})
					}
				})
			},
//			 _normalizeSongs(list) {
//		        let ret = []
//		        list.forEach((musicData) => {
//		          if (musicData.songid && musicData.albummid) {
//		            ret.push(creatSong(musicData))
//		          }
//		        })
//		        return ret
//		      }
		},
		components:{
			MusicList
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
