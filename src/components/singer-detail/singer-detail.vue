<template>
	<transition name="slide">
		<music-list :bgImg="getBgImg" :title="getTitle" :songs="songs"></music-list>
	</transition>
</template>

<script>
	import {getSingerDetail} from 'api/getSinger'
	import {mapGetters} from 'vuex'
	import {ERR_OK} from 'common/js/config'
	import {creatSong} from 'common/js/song'
	import MusicList from 'components/music-list/music-list'
	//console.log(mapGetters(['singer']))
	export default{
		created(){
			this._getSingerDetail();
		},
		data(){
			return{
				songs:[]
			}
		},
		computed:{
			//用vuex接受  singer传递来的对象
			...mapGetters([
				'singer'
			]),
			getTitle(){
				return this.singer.name
			},
			getBgImg(){
				return this.singer.avatar
			}
		},
		methods:{
			
			_getSingerDetail(){
				if(!this.singer.id){
					this.$router.push('/singer');
					return
				}
				getSingerDetail(this.singer.singermid).then(req=>{
					if(req.code===ERR_OK){
						//console.log(req);
						req.data.list.forEach(song=>{
							this.songs.push(creatSong(song.musicData));
						})
					}
					//console.log(this.songs);
				})
				
				
			}
		},
		components:{
			MusicList
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
   .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>